import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Modal, Image } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#35A89C',
  primaryDark: '#2B8A7F',
  accent: '#E39A5C',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E6E2DD',
  surface: '#FFFFFF',
  background: '#F7F4F0',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
};

const skills = ['Education positive', 'Agility', 'Reactivite', 'Travail chiot'];
const verifications = [
  { id: 1, label: 'Identite verifiee', icon: 'checkmark-circle-outline' as const, status: 'Complete' },
  { id: 2, label: 'Assurance RC pro', icon: 'shield-checkmark-outline' as const, status: 'Valide' },
  { id: 3, label: 'Compte bancaire', icon: 'card-outline' as const, status: 'IBAN FR**42' },
];

export default function TeacherAccountPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const { logout, deleteAccount, actionLoading, user, profile } = useAuth();
  const [available, setAvailable] = useState(true);
  const [homeTravel, setHomeTravel] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  // Extract profile data
  const userProfile = (profile as any)?.profile || {};
  const firstName = userProfile?.firstName || '';
  const lastName = userProfile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Éducateur';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'ED';
  const photoUrl = userProfile?.photoUrl || '';

  const handleLogout = async () => {
    setError(null);
    try {
      await logout();
      setLogoutModalVisible(false);
    } catch (err) {
      setError(formatFirebaseAuthError(err));
      setLogoutModalVisible(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError(null);
    try {
      await deleteAccount();
      setDeleteModalVisible(false);
    } catch (err) {
      setError(formatFirebaseAuthError(err));
      setDeleteModalVisible(false);
    }
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
            <View>
              <Text style={styles.title}>Compte</Text>
              <Text style={styles.subtitle}>Profil enseignant et préférences</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('teacher-edit-profile')}>
              <Ionicons name="create-outline" size={18} color={palette.surface} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.profileCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatar}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <View>
              <Text style={styles.profileName}>{fullName}</Text>
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
            <Switch value={available} onValueChange={setAvailable} trackColor={{ true: '#BFE9E1' }} thumbColor={palette.primary} />
          </View>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Deplacements à domicile</Text>
              <Text style={styles.toggleMeta}>Zone: 8 km autour de Paris 15</Text>
            </View>
            <Switch value={homeTravel} onValueChange={setHomeTravel} trackColor={{ true: '#BFE9E1' }} thumbColor={palette.primary} />
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
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={[styles.dangerButton, actionLoading && styles.disabled]}
              onPress={() => setLogoutModalVisible(true)}
              disabled={actionLoading}
            >
              <Ionicons name="log-out-outline" size={18} color={palette.danger} />
              <Text style={styles.dangerButtonText}>
                {actionLoading ? 'Déconnexion...' : 'Se déconnecter'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dangerButton, actionLoading && styles.disabled]}
              onPress={() => setDeleteModalVisible(true)}
              disabled={actionLoading}
            >
              <Ionicons name="trash-outline" size={18} color={palette.danger} />
              <Text style={styles.dangerButtonText}>
                {actionLoading ? 'Suppression...' : 'Supprimer mon compte'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-account" />

      {/* Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Vous êtes sur le point de vous déconnecter</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutCancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.logoutCancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutConfirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutConfirmButtonText}>Se deconnecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteCancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.deleteCancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.deleteConfirmButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  hero: {
    paddingTop: 6,
    paddingBottom: 26,
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
  title: { fontSize: 20, fontWeight: '700', color: palette.surface },
  subtitle: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13 },
  editBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: palette.surface,
    marginHorizontal: 16,
    marginTop: -28,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 18,
  },
  avatarText: { color: palette.primaryDark, fontSize: 18, fontWeight: '700' },
  profileName: { fontSize: 18, fontWeight: '700', color: palette.text },
  profileRole: { color: palette.gray, fontSize: 13 },
  profileMeta: { color: palette.gray, fontSize: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#F0FBF9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: palette.primaryDark, fontWeight: '700', fontSize: 12 },
  toggles: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  toggleRow: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
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
  link: { color: palette.primaryDark, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  rowTitle: { color: palette.text, fontWeight: '700', fontSize: 14 },
  rowMeta: { color: palette.gray, fontSize: 12 },
  payoutCard: {
    backgroundColor: '#FFF9F3',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F4D9C2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  payoutLabel: { color: palette.gray, fontSize: 13 },
  payoutValue: { color: palette.primaryDark, fontSize: 20, fontWeight: '700' },
  primaryBtn: {
    backgroundColor: palette.primary,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  error: { color: palette.danger, fontSize: 13, textAlign: 'center', marginBottom: 8 },
  dangerButton: {
    borderWidth: 1.5,
    borderColor: palette.danger,
    borderRadius: 999,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.surface,
  },
  dangerButtonText: { color: palette.danger, fontWeight: '700' },
  disabled: { opacity: 0.6 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: '90%',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelButton: {
    backgroundColor: palette.danger,
  },
  logoutCancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutConfirmButton: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.danger,
  },
  logoutConfirmButtonText: {
    color: palette.danger,
    fontWeight: 'bold',
  },
  deleteCancelButton: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  deleteCancelButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteConfirmButton: {
    backgroundColor: palette.danger,
  },
  deleteConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


