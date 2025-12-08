import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { useAuth } from '@/context/AuthContext';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const skills = ['Education positive', 'Agility', 'Reactivite', 'Travail chiot'];
const verifications = [
  { id: 1, label: 'Identite verifiee', icon: 'checkmark-circle-outline' as const, status: 'Complete' },
  { id: 2, label: 'Assurance RC pro', icon: 'shield-checkmark-outline' as const, status: 'Valide' },
  { id: 3, label: 'Compte bancaire', icon: 'card-outline' as const, status: 'IBAN FR**42' },
];

export default function TeacherAccountPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const { logout } = useAuth();
  const [available, setAvailable] = useState(true);
  const [homeTravel, setHomeTravel] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Compte</Text>
            <Text style={styles.subtitle}>Profil enseignant et préférences</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('teacher-home')}>
            <Ionicons name="create-outline" size={18} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SM</Text>
            </View>
            <View>
              <Text style={styles.profileName}>Sophie Martin</Text>
              <Text style={styles.profileRole}>Educateur canin</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                <Text style={styles.profileMeta}>4.9 (156 avis)</Text>
              </View>
            </View>
          </View>
          <View style={styles.tagRow}>
            {skills.map((s) => (
              <View key={s} style={styles.tag}>
                <Text style={styles.tagText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.toggles}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Disponible</Text>
              <Text style={styles.toggleMeta}>Afficher votre profil dans les recherches</Text>
            </View>
            <Switch value={available} onValueChange={setAvailable} trackColor={{ true: '#FAD5C1' }} thumbColor="#F28B6F" />
          </View>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Deplacements à domicile</Text>
              <Text style={styles.toggleMeta}>Zone: 8 km autour de Paris 15</Text>
            </View>
            <Switch value={homeTravel} onValueChange={setHomeTravel} trackColor={{ true: '#FAD5C1' }} thumbColor="#F28B6F" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verifications</Text>
          <View style={{ gap: 10 }}>
            {verifications.map((v) => (
              <View key={v.id} style={styles.row}>
                <Ionicons name={v.icon} size={18} color={palette.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{v.label}</Text>
                  <Text style={styles.rowMeta}>{v.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={palette.gray} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Paiements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('teacher-clubs')}>
              <Text style={styles.link}>Historique</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.payoutCard}>
            <View>
              <Text style={styles.payoutLabel}>Prochain virement</Text>
              <Text style={styles.payoutValue}>640 EUR</Text>
              <Text style={styles.rowMeta}>Paiement hebdo - Vendredi</Text>
            </View>
            <MaterialCommunityIcons name="bank-transfer" size={26} color={palette.primary} />
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 10 }]}
            onPress={() => navigation.navigate('teacher-appointments')}
          >
            <Text style={styles.primaryBtnText}>Exporter mes sessions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support et sécurité</Text>
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('teacherLeaderboard', { clubId: 1 })}
            >
              <MaterialCommunityIcons name="trophy-outline" size={20} color={palette.accent} />
              <Text style={styles.rowTitle}>Classements</Text>
              <Ionicons name="chevron-forward" size={18} color={palette.gray} />
            </TouchableOpacity>
            <View style={styles.row}>
              <Ionicons name="help-circle-outline" size={18} color={palette.gray} />
              <Text style={styles.rowTitle}>Centre d'aide</Text>
              <Ionicons name="chevron-forward" size={18} color={palette.gray} />
            </View>
            <View style={styles.row}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.gray} />
              <Text style={styles.rowTitle}>Confidentialite</Text>
              <Ionicons name="chevron-forward" size={18} color={palette.gray} />
            </View>
            <TouchableOpacity style={styles.row} onPress={logout}>
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text style={[styles.rowTitle, { color: '#DC2626' }]}>Se deconnecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-account" />
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
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 13 },
  editBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.primary, fontSize: 18, fontWeight: '700' },
  profileName: { fontSize: 18, fontWeight: '700', color: palette.text },
  profileRole: { color: palette.gray, fontSize: 13 },
  profileMeta: { color: palette.gray, fontSize: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: { color: palette.accent, fontWeight: '700', fontSize: 12 },
  toggles: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  toggleRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTitle: { fontSize: 15, fontWeight: '700', color: palette.text },
  toggleMeta: { color: palette.gray, fontSize: 13 },
  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  link: { color: palette.primary, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  rowTitle: { color: palette.text, fontWeight: '700', fontSize: 14 },
  rowMeta: { color: palette.gray, fontSize: 12 },
  payoutCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payoutLabel: { color: palette.gray, fontSize: 13 },
  payoutValue: { color: palette.text, fontSize: 20, fontWeight: '700' },
  primaryBtn: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
