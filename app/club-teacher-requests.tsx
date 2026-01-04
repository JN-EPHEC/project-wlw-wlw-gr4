import React, { useEffect, useMemo, useState } from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';

import { ClubStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import {
  useClubEducatorInviteActions,
  usePendingClubEducatorInvitesForClub,
} from '@/hooks/useClubEducatorInvites';
import { getInviteErrorMessage, type ClubEducatorInviteDoc } from '@/services/clubEducatorInvitations';

const palette = {
  primary: '#E9B782',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubTeacherRequests'>;

type EducatorSummary = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  verified?: boolean;
};

const buildEducatorName = (educator?: EducatorSummary) => {
  if (!educator) return 'Educateur';
  const name = `${educator.firstName ?? ''} ${educator.lastName ?? ''}`.trim();
  return name || 'Educateur';
};

const formatInviteDate = (value: any) => {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return 'Date inconnue';
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function ClubTeacherRequestsScreen({ navigation }: Props) {
  const { user, profile } = useAuth();
  const clubId = (profile as any)?.clubId || user?.uid || '';
  const { invites, loading, error } = usePendingClubEducatorInvitesForClub(clubId);
  const [educatorsById, setEducatorsById] = useState<Record<string, EducatorSummary>>({});
  const {
    loading: actionLoading,
    acceptInviteOrRequest,
    rejectInviteOrRequest,
    cancelInviteOrRequest,
  } = useClubEducatorInviteActions();

  useEffect(() => {
    const fetchEducators = async () => {
      const ids = Array.from(new Set(invites.map((invite) => invite.educatorId)));
      if (ids.length === 0) {
        setEducatorsById({});
        return;
      }
      try {
        const entries = await Promise.all(
          ids.map(async (id) => {
            const snap = await getDoc(doc(db, 'educators', id));
            if (snap.exists()) {
              return { id: snap.id, ...(snap.data() as EducatorSummary) };
            }
            return { id } as EducatorSummary;
          }),
        );
        const map: Record<string, EducatorSummary> = {};
        entries.forEach((entry) => {
          map[entry.id] = entry;
        });
        setEducatorsById(map);
      } catch (err) {
        console.warn('Erreur chargement educateurs', err);
      }
    };

    fetchEducators();
  }, [invites]);

  const incomingInvites = useMemo(
    () => invites.filter((invite) => invite.createdByRole === 'educator'),
    [invites],
  );
  const outgoingInvites = useMemo(
    () => invites.filter((invite) => invite.createdByRole === 'club'),
    [invites],
  );

  const handleAccept = async (invite: ClubEducatorInviteDoc) => {
    if (!user?.uid) return;
    try {
      await acceptInviteOrRequest({ authUid: user.uid, clubId, educatorId: invite.educatorId });
      Alert.alert('Succes', 'Affiliation acceptee.');
    } catch (err) {
      Alert.alert('Erreur', getInviteErrorMessage(err));
    }
  };

  const handleReject = async (invite: ClubEducatorInviteDoc) => {
    if (!user?.uid) return;
    Alert.alert('Refuser', "Refuser la demande d'affiliation ?", [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Refuser',
        style: 'destructive',
        onPress: async () => {
          try {
            await rejectInviteOrRequest({ authUid: user.uid, clubId, educatorId: invite.educatorId });
          } catch (err) {
            Alert.alert('Erreur', getInviteErrorMessage(err));
          }
        },
      },
    ]);
  };

  const handleCancel = async (invite: ClubEducatorInviteDoc) => {
    if (!user?.uid) return;
    Alert.alert('Annuler', "Annuler l'invitation envoyee ?", [
      { text: 'Retour', style: 'cancel' },
      {
        text: 'Annuler',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelInviteOrRequest({ authUid: user.uid, clubId, educatorId: invite.educatorId });
          } catch (err) {
            Alert.alert('Erreur', getInviteErrorMessage(err));
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubTeachers')}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Demandes d'affiliation</Text>
            <Text style={styles.headerSub}>
              {invites.length} demande{invites.length > 1 ? 's' : ''} en attente
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          {loading ? (
            <View style={styles.emptyCard}>
              <ActivityIndicator size="large" color={palette.primary} />
            </View>
          ) : error ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Erreur: {error}</Text>
            </View>
          ) : invites.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="checkmark-circle-outline" size={42} color={palette.gray} />
              <Text style={styles.emptyTitle}>Aucune demande en attente</Text>
              <Text style={styles.emptyText}>Les demandes d'affiliation apparaitront ici.</Text>
            </View>
          ) : (
            <>
              {incomingInvites.length > 0 ? (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>Demandes recues</Text>
                  {incomingInvites.map((invite) => {
                    const educator = educatorsById[invite.educatorId];
                    return (
                      <View key={invite.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                          <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{buildEducatorName(educator).slice(0, 2)}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={styles.cardTitleRow}>
                              <Text style={styles.cardTitle}>{buildEducatorName(educator)}</Text>
                              {educator?.verified ? (
                                <View style={[styles.badge, { backgroundColor: palette.accent }]}>
                                  <MaterialCommunityIcons name="shield-check" size={14} color="#fff" />
                                  <Text style={[styles.badgeText, { color: '#fff' }]}>Verifie</Text>
                                </View>
                              ) : null}
                            </View>
                            {educator?.email ? <Text style={styles.cardMeta}>{educator.email}</Text> : null}
                            <Text style={styles.cardMeta}>Demande du {formatInviteDate(invite.createdAt)}</Text>
                          </View>
                        </View>

                        {educator?.specialties?.length ? (
                          <Text style={styles.cardMeta}>{educator.specialties.join(' · ')}</Text>
                        ) : null}
                        {invite.message ? <Text style={styles.message}>{invite.message}</Text> : null}

                        <View style={styles.actionsRow}>
                          <TouchableOpacity
                            style={[styles.actionBtn, styles.actionGhost]}
                            onPress={() => handleReject(invite)}
                            disabled={actionLoading}
                          >
                            <Ionicons name="close" size={16} color="#DC2626" />
                            <Text style={[styles.actionText, { color: '#DC2626' }]}>Refuser</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: palette.accent }]}
                            onPress={() => handleAccept(invite)}
                            disabled={actionLoading}
                          >
                            <Ionicons name="checkmark" size={16} color="#fff" />
                            <Text style={styles.actionText}>Accepter</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {outgoingInvites.length > 0 ? (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>Invitations envoyees</Text>
                  {outgoingInvites.map((invite) => {
                    const educator = educatorsById[invite.educatorId];
                    return (
                      <View key={invite.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                          <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{buildEducatorName(educator).slice(0, 2)}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{buildEducatorName(educator)}</Text>
                            {educator?.email ? <Text style={styles.cardMeta}>{educator.email}</Text> : null}
                            <Text style={styles.cardMeta}>Invitation du {formatInviteDate(invite.createdAt)}</Text>
                          </View>
                        </View>
                        <View style={styles.actionsRow}>
                          <TouchableOpacity
                            style={[styles.actionBtn, styles.actionGhost]}
                            onPress={() => handleCancel(invite)}
                            disabled={actionLoading}
                          >
                            <Ionicons name="close" size={16} color="#DC2626" />
                            <Text style={[styles.actionText, { color: '#DC2626' }]}>Annuler</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#F8F3E9', fontSize: 12 },
  container: { padding: 16, gap: 14 },
  sectionBlock: { gap: 12 },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  cardHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  cardMeta: { color: palette.gray, fontSize: 13 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.text, fontWeight: '700' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { fontWeight: '700', fontSize: 12 },
  message: {
    color: palette.text,
    fontSize: 13,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: { color: palette.text, fontWeight: '700' },
  emptyText: { color: palette.gray, textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionGhost: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: palette.border },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
