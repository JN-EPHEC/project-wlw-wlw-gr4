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

const palette = {
  primary: '#E9B782',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type HomeTrainingRequest = {
  id: number;
  status: 'pending_club' | 'pending_teacher' | 'confirmed' | 'rejected';
  client: { name: string; email: string; phone: string };
  dog: { name: string; breed: string; age: string };
  preferredDate: string;
  preferredTime: string;
  confirmedDate?: string;
  confirmedTime?: string;
  alternativeSlots: { date: string; time: string }[];
  address: { street: string; postalCode: string; city: string; additionalInfo?: string };
  requestedTeacher: string;
  assignedTeacher?: string;
  notes?: string;
  submittedAt: string;
  clubValidatedAt?: string;
  teacherValidatedAt?: string;
  price?: number;
};

const seedRequests: HomeTrainingRequest[] = [
  {
    id: 1,
    status: 'pending_club',
    client: { name: 'Client', email: '', phone: '' },
    dog: { name: 'Chien 1', breed: 'Race inconnue', age: 'Âge inconnu' },
    preferredDate: '2025-10-28',
    preferredTime: '14:00',
    alternativeSlots: [
      { date: '2025-10-29', time: '10:00' },
      { date: '2025-10-30', time: '15:00' },
    ],
    address: { street: 'Adresse fournie par le client', postalCode: '', city: '', additionalInfo: '' },
    requestedTeacher: 'Éducateur',
    notes: 'Demande de travail sur le rappel en extérieur.',
    submittedAt: '2025-10-20 14:30',
  },
  {
    id: 2,
    status: 'pending_teacher',
    client: { name: 'Client', email: '', phone: '' },
    dog: { name: 'Chien 2', breed: 'Race inconnue', age: 'Âge inconnu' },
    preferredDate: '2025-10-27',
    preferredTime: '10:00',
    alternativeSlots: [],
    address: { street: 'Adresse fournie par le client', postalCode: '', city: '', additionalInfo: '' },
    requestedTeacher: 'Éducateur',
    assignedTeacher: 'Éducateur',
    notes: 'Travail de socialisation et marche en laisse.',
    submittedAt: '2025-10-21 09:15',
    clubValidatedAt: '2025-10-21 15:20',
  },
  {
    id: 3,
    status: 'confirmed',
    client: { name: 'Client', email: '', phone: '' },
    dog: { name: 'Chien 3', breed: 'Race inconnue', age: 'Âge inconnu' },
    preferredDate: '2025-10-26',
    preferredTime: '16:00',
    confirmedDate: '2025-10-26',
    confirmedTime: '16:00',
    alternativeSlots: [],
    address: { street: 'Adresse fournie par le client', postalCode: '', city: '', additionalInfo: '' },
    requestedTeacher: 'Peu importe',
    assignedTeacher: 'Éducateur',
    notes: 'Demande urgente liée au comportement.',
    submittedAt: '2025-10-19 11:00',
    clubValidatedAt: '2025-10-19 14:30',
    teacherValidatedAt: '2025-10-19 16:45',
    price: 85,
  },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubHomeTrainingRequests'>;

export default function ClubHomeTrainingRequestsScreen({ navigation }: Props) {
  const [requests] = useState<HomeTrainingRequest[]>(seedRequests);
  const [selected, setSelected] = useState<HomeTrainingRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showModify, setShowModify] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [modifiedDate, setModifiedDate] = useState('');
  const [modifiedTime, setModifiedTime] = useState('');
  const [modificationReason, setModificationReason] = useState('');

  const statusInfo = (status: HomeTrainingRequest['status']) => {
    switch (status) {
      case 'pending_club':
        return { color: '#F97316', bg: '#FFF7ED', text: 'En attente club' };
      case 'pending_teacher':
        return { color: '#2563EB', bg: '#EFF6FF', text: 'En attente éducateur' };
      case 'confirmed':
        return { color: '#16A34A', bg: '#ECFDF3', text: 'Confirmé' };
      case 'rejected':
        return { color: '#DC2626', bg: '#FEF2F2', text: 'Refusé' };
      default:
        return { color: palette.gray, bg: '#F8FAFC', text: 'Inconnu' };
    }
  };

  const openDetail = (req: HomeTrainingRequest) => {
    setSelected(req);
    setShowDetail(true);
  };

  const acceptRequest = (req: HomeTrainingRequest) => {
    if (req.requestedTeacher && req.requestedTeacher !== 'Peu importe') {
      setSelected(req);
      setShowAssign(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubAppointments')}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Demandes à domicile</Text>
            <Text style={styles.headerSub}>{requests.length} demande(s)</Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          {requests.map((req) => {
            const info = statusInfo(req.status);
            return (
              <TouchableOpacity
                key={req.id}
                style={[styles.card, { borderLeftColor: info.color, backgroundColor: info.bg }]}
                activeOpacity={0.9}
                onPress={() => openDetail(req)}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.iconCircle, { backgroundColor: info.bg }]}>
                      <Ionicons name="home-outline" size={18} color={info.color} />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>{req.client.name}</Text>
                      <Text style={styles.cardMeta}>
                        {new Date(req.preferredDate).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        · {req.preferredTime}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.badge, { backgroundColor: info.color + '22' }]}>
                    <Text style={[styles.badgeText, { color: info.color }]}>{info.text}</Text>
                  </View>
                </View>

                <View style={{ gap: 6, marginTop: 6 }}>
                  <View style={styles.metaRow}>
                    <Ionicons name="paw-outline" size={14} color={palette.gray} />
                    <Text style={styles.cardMeta}>
                      {req.dog.name} - {req.dog.breed}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={14} color={palette.gray} />
                    <Text style={styles.cardMeta}>{req.address.city || req.address.street}</Text>
                  </View>
                  {req.requestedTeacher ? (
                    <View style={styles.metaRow}>
                      <Ionicons name="person-outline" size={14} color={palette.gray} />
                      <Text style={styles.cardMeta}>Éducateur : {req.requestedTeacher}</Text>
                    </View>
                  ) : null}
                </View>

                {req.status === 'pending_club' ? (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: palette.accent }]} onPress={() => acceptRequest(req)}>
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      <Text style={styles.actionText}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionGhost]}
                      onPress={() => {
                        setSelected(req);
                        setModifiedDate(req.preferredDate);
                        setModifiedTime(req.preferredTime);
                        setShowModify(true);
                      }}
                    >
                      <MaterialCommunityIcons name="pencil-outline" size={16} color={palette.text} />
                      <Text style={[styles.actionText, { color: palette.text }]}>Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconBtn, { borderColor: '#DC2626' }]}>
                      <Ionicons name="close-circle" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                ) : null}

                {req.status === 'confirmed' && req.price ? (
                  <View style={styles.priceRow}>
                    <Text style={styles.cardMeta}>Prix convenu</Text>
                    <Text style={[styles.cardTitle, { color: palette.primary }]}>{req.price}€</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selected ? (
        <Modal transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Détails de la demande</Text>
                <TouchableOpacity onPress={() => { setShowDetail(false); setSelected(null); }}>
                  <Ionicons name="close" size={22} color={palette.gray} />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={{ paddingBottom: 12 }}>
                <View style={styles.detailBlock}>
                  <Text style={styles.sectionTitle}>Client</Text>
                  <Text style={styles.cardMeta}>{selected.client.name}</Text>
                  <Text style={styles.cardMeta}>{selected.client.email}</Text>
                  <Text style={styles.cardMeta}>{selected.client.phone}</Text>
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.sectionTitle}>Chien</Text>
                  <Text style={styles.cardMeta}>{selected.dog.name}</Text>
                  <Text style={styles.cardMeta}>{selected.dog.breed}</Text>
                  <Text style={styles.cardMeta}>{selected.dog.age}</Text>
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.sectionTitle}>Date et heure</Text>
                  <Text style={styles.cardMeta}>
                    {new Date(selected.preferredDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · {selected.preferredTime}
                  </Text>
                  {selected.alternativeSlots.length ? (
                    <View style={{ marginTop: 6 }}>
                      <Text style={[styles.cardMeta, { fontWeight: '700' }]}>Créneaux alternatifs :</Text>
                      {selected.alternativeSlots.map((slot, idx) => (
                        <Text key={idx} style={styles.cardMeta}>
                          {new Date(slot.date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          · {slot.time}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.sectionTitle}>Adresse</Text>
                  <Text style={styles.cardMeta}>{selected.address.street}</Text>
                  <Text style={styles.cardMeta}>
                    {selected.address.postalCode} {selected.address.city}
                  </Text>
                  {selected.address.additionalInfo ? (
                    <Text style={styles.cardMeta}>Info : {selected.address.additionalInfo}</Text>
                  ) : null}
                </View>
                {selected.notes ? (
                  <View style={styles.detailBlock}>
                    <Text style={styles.sectionTitle}>Notes du client</Text>
                    <Text style={styles.cardMeta}>{selected.notes}</Text>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}

      {showModify ? (
        <Modal transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Proposer une modification</Text>
                <TouchableOpacity onPress={() => setShowModify(false)}>
                  <Ionicons name="close" size={22} color={palette.gray} />
                </TouchableOpacity>
              </View>
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={styles.label}>Nouvelle date</Text>
                  <TextInput
                    value={modifiedDate}
                    onChangeText={setModifiedDate}
                    placeholder="2025-10-28"
                    style={styles.input}
                    placeholderTextColor={palette.gray}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Nouvelle heure</Text>
                  <TextInput
                    value={modifiedTime}
                    onChangeText={setModifiedTime}
                    placeholder="14:00"
                    style={styles.input}
                    placeholderTextColor={palette.gray}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Raison (optionnel)</Text>
                  <TextInput
                    value={modificationReason}
                    onChangeText={setModificationReason}
                    placeholder="Expliquez pourquoi..."
                    style={[styles.input, styles.multiline]}
                    multiline
                    placeholderTextColor={palette.gray}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.primaryBtn, (!modifiedDate || !modifiedTime) && { opacity: 0.6 }]}
                  onPress={() => {
                    setShowModify(false);
                    setModificationReason('');
                  }}
                  disabled={!modifiedDate || !modifiedTime}
                >
                  <MaterialCommunityIcons name="send" size={18} color="#fff" />
                  <Text style={styles.primaryBtnText}>Envoyer la proposition</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      {showAssign && selected ? (
        <Modal transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Assigner un éducateur</Text>
                <TouchableOpacity onPress={() => setShowAssign(false)}>
                  <Ionicons name="close" size={22} color={palette.gray} />
                </TouchableOpacity>
              </View>
              <View style={styles.notice}>
                <MaterialCommunityIcons name="information-outline" size={16} color={palette.primary} />
                <Text style={styles.noticeText}>
                  Une fois acceptée, la demande sera envoyée à l’éducateur qui devra valider ou proposer une modification.
                </Text>
              </View>
              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8 }]} onPress={() => setShowAssign(false)}>
                <MaterialCommunityIcons name="send" size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>Envoyer à l’éducateur</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: palette.primary,
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
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#F8F3E9', fontSize: 12 },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  cardMeta: { color: palette.gray, fontSize: 13 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontWeight: '700', fontSize: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: palette.border },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 10,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  detailBlock: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: palette.border, marginBottom: 10 },
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
  multiline: { height: 90, textAlignVertical: 'top' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.accent,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  notice: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ECFEFF',
    borderWidth: 1,
    borderColor: '#A5F3FC',
  },
  noticeText: { color: palette.text, fontSize: 12, flex: 1 },
});
