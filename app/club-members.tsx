import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#7C3AED',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Member = {
  id: number;
  name: string;
  email: string;
  role: 'Membre' | 'Modérateur';
  joinedDate: string;
  status: 'active' | 'pending' | 'suspended';
  dogs: number;
  lastActive: string;
  messagesCount: number;
  suspendedUntil?: string;
  suspendReason?: string;
};

const membersSeed: Member[] = [
  {
    id: 1,
    name: 'Marie Dupont',
    email: 'marie.d@email.com',
    role: 'Membre',
    joinedDate: '15 Jan 2025',
    status: 'active',
    dogs: 2,
    lastActive: 'Il y a 2h',
    messagesCount: 145,
  },
  {
    id: 2,
    name: 'Jean Martin',
    email: 'jean.m@email.com',
    role: 'Modérateur',
    joinedDate: '03 Jan 2025',
    status: 'active',
    dogs: 1,
    lastActive: 'Il y a 5 min',
    messagesCount: 328,
  },
  {
    id: 3,
    name: 'Sophie Bernard',
    email: 'sophie.b@email.com',
    role: 'Membre',
    joinedDate: '28 Déc 2024',
    status: 'active',
    dogs: 1,
    lastActive: 'Il y a 1 h',
    messagesCount: 89,
  },
  {
    id: 4,
    name: 'Thomas Petit',
    email: 'thomas.p@email.com',
    role: 'Membre',
    joinedDate: '20 Oct 2025',
    status: 'pending',
    dogs: 1,
    lastActive: '-',
    messagesCount: 0,
  },
  {
    id: 5,
    name: 'Julie Rousseau',
    email: 'julie.r@email.com',
    role: 'Membre',
    joinedDate: '18 Oct 2025',
    status: 'active',
    dogs: 3,
    lastActive: 'Il y a 10 min',
    messagesCount: 234,
  },
  {
    id: 6,
    name: 'Marc Dubois',
    email: 'marc.d@email.com',
    role: 'Membre',
    joinedDate: '10 Oct 2025',
    status: 'suspended',
    dogs: 1,
    lastActive: 'Il y a 3 jours',
    messagesCount: 67,
    suspendedUntil: '29 Oct 2025',
    suspendReason: 'Comportement inapproprié',
  },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubMembers'>;

export default function ClubMembersScreen({ navigation }: Props) {
  const [members, setMembers] = useState<Member[]>(membersSeed);
  const [search, setSearch] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<Member | null>(null);
  const [suspendDuration, setSuspendDuration] = useState('7');
  const [suspendReason, setSuspendReason] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return members;
    const lower = search.toLowerCase();
    return members.filter(
      (m) => m.name.toLowerCase().includes(lower) || m.email.toLowerCase().includes(lower)
    );
  }, [members, search]);

  const pendingMembers = filtered.filter((m) => m.status === 'pending');
  const suspendedMembers = filtered.filter((m) => m.status === 'suspended');
  const activeMembers = filtered.filter((m) => m.status === 'active');

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === 'active').length,
    pending: members.filter((m) => m.status === 'pending').length,
  };

  const approve = (id: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'active', lastActive: 'À l’instant' } : m))
    );
  };

  const reject = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const suspend = () => {
    if (!suspendTarget) return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === suspendTarget.id
          ? {
              ...m,
              status: 'suspended',
              suspendedUntil: `Dans ${suspendDuration} jours`,
              suspendReason: suspendReason || 'Non précisé',
            }
          : m
      )
    );
    setSuspendTarget(null);
    setSuspendDuration('7');
    setSuspendReason('');
    setShowSuspendModal(false);
  };

  const unsuspend = (id: number) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'active', suspendedUntil: undefined } : m)));
  };

  const kick = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const ban = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate({ name: 'clubCommunity', params: {} })}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Membres</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="account-group-outline" size={16} color="#fff" />
              <Text style={styles.headerSub}>Gérez votre communauté</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.active}</Text>
            <Text style={styles.statLabel}>Actifs</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={palette.gray} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Rechercher un membre..."
              placeholderTextColor={palette.gray}
              style={styles.searchInput}
            />
          </View>

          {pendingMembers.length > 0 ? (
            <View style={{ gap: 10 }}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="shield-outline" size={18} color="#EA580C" />
                <Text style={styles.sectionTitle}>Demandes en attente</Text>
                <View style={[styles.badge, { backgroundColor: '#EA580C' }]}>
                  <Text style={[styles.badgeText, { color: '#fff' }]}>{pendingMembers.length}</Text>
                </View>
              </View>
              {pendingMembers.map((member) => (
                <View key={member.id} style={[styles.card, { borderColor: '#FDBA74', backgroundColor: '#FFF7ED' }]}>
                  <View style={styles.memberHeader}>
                    <View style={[styles.avatar, { backgroundColor: '#F3E8FF' }]}>
                      <Text style={[styles.avatarText, { color: '#7C3AED' }]}>{member.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberMeta}>{member.email}</Text>
                      <Text style={styles.memberMeta}>Chiens : {member.dogs}</Text>
                    </View>
                  </View>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: palette.accent }]}
                      onPress={() => approve(member.id)}
                    >
                      <MaterialCommunityIcons name="check" size={16} color="#fff" />
                      <Text style={styles.actionText}>Approuver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionGhost]}
                      onPress={() => reject(member.id)}
                    >
                      <MaterialCommunityIcons name="close" size={16} color="#DC2626" />
                      <Text style={[styles.actionText, { color: '#DC2626' }]}>Refuser</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {suspendedMembers.length > 0 ? (
            <View style={{ gap: 10 }}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="clock-outline" size={18} color="#DC2626" />
                <Text style={styles.sectionTitle}>Membres suspendus</Text>
                <View style={[styles.badge, { backgroundColor: '#DC2626' }]}>
                  <Text style={[styles.badgeText, { color: '#fff' }]}>{suspendedMembers.length}</Text>
                </View>
              </View>
              {suspendedMembers.map((member) => (
                <View key={member.id} style={[styles.card, { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }]}>
                  <View style={styles.memberHeader}>
                    <View style={[styles.avatar, { backgroundColor: '#FEE2E2' }]}>
                      <Text style={[styles.avatarText, { color: '#B91C1C' }]}>{member.name.charAt(0)}</Text>
                      <View style={styles.banDot}>
                        <MaterialCommunityIcons name="block-helper" size={12} color="#fff" />
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberMeta}>{member.email}</Text>
                      <View style={styles.noteBox}>
                        <Text style={[styles.memberMeta, { color: '#B91C1C' }]}>
                          Suspendu jusqu'au {member.suspendedUntil}
                        </Text>
                        <Text style={styles.memberMeta}>Raison : {member.suspendReason}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: palette.accent }]}
                      onPress={() => unsuspend(member.id)}
                    >
                      <MaterialCommunityIcons name="check" size={16} color="#fff" />
                      <Text style={styles.actionText}>Lever</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionGhost]}
                      onPress={() => ban(member.id)}
                    >
                      <MaterialCommunityIcons name="close" size={16} color="#DC2626" />
                      <Text style={[styles.actionText, { color: '#DC2626' }]}>Bannir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <View style={{ gap: 10 }}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-group-outline" size={18} color={palette.primary} />
              <Text style={styles.sectionTitle}>Membres actifs</Text>
            </View>
            {activeMembers.map((member) => (
              <View key={member.id} style={styles.card}>
                <View style={styles.memberHeader}>
                  <View style={[styles.avatar, { backgroundColor: '#F3E8FF' }]}>
                    <Text style={[styles.avatarText, { color: '#7C3AED' }]}>{member.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      {member.role === 'Modérateur' ? (
                        <View style={[styles.badge, { backgroundColor: '#EDE9FE' }]}>
                          <Text style={[styles.badgeText, { color: '#7C3AED' }]}>{member.role}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.memberMeta}>{member.email}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.memberMeta}>Actif {member.lastActive}</Text>
                      <Text style={styles.dot}>·</Text>
                      <Text style={styles.memberMeta}>{member.messagesCount} messages</Text>
                      <Text style={styles.dot}>·</Text>
                      <Text style={styles.memberMeta}>Chiens : {member.dogs}</Text>
                    </View>
                  </View>
                  <View style={styles.iconCol}>
                    <TouchableOpacity style={styles.circleBtn} onPress={() => kick(member.id)}>
                      <MaterialCommunityIcons name="logout" size={16} color={palette.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.circleBtn}
                      onPress={() => {
                        setSuspendTarget(member);
                        setShowSuspendModal(true);
                      }}
                    >
                      <MaterialCommunityIcons name="timer-outline" size={16} color={palette.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.circleBtn} onPress={() => ban(member.id)}>
                      <MaterialCommunityIcons name="block-helper" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="shield-outline" size={18} color={palette.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Outils de modération</Text>
              <Text style={styles.infoText}>
                Expulser retire le membre temporairement, suspendre bloque l’accès pour une durée, bannir exclut
                définitivement.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={showSuspendModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Suspendre {suspendTarget?.name}</Text>
              <TouchableOpacity onPress={() => setShowSuspendModal(false)}>
                <Ionicons name="close" size={22} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={styles.label}>Durée (jours)</Text>
                <TextInput
                  value={suspendDuration}
                  onChangeText={setSuspendDuration}
                  keyboardType="number-pad"
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Raison</Text>
                <TextInput
                  value={suspendReason}
                  onChangeText={setSuspendReason}
                  placeholder="Ex: Comportement inapproprié..."
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  multiline
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionGhost, { flex: 1 }]}
                  onPress={() => {
                    setShowSuspendModal(false);
                    setSuspendTarget(null);
                  }}
                >
                  <Text style={[styles.actionText, { color: palette.text }]}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EA580C', flex: 1 }]} onPress={suspend}>
                  <MaterialCommunityIcons name="timer-outline" size={16} color="#fff" />
                  <Text style={styles.actionText}>Suspendre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#7C3AED',
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
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#E9D5FF', fontSize: 12 },
  statsCard: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { color: palette.text, fontWeight: '700', fontSize: 16 },
  statLabel: { color: palette.gray, fontSize: 12 },
  divider: { width: 1, height: 32, backgroundColor: palette.border, marginHorizontal: 10 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: { flex: 1, color: palette.text },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontWeight: '700', fontSize: 12 },
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
  memberHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', color: palette.text },
  memberName: { color: palette.text, fontWeight: '700', fontSize: 15 },
  memberMeta: { color: palette.gray, fontSize: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dot: { color: palette.gray },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: palette.border },
  actionText: { color: '#fff', fontWeight: '700' },
  noteBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    gap: 2,
  },
  banDot: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCol: { alignItems: 'center', gap: 8 },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: palette.border,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    backgroundColor: '#F5F3FF',
  },
  infoTitle: { color: palette.text, fontWeight: '700', marginBottom: 4 },
  infoText: { color: palette.text, fontSize: 13, lineHeight: 18 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 16 },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  label: { color: palette.text, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
  },
});
