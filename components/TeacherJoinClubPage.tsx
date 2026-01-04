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

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { useAuth } from '@/context/AuthContext';
import { useFetchClubs } from '@/hooks/useFetchClubs';
import { useFetchEducatorClubsFromCollection } from '@/hooks/useFetchEducatorClubsFromCollection';
import {
  useClubEducatorInviteActions,
  usePendingClubEducatorInvitesForEducator,
} from '@/hooks/useClubEducatorInvites';
import { TeacherStackParamList } from '@/navigation/types';

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
};

export default function TeacherJoinClubPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const { user, profile } = useAuth();

  const educatorProfile = (profile as any)?.profile || {};
  const educatorId = educatorProfile?.educatorId || (profile as any)?.educatorId || '';
  const effectiveEducatorId = educatorId || user?.uid || '';

  const { clubs, loading, error } = useFetchClubs();
  const { clubs: affiliatedClubs } = useFetchEducatorClubsFromCollection(effectiveEducatorId);
  const { invites: pendingInvites } = usePendingClubEducatorInvitesForEducator(effectiveEducatorId);
  const { loading: inviteLoading, educatorRequestJoinClub } = useClubEducatorInviteActions();

  const affiliatedIds = useMemo(
    () => new Set(affiliatedClubs.map((club) => club.id)),
    [affiliatedClubs],
  );
  const pendingIds = useMemo(
    () => new Set(pendingInvites.map((invite) => invite.clubId)),
    [pendingInvites],
  );

  const handleJoinClub = (clubId: string, clubName?: string) => {
    if (!user?.uid) {
      Alert.alert('Erreur', "Impossible d'envoyer la demande.");
      return;
    }

    Alert.alert("Confirmer la demande d'affiliation", '', [
      { text: 'Non', style: 'cancel' },
      {
        text: 'Oui',
        onPress: async () => {
          try {
            await educatorRequestJoinClub({ authUid: user.uid, clubId });
            Alert.alert("Demande d'affiliation envoyée avec succès");
          } catch (err) {
            console.warn('Erreur demande affiliation', err);
            Alert.alert("Ce club n'accepte plus de nouvelles demandes d'affiliation pour le moment.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
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
                onPress={() => navigation.navigate('teacher-clubs')}
              >
                <Ionicons name="arrow-back" size={18} color={palette.surface} />
              </TouchableOpacity>
              <View>
                <Text style={styles.title}>Rejoindre un club</Text>
                <Text style={styles.subtitle}>Parcourez tous les clubs disponibles</Text>
              </View>
            </View>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="account-group-outline" size={20} color={palette.surface} />
            </View>
          </View>
        </LinearGradient>

        {loading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : error ? (
          <View style={styles.loadingBlock}>
            <Text style={styles.emptyText}>Erreur: {error}</Text>
          </View>
        ) : clubs.length === 0 ? (
          <View style={styles.loadingBlock}>
            <Text style={styles.emptyText}>Aucun club disponible pour le moment.</Text>
          </View>
        ) : (
          <View style={styles.listBlock}>
            {clubs.map((club) => {
              const isAffiliated = affiliatedIds.has(club.id);
              const isPending = pendingIds.has(club.id);
              const disabled = inviteLoading || isAffiliated || isPending || !user?.uid;
              const buttonLabel = isAffiliated
                ? 'Déjà membre'
                : isPending
                  ? 'Demande envoyée'
                  : 'Rejoindre ce club';

              return (
                <View key={club.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle}>{club.name}</Text>
                        {club.isVerified ? (
                          <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={14} color={palette.success} />
                            <Text style={styles.verifiedText}>Vérifié</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.cardMeta}>
                        {club.address || club.city || 'Adresse non renseignée'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardMeta}>{club.services || 'Services disponibles'}</Text>
                  <TouchableOpacity
                    style={[styles.joinButton, disabled && styles.joinButtonDisabled]}
                    onPress={() => handleJoinClub(club.id, club.name)}
                    disabled={disabled}
                  >
                    <Text style={[styles.joinButtonText, disabled && styles.joinButtonTextDisabled]}>
                      {buttonLabel}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
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
  headerIcon: {
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
  loadingBlock: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: palette.gray, fontSize: 13 },
  listBlock: { paddingHorizontal: 16, gap: 12 },
  card: {
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#E7F6EF',
  },
  verifiedText: { color: palette.success, fontSize: 11, fontWeight: '700' },
  joinButton: {
    backgroundColor: palette.primary,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
  joinButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  joinButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  joinButtonTextDisabled: { color: '#6B7280' },
});
