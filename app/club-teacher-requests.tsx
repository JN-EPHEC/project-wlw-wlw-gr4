import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    success: '#10B981',
};

const seedRequests: any[] = [/* ... seed data ... */];
type Props = NativeStackScreenProps<ClubStackParamList, 'clubTeacherRequests'>;

export default function ClubTeacherRequestsScreen({ navigation }: Props) {
  const [requests] = useState<any[]>(seedRequests);
  const [selected, setSelected] = useState<any | null>(null);

  const handleAction = (id: number, action: 'approve' | 'reject') => {
      console.log(`${action} request ${id}`);
      setSelected(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Demandes d'affiliation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-question-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Aucune demande en attente</Text>
          </View>
        ) : (
          requests.map((req) => (
            <TouchableOpacity key={req.id} style={styles.card} onPress={() => setSelected(req)}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{req.name}</Text>
                    {req.verified && <Ionicons name="shield-checkmark" size={20} color={colors.primary} />}
                </View>
                <Text style={styles.cardSubtitle}>{req.specialties.join(' • ')}</Text>
                <Text style={styles.messagePreview}>"{req.message}"</Text>
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.error}]} onPress={() => handleAction(req.id, 'reject')}><Text style={styles.actionText}>Refuser</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.success}]} onPress={() => handleAction(req.id, 'approve')}><Text style={styles.actionText}>Accepter</Text></TouchableOpacity>
                </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {selected && (
        <Modal transparent visible={!!selected} animationType="fade" onRequestClose={() => setSelected(null)}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{selected.name}</Text>
                    {/* Modal content can be styled similarly */}
                    <TouchableOpacity style={{marginTop: 20}} onPress={() => setSelected(null)}><Text>Fermer</Text></TouchableOpacity>
                </View>
            </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 16 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 2, shadowColor: '#000' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  cardSubtitle: { fontSize: 14, color: colors.primary, fontWeight: '600', marginBottom: 12 },
  messagePreview: { fontSize: 15, color: colors.textMuted, fontStyle: 'italic', marginBottom: 16 },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, borderTopWidth: 1, borderTopColor: colors.background, paddingTop: 12 },
  actionButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  actionText: { color: '#fff', fontWeight: 'bold' },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  // Modal
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: colors.surface, borderRadius: 22, padding: 24, width: '90%', elevation: 5, gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
});