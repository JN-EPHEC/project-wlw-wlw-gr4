import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';
import { router } from 'expo-router';

const palette = {
  primary: '#F28B6F',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const clubs = [
  {
    id: 1,
    name: 'Club Vincennes',
    role: 'Collectifs & agility',
    status: 'Actif',
    nextSlot: 'Jeu 14:00',
    payout: '420 EUR',
  },
  {
    id: 2,
    name: 'Caniparc Ouest',
    role: 'Coaching individuel',
    status: 'Actif',
    nextSlot: 'Sam 10:00',
    payout: '285 EUR',
  },
  {
    id: 3,
    name: 'Petits Loups',
    role: 'Evaluation chiot',
    status: 'En attente',
    nextSlot: 'A planifier',
    payout: 'Proposition',
  },
];

const invites = [
  { id: 1, club: 'Dog Run Nation', detail: '2 cours collectifs par semaine', city: 'Montreuil' },
];

export default function TeacherClubsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('teacher-home')}
            >
              <Ionicons name="arrow-back" size={18} color={palette.primary} />
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
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={palette.primary} />
          </TouchableOpacity>
        </View>

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

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {invites.map((inv) => (
            <View key={inv.id} style={styles.card}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.cardTitle}>{inv.club}</Text>
            <Text style={styles.cardMeta}>{inv.city}</Text>
            <Text style={styles.cardMeta}>{inv.detail}</Text>
          </View>
            <TouchableOpacity
            style={[styles.primaryBtn, { paddingHorizontal: 14, paddingVertical: 10 }]}
            onPress={() => navigation.navigate('teacher-clubs')}
            >
            <Text style={styles.primaryBtnText}>Voir</Text>
            </TouchableOpacity>
        </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Partenariats actifs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('teacher-appointments')}>
            <Text style={styles.link}>Planning</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {clubs.map((club) => (
            <View key={club.id} style={styles.clubCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={styles.cardTitle}>{club.name}</Text>
                  <Text style={styles.cardMeta}>{club.role}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="time-outline" size={14} color={palette.gray} />
                    <Text style={styles.cardMeta}>Prochain: {club.nextSlot}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{club.status}</Text>
                  </View>
                </View>
                <View style={styles.payout}>
                  <Text style={styles.payoutLabel}>Solde</Text>
                  <Text style={styles.payoutValue}>{club.payout}</Text>
                </View>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.secondary}
                  onPress={() => navigation.navigate('teacher-community')}
                >
                  <Text style={styles.secondaryText}>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => navigation.navigate('teacher-appointments')}
                >
                  <Text style={styles.primaryBtnText}>Bloc horaires</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-clubs" />
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
  inviteCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  inviteTitle: { fontSize: 15, fontWeight: '700', color: palette.text },
  inviteMeta: { color: palette.gray, fontSize: 13 },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  link: { color: palette.primary, fontWeight: '700' },
  clubCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: palette.accent, fontWeight: '700', fontSize: 12 },
  payout: {
    alignItems: 'flex-end',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF3EC',
    borderRadius: 12,
  },
  payoutLabel: { color: palette.gray, fontSize: 12 },
  payoutValue: { color: palette.primary, fontWeight: '700', fontSize: 15 },
  actionsRow: { flexDirection: 'row', gap: 8 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryText: { color: palette.text, fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
