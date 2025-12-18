import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import { UserStackParamList } from '@/navigation/types';
import { db, storage } from '@/firebaseConfig';
import { useFetchClubFields } from '@/hooks/useFetchClubFields';
import { useFetchClubEducators } from '@/hooks/useFetchClubEducators';
import { useFetchClubUpcomingBookings } from '@/hooks/useFetchClubUpcomingBookings';
import { useFetchClubUpcomingEvents } from '@/hooks/useFetchClubUpcomingEvents';
import { useFetchClubGallery } from '@/hooks/useFetchClubGallery';
import { useClubRatingStats } from '@/hooks/useClubRatingStats';
import { useJoinClub } from '@/hooks/useJoinClub';
import { useAuth } from '@/context/AuthContext';

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
    accent: '#E9B782',
};

type Props = NativeStackScreenProps<UserStackParamList, 'clubDetail'>;

// Helper pour convertir un chemin Storage en URL téléchargeable
const getImageUrl = async (imagePath: string | any): Promise<string | null> => {
  if (!imagePath) return null;
  
  // Si c'est déjà une URL complète, retourner tel quel
  if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }

  // Si c'est un chemin Storage (commence par gs:// ou est un simple chemin)
  try {
    if (typeof imagePath === 'string') {
      const imageRef = ref(storage, imagePath);
      return await getDownloadURL(imageRef);
    }
  } catch (err) {
    console.warn('⚠️ Impossible de générer l\'URL pour:', imagePath, err);
  }

  return imagePath?.toString() || null;
};

export default function ClubDetailScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const [club, setClub] = useState<any>(null);
  const [clubPhotoUrl, setClubPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { joinClub, loading: joiningLoading } = useJoinClub();

  const { fields, loading: fieldsLoading } = useFetchClubFields(clubId);
  const { educators, loading: educatorsLoading } = useFetchClubEducators(club?.educatorIds || [club?.educatorId].filter(Boolean));
  const { bookings, loading: bookingsLoading } = useFetchClubUpcomingBookings(clubId);
  const { events, loading: eventsLoading } = useFetchClubUpcomingEvents(clubId);
  const { photos, loading: galleryLoading } = useFetchClubGallery(clubId);
  const { stats: ratingStats, loading: ratingLoading } = useClubRatingStats(clubId);

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      try {
        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);
        if (clubSnap.exists()) {
          const clubData = { id: clubSnap.id, ...clubSnap.data() };
          setClub(clubData);
          
          // Convertir le PhotoUrl si c'est un chemin Storage
          if (clubData.PhotoUrl) {
            const url = await getImageUrl(clubData.PhotoUrl);
            setClubPhotoUrl(url);
          }
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchClub();
  }, [clubId]);

  const handleJoinCommunity = async () => {
    if (!user || !profile) return Alert.alert('Erreur', 'Veuillez vous connecter.');
    try {
      await joinClub({ clubId, userEmail: user.email!, userName: `${(profile as any).firstName} ${(profile as any).lastName}` });
      Alert.alert('Succès', 'Votre demande a été envoyée.');
    } catch (err) { Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue.'); }
  };

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  }

  if (!club) {
    return <SafeAreaView style={styles.centered}><Text>Club non trouvé</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {clubPhotoUrl && <Image source={{ uri: clubPhotoUrl }} style={styles.heroImage} />}
        {!clubPhotoUrl && <View style={[styles.heroImage, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}><Text style={{color: colors.textMuted}}>Pas de photo</Text></View>}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        
        <View style={styles.header}>
            <Text style={styles.clubName}>{club.name}</Text>
            <View style={styles.metaRow}>
                <TouchableOpacity onPress={() => navigation.navigate('reviews', { clubId })}>
                  <MetaItem icon="star" text={`${ratingStats.averageRating.toFixed(1)} (${ratingStats.totalReviews} avis)`} color={colors.accent} />
                </TouchableOpacity>
                <MetaItem icon="location-outline" text={`${club.distanceKm?.toFixed(1) || 'N/A'} km`} />
                {club.isVerified && <MetaItem icon="checkmark-circle" text="Vérifié" color={colors.primary} />}
            </View>
        </View>

        <View style={styles.content}>
            <Section title="Description"><Text style={styles.description}>{club.description || 'Aucune description.'}</Text></Section>
            
            {club.services && (
              <Section title="Certifications">
                <View style={styles.chipsContainer}>
                  {club.services.split(',').map((service: string, idx: number) => (
                    <View key={idx} style={styles.chip}>
                      <Text style={styles.chipText}>{service.trim()}</Text>
                    </View>
                  ))}
                </View>
              </Section>
            )}

            <Section title="Contact & Infos">
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{club.stats?.totalMembers || 0}</Text>
                  <Text style={styles.statLabel}>Membres</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{club.stats?.totalBookings || 0}</Text>
                  <Text style={styles.statLabel}>Réservations</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{club.stats?.totalDogs || 0}</Text>
                  <Text style={styles.statLabel}>Chiens</Text>
                </View>
              </View>
              <View style={styles.contactInfoContainer}>
                {club.address && <ContactInfoRow icon="location-outline" label="Adresse" value={club.address} />}
                {club.phone && <ContactInfoRow icon="call-outline" label="Téléphone" value={club.phone} />}
                {club.email && <ContactInfoRow icon="mail-outline" label="Email" value={club.email} />}
                {club.website && <ContactInfoRow icon="globe-outline" label="Site web" value={club.website} />}
              </View>
            </Section>
            
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinCommunity} disabled={joiningLoading}>
                {joiningLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="people-outline" size={20} color="#fff" />
                        <Text style={styles.joinButtonText}>Rejoindre la communauté</Text>
                      </View>
                      <Text style={styles.joinButtonSubtext}>Accédez aux salons, annonces et événements</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                  </>
                )}
            </TouchableOpacity>

            {bookings.length > 0 && <Section title="Prochains cours"><BookingList bookings={bookings} navigation={navigation} clubId={clubId} educators={educators} fields={fields} /></Section>}
            {bookings.length === 0 && <Section title="Prochains cours"><Text style={styles.emptyState}>Aucun cours à venir</Text></Section>}
            
            {events.length > 0 && <Section title="Événements à venir"><EventList events={events} navigation={navigation} /></Section>}
            {events.length === 0 && <Section title="Événements à venir"><Text style={styles.emptyState}>Aucun événement à venir</Text></Section>}
            
            {educators.length > 0 && <Section title="Éducateurs du club"><EducatorList educators={educators} navigation={navigation} /></Section>}
            {fields.length > 0 && <Section title="Terrains disponibles"><FieldList fields={fields} /></Section>}
            {photos.length > 0 && <Section title="Galerie Officielle"><GalleryList photos={photos} /></Section>}
            {photos.length === 0 && <Section title="Galerie Officielle"><Text style={styles.emptyState}>Aucune photo disponible</Text></Section>}
        </View>
      </ScrollView>
      <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButtonSecondary} onPress={() => navigation.navigate('homeTrainingBooking', { clubId })}>
            <Text style={styles.footerButtonSecondaryText}>Séance à domicile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('booking', { clubId })}>
            <Text style={styles.footerButtonText}>Réserver</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Section = ({ title, children }: any) => <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
const MetaItem = ({ icon, text, color }: any) => <View style={styles.metaItem}><Ionicons name={icon} size={14} color={color || colors.textMuted} /><Text style={[styles.metaText, {color: color || colors.textMuted}]}>{text}</Text></View>;
const ContactInfoRow = ({ icon, label, value }: any) => (
  <View style={styles.contactInfoRow}>
    <Ionicons name={icon} size={18} color={colors.primary} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.contactInfoLabel}>{label}</Text>
      <Text style={styles.contactInfoValue}>{value}</Text>
    </View>
  </View>
);

const BookingList = ({ bookings, navigation, clubId, educators, fields }: any) => {
  const getEducatorName = (id: string) => {
    const educator = educators?.find((e: any) => e.id === id);
    return educator ? `${educator.firstName} ${educator.lastName}` : 'Éducateur';
  };
  
  const getFieldName = (id: string) => {
    const field = fields?.find((f: any) => f.id === id);
    return field?.name || '';
  };

  return (
  <View style={{gap: 12}}>
    {bookings.map((b:any) => (
      <TouchableOpacity key={b.id} style={styles.bookingCard} onPress={() => navigation.navigate('booking', {clubId})}>
        <View style={{ flex: 1 }}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle}>{b.title || 'Cours sans titre'}</Text>
            <Text style={styles.bookingPrice}>{b.price}€</Text>
          </View>
          {b.description && <Text style={styles.bookingDescription}>{b.description}</Text>}
          <View style={styles.bookingMeta}>
            {b.sessionDate && <View style={styles.metaBadge}><Ionicons name="calendar-outline" size={12} color={colors.primary} /><Text style={styles.metaBadgeText}>{new Date(b.sessionDate.toDate?.() || b.sessionDate).toLocaleDateString('fr-FR')}</Text></View>}
            {b.startTime && <View style={styles.metaBadge}><Ionicons name="time-outline" size={12} color={colors.primary} /><Text style={styles.metaBadgeText}>{b.startTime}</Text></View>}
            {b.duration && <View style={styles.metaBadge}><Ionicons name="hourglass-outline" size={12} color={colors.primary} /><Text style={styles.metaBadgeText}>{b.duration} min</Text></View>}
          </View>
          {b.educatorId && <Text style={styles.bookingEducator}>👨‍🏫 {getEducatorName(b.educatorId)}</Text>}
          {b.fieldId && <Text style={styles.bookingField}>📍 {getFieldName(b.fieldId)}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    ))}
  </View>
  );
};

const EventList = ({ events, navigation }: any) => (
  <View style={{gap: 12}}>
    {events.map((e:any) => (
      <TouchableOpacity key={e.id} style={styles.eventCard} onPress={() => navigation.navigate('eventBooking', {eventId: e.id})}>
        <View style={{ flex: 1 }}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{e.title}</Text>
            <Text style={styles.eventPrice}>{e.price}€</Text>
          </View>
          <Text style={styles.eventDesc}>{e.description}</Text>
          {e.location && <Text style={styles.eventLocation}>📍 {e.location}</Text>}
          <View style={styles.eventMeta}>
            {e.startDate && <View style={styles.metaBadge}><Ionicons name="calendar-outline" size={12} color={colors.primary} /><Text style={styles.metaBadgeText}>{new Date(e.startDate.toDate?.() || e.startDate).toLocaleDateString('fr-FR')}</Text></View>}
            {e.dogSlots && <View style={styles.metaBadge}><MaterialCommunityIcons name="dog" size={12} color={colors.primary} /><Text style={styles.metaBadgeText}>{e.dogSlots} chiens</Text></View>}
            {e.spectatorSlots && <View style={styles.metaBadge}><Ionicons name="people-outline" size={12} color={colors.primary} /><Text style={styles.metaBadgeText}>{e.spectatorSlots} spectateurs</Text></View>}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </TouchableOpacity>
    ))}
  </View>
);


const EducatorList = ({ educators, navigation }: any) => (
  <View style={{gap: 12}}>
    {educators.map((e:any) => (
      <TouchableOpacity key={e.id} style={styles.educatorCard} onPress={() => navigation.navigate('educatorDetail', {educatorId: e.id})}>
        {e.photoUrl && <Image source={{uri: e.photoUrl}} style={styles.educatorPhoto} />}
        <View style={styles.educatorInfo}>
          <Text style={styles.educatorName}>{e.firstName} {e.lastName}</Text>
          {e.experienceYears && <Text style={styles.educatorMeta}>{e.experienceYears} ans d'expérience</Text>}
          <View style={styles.educatorFooter}>
            {e.hourlyRate && <Text style={styles.educatorRate}>{e.hourlyRate}€/h</Text>}
            {e.averageRating && (
              <View style={styles.educatorRating}>
                <MaterialCommunityIcons name="star" size={12} color="#FBBF24" />
                <Text style={styles.educatorRatingText}>{e.averageRating.toFixed(1)} ({e.reviewsCount || 0})</Text>
              </View>
            )}
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

const FieldList = ({ fields }: any) => (
  <View style={{gap: 12}}>
    {fields.map((f:any) => (
      <View key={f.id} style={styles.fieldCard}>
        <View style={styles.fieldHeader}>
          <Text style={styles.fieldName}>{f.name}</Text>
          {f.isIndoor && <View style={styles.indoorBadge}><Text style={styles.indoorBadgeText}>Intérieur</Text></View>}
          {!f.isIndoor && <View style={styles.outdoorBadge}><Text style={styles.outdoorBadgeText}>Extérieur</Text></View>}
        </View>
        <View style={styles.fieldMeta}>
          {f.surfaceType && <View style={styles.fieldMetaItem}><MaterialCommunityIcons name="texture" size={12} color={colors.primary} /><Text style={styles.fieldMetaText}>{f.surfaceType}</Text></View>}
          {f.trainingType && <View style={styles.fieldMetaItem}><MaterialCommunityIcons name="dumbbell" size={12} color={colors.primary} /><Text style={styles.fieldMetaText}>{f.trainingType}</Text></View>}
          {f.capacity && <View style={styles.fieldMetaItem}><MaterialCommunityIcons name="account-multiple" size={12} color={colors.primary} /><Text style={styles.fieldMetaText}>Cap: {f.capacity}</Text></View>}
        </View>
        {f.address && <Text style={styles.fieldAddress}>📍 {f.address}</Text>}
        {f.notes && <Text style={styles.fieldNotes}>{f.notes}</Text>}
      </View>
    ))}
  </View>
);

const GalleryList = ({ photos }: any) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
    {photos.map((photo: any) => (
      <View key={photo.id} style={styles.galleryPhotoContainer}>
        <Image source={{ uri: photo.url }} style={styles.galleryPhoto} />
        {photo.title && <Text style={styles.galleryPhotoTitle}>{photo.title}</Text>}
      </View>
    ))}
  </ScrollView>
);


const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    container: { paddingBottom: 100 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    heroImage: { width: '100%', height: 250 },
    backBtn: { position: 'absolute', top: 40, left: 16, backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 20 },
    header: { padding: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
    clubName: { fontSize: 24, fontWeight: 'bold', color: colors.text },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 14, fontWeight: '600' },
    content: { padding: 16, gap: 24 },
    section: { gap: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    description: { fontSize: 15, color: colors.textMuted, lineHeight: 22 },
    emptyState: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: 20 },
    joinButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, elevation: 2, shadowColor: colors.shadow },
    joinButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    joinButtonSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
    contactInfoContainer: { gap: 12, marginTop: 12 },
    contactInfoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F9FAFB', borderRadius: 12 },
    contactInfoLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
    contactInfoValue: { fontSize: 13, color: colors.text, fontWeight: '600', marginTop: 2 },
    bookingCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderLeftWidth: 4, borderLeftColor: colors.primary, flexDirection: 'row', elevation: 2, shadowColor: colors.shadow },
    bookingEducator: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 6 },
    bookingField: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 3 },
    card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 2, shadowColor: colors.shadow },
    bookingCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderLeftWidth: 4, borderLeftColor: colors.primary, elevation: 2, shadowColor: colors.shadow },
    bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    bookingTitle: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
    bookingPrice: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
    bookingDescription: { fontSize: 13, color: colors.secondary, marginBottom: 8, fontStyle: 'italic' },
    bookingMeta: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E0F2F1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    metaBadgeText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
    eventCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, elevation: 2, shadowColor: colors.shadow, flexDirection: 'row' },
    eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    eventTitle: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
    eventPrice: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
    eventDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginBottom: 8 },
    eventLocation: { fontSize: 12, color: colors.primary, fontWeight: '600', marginBottom: 8 },
    eventMeta: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    educatorCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12, elevation: 2, shadowColor: colors.shadow },
    educatorPhoto: { width: 70, height: 70, borderRadius: 12 },
    educatorInfo: { flex: 1, justifyContent: 'space-between' },
    educatorName: { fontSize: 15, fontWeight: '600', color: colors.text },
    educatorMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    educatorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
    educatorRate: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
    educatorRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    educatorRatingText: { fontSize: 12, color: colors.text, fontWeight: '500' },
    fieldCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, elevation: 2, shadowColor: colors.shadow },
    fieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    fieldName: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
    indoorBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    indoorBadgeText: { fontSize: 11, fontWeight: '600', color: '#DC2626' },
    outdoorBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    outdoorBadgeText: { fontSize: 11, fontWeight: '600', color: '#2563EB' },
    fieldMeta: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
    fieldMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    fieldMetaText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
    fieldAddress: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 8 },
    fieldNotes: { fontSize: 12, color: colors.textMuted, marginTop: 8, lineHeight: 16 },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { backgroundColor: '#E0F2F1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    chipText: { fontSize: 13, color: colors.primary, fontWeight: '500' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
    galleryPhotoContainer: { marginRight: 8 },
    galleryPhoto: { width: 150, height: 150, borderRadius: 12, backgroundColor: colors.surface },
    galleryPhotoTitle: { fontSize: 12, color: colors.text, marginTop: 6, textAlign: 'center', fontWeight: '500' },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: colors.background, flexDirection: 'row', gap: 12 },
    footerButtonSecondary: { flex: 1, borderWidth: 2, borderColor: colors.primary, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
    footerButtonSecondaryText: { color: colors.primary, fontSize: 15, fontWeight: 'bold' },
    footerButton: { flex: 1, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
    footerButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});