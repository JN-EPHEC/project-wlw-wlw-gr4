import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    error: '#DC2626',
};

const seedTeachers: any[] = [/* ... seed data ... */];
type Props = NativeStackScreenProps<ClubStackParamList, 'clubTeachers'>;

export default function ClubTeachersScreen({ navigation }: Props) {
  const [teachers, setTeachers] = useState<any[]>(seedTeachers);
  const [selectedCredentials, setSelectedCredentials] = useState<any | null>(null);

  const stats = useMemo(() => ({
      total: teachers.length,
      freeLeft: Math.max(0, 2 - teachers.length),
  }), [teachers]);

  const addTeacher = () => {
      if(stats.freeLeft > 0) navigation.navigate('clubAddTeacher');
      else navigation.navigate('clubTeachersPricing', {});
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Nos enseignants</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statsGrid}>
            <StatBox icon="people-outline" value={stats.total} label="Total" />
            <StatBox icon="gift-outline" value={stats.freeLeft} label="Gratuits restants" />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={addTeacher}>
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.primaryButtonText}>Ajouter un enseignant</Text>
        </TouchableOpacity>

        {teachers.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="school-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Aucun enseignant</Text>
          </View>
        ) : (
          teachers.map((t) => (
            <View key={t.id} style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{t.firstName} {t.lastName}</Text>
                    <View style={{flexDirection: 'row', gap: 8}}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => setSelectedCredentials(t)}><Ionicons name="key-outline" size={18} color={colors.primary} /></TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}><Ionicons name="trash-outline" size={18} color={colors.error} /></TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.cardSubtitle}>{t.specialties.join(' • ')}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {selectedCredentials && (
          <CredentialsModal teacher={selectedCredentials} onClose={() => setSelectedCredentials(null)} />
      )}
    </SafeAreaView>
  );
}

const StatBox = ({ icon, value, label }: any) => (
    <View style={styles.statBox}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const CredentialsModal = ({ teacher, onClose }: any) => (
    <Modal transparent visible={!!teacher} animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalBackdrop}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Identifiants pour {teacher.firstName}</Text>
                <TextInput label="Code d'identifiant" value={teacher.credentials.username} editable={false} />
                <TextInput label="Mot de passe" value={teacher.credentials.password} editable={false} secureTextEntry />
                <TouchableOpacity style={styles.primaryButton} onPress={onClose}><Text style={styles.primaryButtonText}>Fermer</Text></TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 16 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statBox: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', gap: 4, elevation: 2 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  iconButton: { padding: 6, borderRadius: 12, backgroundColor: colors.background },
  cardSubtitle: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: colors.surface, borderRadius: 22, padding: 24, width: '90%', elevation: 5, gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
  input: { backgroundColor: colors.background, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 10 },
});