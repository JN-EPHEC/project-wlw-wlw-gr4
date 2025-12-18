import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';

import { UserStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { useFetchClubFields } from '@/hooks/useFetchClubFields';
import { useFetchClubEducators } from '@/hooks/useFetchClubEducators';
import { useFetchClubUpcomingBookings } from '@/hooks/useFetchClubUpcomingBookings';
import { useFetchClubUpcomingEvents } from '@/hooks/useFetchClubUpcomingEvents';
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

export default function ClubDetailScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { joinClub, loading: joiningLoading } = useJoinClub();

  const { fields, loading: fieldsLoading } = useFetchClubFields(clubId);
  const { educators, loading: educatorsLoading } = useFetchClubEducators([club?.educatorId].filter(Boolean));
  const { bookings, loading: bookingsLoading } = useFetchClubUpcomingBookings(clubId);
  const { events, loading: eventsLoading } = useFetchClubUpcomingEvents(clubId);

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      try {
        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);
        if (clubSnap.exists()) {
          setClub({ id: clubSnap.id, ...clubSnap.data() });
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
        <Image source={{ uri: club.PhotoUrl || club.logoUrl || 'https://via.placeholder.com/400x250' }} style={styles.heroImage} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        
        <View style={styles.header}>
            <Text style={styles.clubName}>{club.name}</Text>
            <View style={styles.metaRow}>
                <MetaItem icon="star" text={`${club.averageRating?.toFixed(1) || 'N/A'} (${club.reviewsCount || 0} avis)`} color={colors.accent} />
                <MetaItem icon="location-outline" text={`${club.distanceKm?.toFixed(1) || 'N/A'} km`} />
                {club.isVerified && <MetaItem icon="checkmark-circle" text="Vérifié" color={colors.primary} />}
            </View>
        </View>

        <View style={styles.content}>
            <Section title="Description"><Text style={styles.description}>{club.description || 'Aucune description.'}</Text></Section>
            
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinCommunity} disabled={joiningLoading}>
                {joiningLoading ? <ActivityIndicator color="#fff" /> : <><Ionicons name="people-outline" size={20} color="#fff" /><Text style={styles.joinButtonText}>Rejoindre la communauté</Text></>}
            </TouchableOpacity>

            {bookings.length > 0 && <Section title="Prochains cours"><BookingList bookings={bookings} navigation={navigation} clubId={clubId} /></Section>}
            {events.length > 0 && <Section title="Événements à venir"><EventList events={events} navigation={navigation} /></Section>}
            {educators.length > 0 && <Section title="Éducateurs du club"><EducatorList educators={educators} navigation={navigation} /></Section>}
            {fields.length > 0 && <Section title="Terrains disponibles"><FieldList fields={fields} /></Section>}
        </View>
      </ScrollView>
      <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('booking', { clubId })}><Text style={styles.footerButtonText}>Réserver un cours</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Section = ({ title, children }: any) => <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
const MetaItem = ({ icon, text, color }: any) => <View style={styles.metaItem}><Ionicons name={icon} size={14} color={color || colors.textMuted} /><Text style={[styles.metaText, {color: color || colors.textMuted}]}>{text}</Text></View>;
const BookingList = ({ bookings, navigation, clubId }: any) => <View style={{gap: 12}}>{bookings.map((b:any) => <TouchableOpacity key={b.id} style={styles.card} onPress={() => navigation.navigate('booking', {clubId})}><Text>{b.title}</Text></TouchableOpacity>)}</View>;
const EventList = ({ events, navigation }: any) => <View style={{gap: 12}}>{events.map((e:any) => <TouchableOpacity key={e.id} style={styles.card} onPress={() => navigation.navigate('eventBooking', {eventId: e.id})}><Text>{e.title}</Text></TouchableOpacity>)}</View>;
const EducatorList = ({ educators, navigation }: any) => <View style={{gap: 12}}>{educators.map((e:any) => <TouchableOpacity key={e.id} style={styles.card} onPress={() => navigation.navigate('educatorDetail', {educatorId: e.id})}><Text>{e.firstName} {e.lastName}</Text></TouchableOpacity>)}</View>;
const FieldList = ({ fields }: any) => <View style={{gap: 12}}>{fields.map((f:any) => <View key={f.id} style={styles.card}><Text>{f.name}</Text></View>)}</View>;


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
    joinButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 16 },
    joinButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 2, shadowColor: colors.shadow },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: colors.background },
    footerButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    footerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});