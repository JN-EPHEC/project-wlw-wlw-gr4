import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Timestamp } from 'firebase/firestore';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { useAuth } from '@/context/AuthContext';
import { useFetchEducatorClubsFromCollection } from '@/hooks/useFetchEducatorClubsFromCollection';
import { TeacherStackParamList } from '@/navigation/types';
import { router } from 'expo-router';

const palette = {
  primary: '#E39A5C',
  primaryDark: '#D48242',
  accent: '#2F9C8D',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E6E2DD',
  surface: '#FFFFFF',
  background: '#F7F4F0',
  success: '#16A34A',
  warning: '#F59E0B',
};

export default function TeacherClubsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const { profile } = useAuth();
  
  // Get educator ID from profile
  const educatorProfile = (profile as any)?.profile || {};
  const educatorId = educatorProfile?.educatorId || (profile as any)?.educatorId || '';
  
  // Fetch clubs where this educator is affiliated
  const { clubs, loading, error } = useFetchEducatorClubsFromCollection(educatorId);

  const formatTime = (date: any): string => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // Component to render a club with its next booking
  const ClubCard = ({ club, educatorId: edId, navigation: nav }: { club: any; educatorId: string; navigation: any }) => {
    const [nextBooking, setNextBooking] = React.useState<any>(null);
    const [bookingLoading, setBookingLoading] = React.useState(true);

    React.useEffect(() => {
      const fetchNextBooking = async () => {
        try {
          setBookingLoading(true);
          const { collection, query, where, getDocs, orderBy, limit, Timestamp } = await import('firebase/firestore');
          const { db } = await import('@/firebaseConfig');
          
          const now = new Date();
          const q = query(
            collection(db, 'Bookings'),
            where('educatorId', '==', edId),
            where('clubId', '==', club.id),
            where('sessionDate', '>=', Timestamp.fromDate(now)),
            orderBy('sessionDate', 'asc'),
            limit(1)
          );

          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setNextBooking(snapshot.docs[0].data());
          }
        } catch (err) {
          console.error('Error fetching booking:', err);
        } finally {
          setBookingLoading(false);
        }
      };

      if (edId && club.id) {
        fetchNextBooking();
      }
    }, [club.id, edId]);

    return (
      <View key={club.id} style={styles.clubCard}>
        <View style={styles.clubHeader}>
          <View style={styles.clubTitleRow}>
            <Text style={styles.cardTitle}>{club.name}</Text>
            <View style={[styles.badge, styles.badgeActive]}>
              <Text style={[styles.badgeText, styles.badgeTextActive]}>Actif</Text>
            </View>
          </View>
        </View>
        <Text style={styles.cardMeta}>{club.services || 'Services disponibles'}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={palette.gray} />
          <Text style={styles.cardMeta}>
            {bookingLoading ? 'Chargement...' : nextBooking ? `Prochain: ${formatTime(nextBooking.sessionDate)}` : 'A planifier'}
          </Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => nav.navigate('teacher-community')}
          >
            <Text style={styles.secondaryText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => nav.navigate('teacher-appointments')}
          >
            <Text style={styles.primaryBtnText}>Bloc horaires</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.navigate('teacher-home')}
              >
                <Ionicons name="arrow-back" size={18} color={palette.surface} />
              </TouchableOpacity>
              <View>
                <Text style={styles.title}>Clubs</Text>
                <Text style={styles.subtitle}>Vos partenaires et invitations</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('teacher-community')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={palette.surface} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.inviteCard}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <MaterialCommunityIcons name="handshake-outline" size={22} color={palette.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inviteTitle}>Nouvelles invitations</Text>
              <Text style={styles.inviteMeta}>1 club souhaite collaborer</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 10 }]}
            onPress={() => router.push('/teacher-community' as any)}
          >
            <Text style={styles.primaryBtnText}>Repondre</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Partenariats actifs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('teacher-appointments')}>
            <Text style={styles.link}>Planning</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={[styles.listBlock, { alignItems: 'center', paddingVertical: 40 }]}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : error ? (
          <View style={[styles.listBlock, { alignItems: 'center', paddingVertical: 20 }]}>
            <Text style={{ color: palette.gray }}>Erreur: {error}</Text>
          </View>
        ) : clubs.length === 0 ? (
          <View style={[styles.listBlock, { alignItems: 'center', paddingVertical: 20 }]}>
            <Text style={{ color: palette.gray }}>Aucun club partenaire pour le moment</Text>
          </View>
        ) : (
          <View style={styles.listBlock}>
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} educatorId={educatorId} navigation={navigation} />
            ))}
          </View>
        )}
      </ScrollView>
      <TeacherBottomNav current="teacher-clubs" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  hero: {
    paddingTop: 6,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.surface },
  subtitle: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13 },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteCard: {
    backgroundColor: palette.surface,
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: -16,
    padding: 14,
    borderRadius: 18,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  inviteTitle: { fontSize: 15, fontWeight: '700', color: palette.text },
  inviteMeta: { color: palette.gray, fontSize: 13 },
  listBlock: { paddingHorizontal: 16, gap: 12 },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  link: { color: palette.primaryDark, fontWeight: '700' },
  clubCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  clubTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeActive: { backgroundColor: '#E7F6EF' },
  badgePending: { backgroundColor: '#FEF3C7' },
  badgeText: { fontWeight: '700', fontSize: 12 },
  badgeTextActive: { color: palette.success },
  badgeTextPending: { color: palette.warning },
  payout: {
    alignItems: 'flex-end',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF4E8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F4D9C2',
  },
  payoutLabel: { color: palette.gray, fontSize: 12 },
  payoutValue: { color: palette.primaryDark, fontWeight: '700', fontSize: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
  },
  secondaryText: { color: palette.text, fontWeight: '700', fontSize: 13 },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 10,
  },
  primaryBtnCompact: { paddingHorizontal: 14, paddingVertical: 10, flex: 0 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
