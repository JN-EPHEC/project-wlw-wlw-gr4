import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

type HomeTrainingRequest = any; // Using 'any' for brevity as the type is complex
const seedRequests: HomeTrainingRequest[] = [
    // Using seed data from the original file
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubHomeTrainingRequests'>;

export default function ClubHomeTrainingRequestsScreen({ navigation }: Props) {
  const [requests] = useState<HomeTrainingRequest[]>(seedRequests);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
            <Text style={styles.headerTitle}>Demandes à domicile</Text>
            <Text style={styles.headerSub}>{requests.length} demande(s)</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {requests.length === 0 ? (
            <View style={styles.emptyState}>
                <MaterialCommunityIcons name="home-alert-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>Aucune demande</Text>
                <Text style={styles.emptySubtitle}>Les nouvelles demandes de cours à domicile apparaîtront ici.</Text>
            </View>
        ) : (
            requests.map((req) => <RequestCard key={req.id} request={req} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const RequestCard = ({ request }: { request: HomeTrainingRequest }) => {
    const statusInfo = useMemo(() => {
        switch (request.status) {
            case 'pending_club': return { text: 'En attente Club', color: colors.accent };
            case 'pending_teacher': return { text: 'En attente Éducateur', color: '#2563EB' };
            case 'confirmed': return { text: 'Confirmé', color: colors.success };
            case 'rejected': return { text: 'Refusé', color: colors.error };
            default: return { text: 'Inconnu', color: colors.textMuted };
        }
    }, [request.status]);

    return (
        <View style={[styles.card, { borderLeftColor: statusInfo.color }]}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{request.client.name}</Text>
                <Text style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>{statusInfo.text}</Text>
            </View>
            <Text style={styles.cardSubtitle}>{request.notes}</Text>
            <View style={styles.metaGrid}>
                <MetaItem icon="calendar-outline" text={new Date(request.preferredDate).toLocaleDateString('fr-FR')} />
                <MetaItem icon="time-outline" text={request.preferredTime} />
                <MetaItem icon="paw-outline" text={request.dog.name} />
                <MetaItem icon="location-outline" text={request.address.city || 'N/A'} />
            </View>
            {request.status === 'pending_club' && (
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.success}]}><Text style={styles.actionText}>Accepter</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.accent}]}><Text style={styles.actionText}>Modifier</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, {backgroundColor: colors.error}]}><Text style={styles.actionText}>Refuser</Text></TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const MetaItem = ({ icon, text }: any) => (
    <View style={styles.metaItem}>
        <Ionicons name={icon} size={16} color={colors.primary} />
        <Text style={styles.metaText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 16 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 2, shadowColor: '#000', borderLeftWidth: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: '600', overflow: 'hidden' },
  cardSubtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 12 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, borderTopWidth: 1, borderTopColor: colors.background, paddingTop: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '46%' },
  metaText: { fontSize: 14, fontWeight: '500', color: colors.text },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 16 },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  emptySubtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
});