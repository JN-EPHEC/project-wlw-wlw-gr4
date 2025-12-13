import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';

import { UserStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { useFetchClubFields } from '@/hooks/useFetchClubFields';
import { useFetchClubEducators } from '@/hooks/useFetchClubEducators';
import { useFetchClubUpcomingBookings } from '@/hooks/useFetchClubUpcomingBookings';
import { useFetchClubUpcomingEvents } from '@/hooks/useFetchClubUpcomingEvents';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'clubDetail'>;

interface ClubData {
  id: string;
  name: string;
  averageRating: number;
  reviewsCount: number;
  distanceKm: number;
  isVerified: boolean;
  PhotoUrl?: string;
  logoUrl?: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  certifications?: string;
  services?: string;
  stats?: {
    totalBookings: number;
    totalDogs: number;
    totalMembers: number;
  };
  // Autres champs
  [key: string]: any;
}

export default function ClubDetailScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const [club, setClub] = useState<ClubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Récupérer les terrains et éducateurs du club
  const { fields, loading: fieldsLoading } = useFetchClubFields(clubId);
  const educatorId = club?.educatorId ? [club.educatorId] : [];
  const { educators, loading: educatorsLoading } = useFetchClubEducators(educatorId);
  const { bookings, loading: bookingsLoading } = useFetchClubUpcomingBookings(clubId);
  const { events, loading: eventsLoading } = useFetchClubUpcomingEvents(clubId);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        console.log('🔍 [club-detail] Fetching club with ID:', clubId);
        // clubId vient directement de Firebase (string)
        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);

        if (clubSnap.exists()) {
          console.log('✅ [club-detail] Club found:', clubSnap.data());
          setClub({ id: clubSnap.id, ...clubSnap.data() } as ClubData);
          setError(null);
        } else {
          console.log('❌ [club-detail] Club NOT found with ID:', clubId);
          setError('Club non trouvé');
        }
      } catch (err) {
        console.error('❌ [club-detail] Error fetching club:', err);
        setError('Erreur lors du chargement du club');
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !club) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ color: '#DC2626', fontSize: 16, textAlign: 'center' }}>
            {error || 'Club non trouvé'}
          </Text>
          <TouchableOpacity 
            style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: palette.primary, borderRadius: 8 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image 
            source={{ uri: club.PhotoUrl || club.logoUrl || 'https://via.placeholder.com/400x220?text=Club' }} 
            style={styles.heroImage} 
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.heroTitle}>{club.name}</Text>
              {club.isVerified && <MaterialCommunityIcons name="check-decagram" size={18} color="#fff" />}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                <Text style={styles.ratingText}>{club.averageRating?.toFixed(1) || 'N/A'}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('reviews', { clubId })}>
                <Text style={[styles.heroMeta, styles.linkText]}>
                  {club.reviewsCount || 0} avis
                </Text>
              </TouchableOpacity>
              <Text style={styles.heroMeta}>{club.distanceKm?.toFixed(1) || 'N/A'} km</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.sub}>{club.description || 'Pas de description disponible'}</Text>
        </View>

        {club.address && (
          <View style={styles.sectionRow}>
            <Ionicons name="location-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{club.address}</Text>
          </View>
        )}
        {club.phone && (
          <View style={styles.sectionRow}>
            <Ionicons name="call-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{club.phone}</Text>
          </View>
        )}
        {club.email && (
          <View style={styles.sectionRow}>
            <Ionicons name="mail-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{club.email}</Text>
          </View>
        )}
        {club.website && (
          <View style={styles.sectionRow}>
            <Ionicons name="globe-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{club.website}</Text>
          </View>
        )}

        {club.certifications && (
          <View style={styles.section}>
            <Text style={styles.title}>Certifications</Text>
            <View style={styles.chips}>
              {(Array.isArray(club.certifications) 
                ? club.certifications 
                : club.certifications.split(',').map((c: string) => c.trim())
              ).map((c: string) => (
                <View key={c} style={styles.chip}>
                  <Text style={styles.chipText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.title}>Contact & Infos</Text>
          {club.stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{club.stats.totalMembers || 0}</Text>
                <Text style={styles.statLabel}>Membres</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{club.stats.totalBookings || 0}</Text>
                <Text style={styles.statLabel}>Réservations</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{club.stats.totalDogs || 0}</Text>
                <Text style={styles.statLabel}>Chiens</Text>
              </View>
            </View>
          )}
        </View>

        {/* SECTION TERRAINS */}
        <View style={styles.section}>
          <Text style={styles.title}>Terrains & Équipements</Text>
          {fieldsLoading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator color={palette.primary} />
            </View>
          ) : fields.length > 0 ? (
            fields.map((field) => (
              <View key={field.id} style={styles.fieldCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <MaterialCommunityIcons 
                    name={field.isIndoor ? 'home-outline' : 'grass'} 
                    size={24} 
                    color={palette.primary} 
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldName}>{field.name}</Text>
                    {field.trainingType && (
                      <Text style={styles.sub}>{field.trainingType}</Text>
                    )}
                    {field.surfaceType && (
                      <Text style={[styles.sub, { fontSize: 12 }]}>
                        Surface: {field.surfaceType}
                      </Text>
                    )}
                  </View>
                  {field.isIndoor && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Couvert</Text>
                    </View>
                  )}
                </View>
                {field.notes && (
                  <Text style={[styles.sub, { marginTop: 8 }]}>📝 {field.notes}</Text>
                )}
              </View>
            ))
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <MaterialCommunityIcons name="grass" size={40} color={palette.border} />
              <Text style={[styles.sub, { marginTop: 8, textAlign: 'center' }]}>Pas encore de terrains</Text>
            </View>
          )}
        </View>

        {/* SECTION ÉDUCATEURS */}
        <View style={styles.section}>
          <Text style={styles.title}>Éducateurs du Club</Text>
          {educatorsLoading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator color={palette.primary} />
            </View>
          ) : educators.length > 0 ? (
            educators.map((educator) => (
              <TouchableOpacity
                key={educator.id}
                style={styles.educatorCard}
                onPress={() => navigation.navigate('educatorDetail', { educatorId: educator.id })}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {educator.photoUrl ? (
                    <Image
                      source={{ uri: educator.photoUrl }}
                      style={styles.educatorPhoto}
                    />
                  ) : (
                    <View style={[styles.educatorPhoto, { backgroundColor: palette.primary, justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                        {educator.firstName.charAt(0)}{educator.lastName.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.educatorName}>
                      {educator.firstName} {educator.lastName}
                    </Text>
                    {educator.averageRating && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                        <Text style={[styles.sub, { fontWeight: '600' }]}>
                          {educator.averageRating.toFixed(1)}
                        </Text>
                        <Text style={styles.sub}>({educator.reviewsCount || 0})</Text>
                      </View>
                    )}
                    {educator.hourlyRate && (
                      <Text style={[styles.sub, { marginTop: 4 }]}>
                        {educator.hourlyRate}€/h • {educator.experienceYears} ans d'exp.
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.gray} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <MaterialCommunityIcons name="account-outline" size={40} color={palette.border} />
              <Text style={[styles.sub, { marginTop: 8, textAlign: 'center' }]}>Pas encore d'éducateurs</Text>
            </View>
          )}
        </View>

        {/* SECTION PROCHAINS COURS */}
        <View style={styles.section}>
          <Text style={styles.title}>Prochains cours</Text>
          {bookingsLoading || eventsLoading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator color={palette.primary} />
            </View>
          ) : bookings.length > 0 || events.length > 0 ? (
            <View>
              {/* Mélanger bookings et events, prendre les 2 premiers */}
              {[...bookings, ...events]
                .sort((a, b) => {
                  const dateA = a.sessionDate || a.startDate;
                  const dateB = b.sessionDate || b.startDate;
                  const timeA = dateA?.toDate?.() || new Date(dateA);
                  const timeB = dateB?.toDate?.() || new Date(dateB);
                  return timeA.getTime() - timeB.getTime();
                })
                .slice(0, 2)
                .map((item) => {
                  const isBooking = 'sessionDate' in item;
                  const date = isBooking ? item.sessionDate : item.startDate;
                  const dateObj = date?.toDate?.() || new Date(date);
                  const dateStr = dateObj.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });
                  const timeStr = dateObj.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.courseCard}
                      onPress={() => {
                        if (isBooking) {
                          navigation.navigate('booking', { clubId });
                        } else {
                          navigation.navigate('eventBooking', { eventId: item.id });
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.courseTitle}>
                          {isBooking ? (item.isGroupCourse ? item.title : 'Séance privée') : item.title}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="calendar-outline" size={14} color={palette.gray} />
                            <Text style={styles.sub}>{dateStr}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="time-outline" size={14} color={palette.gray} />
                            <Text style={styles.sub}>{timeStr}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}>
                          <Text style={[styles.sub, { fontWeight: '600', color: palette.primary }]}>
                            {item.price}€
                          </Text>
                          {item.duration && (
                            <Text style={styles.sub}>
                              {item.duration} min
                            </Text>
                          )}
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={palette.gray} />
                    </TouchableOpacity>
                  );
                })}
            </View>
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <MaterialCommunityIcons name="calendar-outline" size={40} color={palette.border} />
              <Text style={[styles.sub, { marginTop: 8, textAlign: 'center' }]}>Pas encore de cours à venir</Text>
            </View>
          )}
        </View>

        {/* SECTION AUTRES COURS DISPONIBLES */}
        {bookings.length > 2 || events.length > 2 ? (
          <View style={styles.section}>
            <Text style={styles.title}>Autres cours disponibles</Text>
            <View>
              {[...bookings, ...events]
                .sort((a, b) => {
                  const dateA = a.sessionDate || a.startDate;
                  const dateB = b.sessionDate || b.startDate;
                  const timeA = dateA?.toDate?.() || new Date(dateA);
                  const timeB = dateB?.toDate?.() || new Date(dateB);
                  return timeA.getTime() - timeB.getTime();
                })
                .slice(2)
                .map((item) => {
                  const isBooking = 'sessionDate' in item;
                  const date = isBooking ? item.sessionDate : item.startDate;
                  const dateObj = date?.toDate?.() || new Date(date);
                  const dateStr = dateObj.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });
                  const timeStr = dateObj.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <View key={item.id} style={styles.courseCardInfo}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.courseTitle}>
                          {isBooking ? (item.isGroupCourse ? item.title : 'Séance privée') : item.title}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="calendar-outline" size={14} color={palette.gray} />
                            <Text style={styles.sub}>{dateStr}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="time-outline" size={14} color={palette.gray} />
                            <Text style={styles.sub}>{timeStr}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}>
                          <Text style={[styles.sub, { fontWeight: '600', color: palette.primary }]}>
                            {item.price}€
                          </Text>
                          {item.duration && (
                            <Text style={styles.sub}>
                              {item.duration} min
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        ) : null}

        {/* SECTION PHOTOS */}
        {club.PhotoUrl && (
          <View style={styles.section}>
            <Text style={styles.title}>Galerie Officielle</Text>
            <Image
              source={{ uri: club.PhotoUrl }}
              style={styles.mainPhoto}
            />
            {club.logoUrl && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sub, { marginBottom: 8 }]}>Logo du club</Text>
                <Image
                  source={{ uri: club.logoUrl }}
                  style={styles.logoPhoto}
                />
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('homeTrainingBooking', { clubId })}>
            <Text style={styles.secondaryText}>Séance à domicile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('booking', { clubId })}>
            <Text style={styles.primaryBtnText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  hero: { height: 220, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  back: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  heroContent: { position: 'absolute', left: 16, right: 16, bottom: 12 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  heroMeta: { color: '#E5E7EB', fontSize: 13 },
  rating: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: { color: '#1F2937', fontWeight: '700', fontSize: 12 },
  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  sectionRow: { paddingHorizontal: 16, flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 6 },
  title: { color: palette.text, fontSize: 18, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 14 },
  linkText: { textDecorationLine: 'underline' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  listTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.primary, fontWeight: '700' },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  scheduleTime: { color: palette.text, fontWeight: '600' },
  photo: { width: 180, height: 120, borderRadius: 12, backgroundColor: '#E5E7EB' },
  bottomActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 4 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: { color: palette.primary, fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  statsContainer: { flexDirection: 'row', gap: 10, justifyContent: 'space-around' },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: { color: palette.primary, fontSize: 18, fontWeight: '700' },
  statLabel: { color: palette.gray, fontSize: 12, marginTop: 4 },
  fieldCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
  },
  fieldName: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#FEE4E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#D32F2F',
    fontSize: 11,
    fontWeight: '600',
  },
  educatorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
  },
  educatorPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.border,
  },
  educatorName: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  courseCardInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
  },
  courseTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  mainPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: palette.border,
  },
  logoPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: palette.border,
  },
});
