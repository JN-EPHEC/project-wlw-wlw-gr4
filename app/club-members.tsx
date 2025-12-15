import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
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

const palette = {
  primary: '#7C3AED',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubMembers'>;

export default function ClubMembersScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  const clubId = (route.params as any)?.clubId || (profile as any)?.clubId || user?.uid || '';
  
  const { members, loading } = useCommunityMembers(clubId);
  const { pendingMembers, loading: pendingLoading } = useFetchPendingMembers(clubId);
  const { approveOrRejectMember, loading: actionLoading } = useApproveOrRejectMember();
  const [search, setSearch] = useState('');
  const [clubData, setClubData] = useState<any>(null);

  // Récupérer les données du club pour vérifier le propriétaire
  React.useEffect(() => {
    const fetchClubData = async () => {
      try {
        const clubRef = doc(db, 'club', clubId);
        const snapshot = await getDoc(clubRef);
        if (snapshot.exists()) {
          setClubData(snapshot.data());
        }
      } catch (err) {
        console.error('Error fetching club data:', err);
      }
    };
    if (clubId) {
      fetchClubData();
    }
  }, [clubId]);

  // Vérifier si l'utilisateur est propriétaire du club
  // L'owner est identifié par ownerUserId dans clubData
  const isOwner = clubData?.ownerUserId === user?.uid;
  
  React.useEffect(() => {
    console.log('🔐 [club-members] clubData?.ownerUserId:', clubData?.ownerUserId);
    console.log('🔐 [club-members] user?.uid:', user?.uid);
    console.log('🔐 [club-members] isOwner:', isOwner);
    console.log('🔐 [club-members] pendingMembers count:', pendingMembers.length);
  }, [clubData, user, isOwner, pendingMembers]);

  const filtered = useMemo(() => {
    if (!search.trim()) return members;
    const lower = search.toLowerCase();
    return members.filter(
      (m) => m.name.toLowerCase().includes(lower) || m.email?.toLowerCase().includes(lower)
    );
  }, [members, search]);

  const handleApprove = async (pendingMember: any) => {
    try {
      await approveOrRejectMember({
        clubId,
        userId: pendingMember.userId,
        email: pendingMember.email,
        name: pendingMember.name,
        action: 'approve',
      });
      Alert.alert('Succès', `${pendingMember.name} a été ajouté aux membres`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur';
      Alert.alert('Erreur', errorMsg);
    }
  };

  const handleReject = async (pendingMember: any) => {
    Alert.alert(
      'Confirmer',
      `Êtes-vous sûr de vouloir refuser la demande de ${pendingMember.name}?`,
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Refuser',
          onPress: async () => {
            try {
              await approveOrRejectMember({
                clubId,
                userId: pendingMember.userId,
                email: pendingMember.email,
                name: pendingMember.name,
                action: 'reject',
              });
              Alert.alert('Succès', `La demande de ${pendingMember.name} a été refusée`);
            } catch (err) {
              const errorMsg = err instanceof Error ? err.message : 'Erreur';
              Alert.alert('Erreur', errorMsg);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading || pendingLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Membres</Text>
              <Text style={styles.headerSub}>{members.length} membre(s)</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={palette.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un membre..."
              placeholderTextColor={palette.gray}
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={palette.gray} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* SECTION: MEMBERS EN ATTENTE (si propriétaire) */}
          {isOwner && pendingMembers.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={styles.sectionTitle}>
                🔔 En attente d'approbation ({pendingMembers.length})
              </Text>
              <View style={styles.membersList}>
                {pendingMembers.map((pendingMember) => (
                  <View key={pendingMember.userId} style={styles.pendingMemberCard}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.avatarText}>
                        {(pendingMember.name || 'U')[0].toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.memberName}>{pendingMember.name || 'Utilisateur'}</Text>
                      {pendingMember.email && <Text style={styles.memberEmail}>{pendingMember.email}</Text>}
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.btnApprove}
                        onPress={() => handleApprove(pendingMember)}
                        disabled={actionLoading}
                      >
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.btnReject}
                        onPress={() => handleReject(pendingMember)}
                        disabled={actionLoading}
                      >
                        <Ionicons name="close" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* SECTION: MEMBERS APPROUVÉS */}
          <View>
            <Text style={styles.sectionTitle}>Membres ({members.length})</Text>
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color={palette.gray} />
                <Text style={styles.emptyText}>Aucun membre trouvé</Text>
              </View>
            ) : (
              <View style={styles.membersList}>
                {filtered.map((member) => (
                  <View key={member.id || member.userId} style={styles.memberCard}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.avatarText}>
                        {(member.name || member.displayName || '?')[0].toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.memberName}>{member.name || member.displayName}</Text>
                      {member.email && <Text style={styles.memberEmail}>{member.email}</Text>}
                      {member.joinedAt && (
                        <Text style={styles.memberMeta}>
                          Rejoint le {new Date(member.joinedAt).toLocaleDateString('fr-FR')}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={palette.gray} />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: palette.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: palette.gray,
  },
  membersList: {
    gap: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pendingMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: '#FCD34D', // Jaune pour pending
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  memberEmail: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 2,
  },
  memberMeta: {
    fontSize: 11,
    color: palette.gray,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  btnApprove: {
    backgroundColor: '#10B981', // Vert
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnReject: {
    backgroundColor: '#EF4444', // Rouge
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
