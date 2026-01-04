import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Timestamp, doc, getDoc } from 'firebase/firestore';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { useAuth } from '@/context/AuthContext';
import { useFetchEducatorClubsFromCollection } from '@/hooks/useFetchEducatorClubsFromCollection';
import {
  useClubEducatorInviteActions,
  usePendingClubEducatorInvitesForEducator,
} from '@/hooks/useClubEducatorInvites';
import { TeacherStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { getInviteErrorMessage } from '@/services/clubEducatorInvitations';

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
  const { user, profile } = useAuth();
  
  // Get educator ID from profile
  const educatorProfile = (profile as any)?.profile || {};
  const educatorId = educatorProfile?.educatorId || (profile as any)?.educatorId || '';
  
  // Fetch clubs where this educator is affiliated
  const { clubs, loading, error } = useFetchEducatorClubsFromCollection(educatorId);
  const { invites: pendingInvites, loading: pendingLoading } =
    usePendingClubEducatorInvitesForEducator(educatorId);
  const {
    loading: inviteActionLoading,
    acceptInviteOrRequest,
    rejectInviteOrRequest,
    cancelInviteOrRequest,
  } = useClubEducatorInviteActions();
  const [clubsById, setClubsById] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const fetchClubs = async () => {
      const ids = Array.from(new Set(pendingInvites.map((invite) => invite.clubId)));
      if (ids.length === 0) {
        setClubsById({});
        return;
      }
      try {
        const entries = await Promise.all(
          ids.map(async (id) => {
            const snap = await getDoc(doc(db, 'club', id));
            if (snap.exists()) {
              return { id: snap.id, ...(snap.data() as Record<string, unknown>) };
            }
            return { id } as Record<string, unknown>;
          }),
        );
        const map: Record<string, any> = {};
        entries.forEach((entry) => {
          map[entry.id] = entry;
        });
        setClubsById(map);
      } catch (err) {
        console.warn('Erreur chargement clubs invites', err);
      }
    };

    fetchClubs();
  }, [pendingInvites]);

  const formatTime = (date: any): string => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const receivedInvites = useMemo(
    () => pendingInvites.filter((invite) => invite.createdByRole === 'club'),
    [pendingInvites],
  );
  const sentInvites = useMemo(
    () => pendingInvites.filter((invite) => invite.createdByRole === 'educator'),
    [pendingInvites],
  );

  const handleAcceptInvite = async (clubId: string) => {
    if (!user?.uid || !educatorId) return;
    try {
      await acceptInviteOrRequest({ authUid: user.uid, clubId, educatorId });
      Alert.alert('Succes', 'Affiliation acceptee.');
    } catch (err) {
      Alert.alert('Erreur', getInviteErrorMessage(err));
    }
  };

  const handleRejectInvite = async (clubId: string) => {
    if (!user?.uid || !educatorId) return;
    Alert.alert('Refuser', "Refuser l'invitation ?", [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Refuser',
        style: 'destructive',
        onPress: async () => {
          try {
            await rejectInviteOrRequest({ authUid: user.uid, clubId, educatorId });
          } catch (err) {
            Alert.alert('Erreur', getInviteErrorMessage(err));
          }
        },
      },
    ]);
  };

  const handleCancelInvite = async (clubId: string) => {
    if (!user?.uid || !educatorId) return;
    Alert.alert('Annuler', 'Annuler votre demande ?', [
      { text: 'Retour', style: 'cancel' },
      {
        text: 'Annuler',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelInviteOrRequest({ authUid: user.uid, clubId, educatorId });
          } catch (err) {
            Alert.alert('Erreur', getInviteErrorMessage(err));
          }
        },
      },
    ]);
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
              <Text style={styles.inviteMeta}>
                {pendingLoading
                  ? 'Chargement des invitations...'
                  : receivedInvites.length
                    ? `${receivedInvites.length} club${receivedInvites.length > 1 ? 's' : ''} souhaite${
                        receivedInvites.length > 1 ? 'nt' : ''
                      } collaborer`
                    : 'Aucune invitation en attente'}
              </Text>
            </View>
          </View>

          {pendingLoading ? (
            <View style={styles.inviteLoading}>
              <ActivityIndicator size="small" color={palette.primary} />
            </View>
          ) : receivedInvites.length > 0 ? (
            <View style={styles.inviteList}>
              {receivedInvites.map((invite) => {
                const clubInfo = clubsById[invite.clubId] || {};
                const clubName = (clubInfo as any).name || invite.clubId;
                return (
                  <View key={invite.id} style={styles.inviteRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inviteClubName}>{clubName}</Text>
                      <Text style={styles.inviteMetaSmall}>Invitation en attente</Text>
                    </View>
                    <View style={styles.inviteActions}>
                      <TouchableOpacity
                        style={styles.inviteReject}
                        onPress={() => handleRejectInvite(invite.clubId)}
                        disabled={inviteActionLoading}
                      >
                        <Text style={styles.inviteActionText}>Refuser</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.inviteAccept}
                        onPress={() => handleAcceptInvite(invite.clubId)}
                        disabled={inviteActionLoading}
                      >
                        <Text style={styles.inviteActionTextLight}>Accepter</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.inviteMetaSmall}>Aucune invitation pour le moment.</Text>
          )}

          {sentInvites.length > 0 ? (
            <View style={styles.sentBlock}>
              <Text style={styles.sentTitle}>Demandes envoyees</Text>
              {sentInvites.map((invite) => {
                const clubInfo = clubsById[invite.clubId] || {};
                const clubName = (clubInfo as any).name || invite.clubId;
                return (
                  <View key={invite.id} style={styles.sentRow}>
                    <Text style={styles.inviteClubName}>{clubName}</Text>
                    <TouchableOpacity
                      style={styles.sentButton}
                      onPress={() => handleCancelInvite(invite.clubId)}
                      disabled={inviteActionLoading}
                    >
                      <Text style={styles.sentButtonText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>

        <View style={styles.joinCard}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <MaterialCommunityIcons name="account-group-outline" size={22} color={palette.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.joinTitle}>Rejoindre un club</Text>
              <Text style={styles.joinMeta}>Envoyez une demande aux clubs disponibles.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => navigation.navigate('teacher-join-club')}
          >
            <Text style={styles.joinButtonText}>Voir tous les clubs</Text>
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
  inviteLoading: { paddingTop: 12, alignItems: 'center' },
  inviteList: { marginTop: 12, gap: 10 },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FBFBFA',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  inviteClubName: { fontSize: 14, fontWeight: '700', color: palette.text },
  inviteMetaSmall: { color: palette.gray, fontSize: 12 },
  inviteActions: { flexDirection: 'row', gap: 8 },
  inviteAccept: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.accent,
    borderRadius: 999,
  },
  inviteReject: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 999,
  },
  inviteActionText: { color: '#DC2626', fontWeight: '700', fontSize: 12 },
  inviteActionTextLight: { color: '#fff', fontWeight: '700', fontSize: 12 },
  sentBlock: { marginTop: 12, gap: 8 },
  sentTitle: { color: palette.text, fontWeight: '700', fontSize: 13 },
  sentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  sentButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 999,
  },
  sentButtonText: { color: '#DC2626', fontWeight: '700', fontSize: 12 },
  joinCard: {
    backgroundColor: palette.surface,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  joinTitle: { fontSize: 15, fontWeight: '700', color: palette.text },
  joinMeta: { color: palette.gray, fontSize: 13 },
  joinButton: {
    backgroundColor: palette.primary,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 10,
  },
  joinButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
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
