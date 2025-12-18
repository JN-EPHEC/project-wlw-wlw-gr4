import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

import { ClubStackParamList } from '@/navigation/types';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useFetchPendingMembers } from '@/hooks/useFetchPendingMembers';
import { useApproveOrRejectMember } from '@/hooks/useApproveOrRejectMember';
import { useAuth } from '@/context/AuthContext';
import { notifyUserMembershipApproved, notifyUserMembershipRejected } from '@/utils/notificationHelpers';

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
    error: '#DC2626',
    success: '#10B981',
    warning: '#F59E0B',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubMembers'>;

export default function ClubMembersScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  const clubId = (route.params as any)?.clubId || (profile as any)?.clubId || user?.uid || '';
  
  const { members, loading } = useCommunityMembers(clubId);
  const { pendingMembers, loading: pendingLoading } = useFetchPendingMembers(clubId);
  const { approveOrRejectMember, loading: actionLoading } = useApproveOrRejectMember();
  const [search, setSearch] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchClubData = async () => {
      if (!clubId) return;
      try {
        const clubRef = doc(db, 'club', clubId);
        const snapshot = await getDoc(clubRef);
        if (snapshot.exists()) {
          setIsOwner(snapshot.data()?.ownerUserId === user?.uid);
        }
      } catch (err) { console.error('Error fetching club data:', err); }
    };
    fetchClubData();
  }, [clubId, user?.uid]);

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;
    return members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  }, [members, search]);

  const handleApprove = async (pending: any) => {
    try {
      await approveOrRejectMember({ clubId, userId: pending.userId, email: pending.email, name: pending.name, action: 'approve' });
      const clubData = await getDoc(doc(db, 'club', clubId));
      await notifyUserMembershipApproved(pending.userId, clubId, clubData.data()?.name || 'le club');
      Alert.alert('Succès', `${pending.name} a été ajouté.`);
    } catch (err) { Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue.'); }
  };

  const handleReject = (pending: any) => {
    Alert.alert('Confirmer le rejet', `Refuser la demande de ${pending.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Refuser', style: 'destructive', onPress: async () => {
        try {
          await approveOrRejectMember({ clubId, userId: pending.userId, email: pending.email, name: pending.name, action: 'reject' });
          const clubData = await getDoc(doc(db, 'club', clubId));
          await notifyUserMembershipRejected(pending.userId, clubId, clubData.data()?.name || 'le club');
          Alert.alert('Succès', `La demande de ${pending.name} a été refusée.`);
        } catch (err) { Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue.'); }
      }},
    ]);
  };

  if (loading || pendingLoading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>Membres</Text>
                <Text style={styles.headerSub}>{members.length} membre(s) au total</Text>
            </View>
        </View>

        <View style={styles.content}>
          <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={colors.textMuted} />
              <TextInput style={styles.searchInput} placeholder="Rechercher un membre..." value={search} onChangeText={setSearch} />
          </View>
          
          {isOwner && pendingMembers.length > 0 && (
            <Section title={`En attente (${pendingMembers.length})`}>
              {pendingMembers.map((pending) => (
                <View key={pending.userId} style={[styles.card, styles.pendingCard]}>
                    <Text style={styles.avatarText}>{(pending.name || 'U')[0]}</Text>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{pending.name}</Text>
                        <Text style={styles.cardSubtitle}>{pending.email}</Text>
                    </View>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.success}]} onPress={() => handleApprove(pending)} disabled={actionLoading}>
                        <Ionicons name="checkmark" size={20} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.error}]} onPress={() => handleReject(pending)} disabled={actionLoading}>
                        <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
              ))}
            </Section>
          )}

          <Section title={`Membres approuvés (${filteredMembers.length})`}>
            {filteredMembers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyText}>Aucun membre ne correspond à votre recherche.</Text>
              </View>
            ) : (
              filteredMembers.map((member) => (
                <View key={member.id} style={styles.card}>
                  <Text style={[styles.avatarText, {backgroundColor: 'rgba(39, 179, 163, 0.1)', color: colors.primary}]}>{(member.name || '?')[0]}</Text>
                  <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{member.name}</Text>
                      <Text style={styles.cardSubtitle}>{member.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
              ))
            )}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    paddingTop: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: { padding: 8, },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  content: { padding: 16, gap: 24 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },
  section: { gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: colors.shadow,
  },
  pendingCard: { borderColor: colors.warning, borderWidth: 2 },
  avatarText: {
    width: 48,
    height: 48,
    borderRadius: 24,
    textAlign: 'center',
    lineHeight: 48,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: colors.warning,
    overflow: 'hidden'
  },
  cardContent: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardSubtitle: { fontSize: 14, color: colors.textMuted },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: { paddingVertical: 40, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
});