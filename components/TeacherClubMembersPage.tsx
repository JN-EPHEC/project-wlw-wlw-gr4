import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const members = [
  { id: 1, name: 'Marie Dupont', dog: 'Nova', status: 'Actif', next: 'Jeu 10:00', tag: 'Collectif' },
  { id: 2, name: 'Thomas Petit', dog: 'Rex', status: 'Suivi', next: 'En attente', tag: 'Solo' },
  { id: 3, name: 'Julie Roux', dog: 'Luna', status: 'Nouveau', next: 'Proposer', tag: 'Domicile' },
  { id: 4, name: 'Club staff', dog: 'N/A', status: 'Equipe', next: 'Coordination', tag: 'Staff' },
];

const filters = [
  { key: 'all', label: 'Tous' },
  { key: 'active', label: 'Actifs' },
  { key: 'waiting', label: 'A planifier' },
];

export default function TeacherClubMembersPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const route = useRoute<RouteProp<TeacherStackParamList, 'teacher-club-members'>>();
  const { clubId } = route.params;
  const [active, setActive] = useState('all');

  const badgeColor = (tag: string) => {
    switch (tag) {
      case 'Collectif':
        return { bg: '#E0E7FF', text: '#4338CA' };
      case 'Solo':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'Domicile':
        return { bg: '#E0F2F1', text: '#047857' };
      default:
        return { bg: '#E5E7EB', text: palette.text };
    }
  };

  const filtered = members.filter((m) => {
    if (active === 'all') return true;
    if (active === 'active') return m.status === 'Actif';
    if (active === 'waiting') return m.next === 'Proposer' || m.next === 'En attente';
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('teacher-club-community', { clubId })}
            >
              <Ionicons name="arrow-back" size={18} color={palette.primary} />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Membres du club</Text>
              <Text style={styles.subtitle}>Coordonnees clients et suivi</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('teacher-channel-chat', { channelId: 'members', clubId })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          {filters.map((f) => {
            const isActive = f.key === active;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActive(f.key)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {filtered.map((member) => {
            const badge = badgeColor(member.tag);
            return (
              <View key={member.id} style={styles.card}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.cardTitle}>{member.name}</Text>
                  <Text style={styles.cardMeta}>Chien: {member.dog}</Text>
                  <Text style={styles.cardMeta}>Statut: {member.status}</Text>
                  <Text style={styles.cardMeta}>Prochain: {member.next}</Text>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>{member.tag}</Text>
                  </View>
                </View>
                <View style={{ gap: 8 }}>
                  <TouchableOpacity
                    style={styles.secondary}
                    onPress={() => navigation.navigate('teacher-channel-chat', { channelId: `member-${member.id}`, clubId })}
                  >
                    <Text style={styles.secondaryText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('teacher-appointments')}
                  >
                    <Text style={styles.primaryBtnText}>Planifier</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={20} color={palette.accent} />
            <Text style={styles.summaryTitle}>A faire</Text>
          </View>
          <Text style={styles.cardMeta}>2 comptes rendus et 1 proposition de planning a envoyer</Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 10 }]}
            onPress={() => navigation.navigate('teacher-home')}
          >
            <Text style={styles.primaryBtnText}>Voir les actions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-community" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 13 },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: '#FFF3EC',
    borderColor: palette.primary,
  },
  filterText: { color: palette.gray, fontWeight: '700' },
  filterTextActive: { color: palette.primary },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
  },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  badge: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  secondary: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  secondaryText: { color: palette.text, fontWeight: '700' },
  primaryBtn: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  summaryCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6,
  },
  summaryTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
});
