import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Request = {
  id: number;
  name: string;
  email: string;
  phone: string;
  requestDate: string;
  experience: string;
  certifications: string[];
  specialties: string[];
  rating: number;
  totalCourses: number;
  message: string;
  verified: boolean;
};

const pendingRequests: Request[] = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    phone: '06 12 34 56 78',
    requestDate: '2024-11-02',
    experience: '8 ans',
    certifications: ['BPJEPS', 'Certificat de capacité'],
    specialties: ['Éducation de base', 'Comportement', 'Agility'],
    rating: 4.8,
    totalCourses: 124,
    message:
      'Bonjour, je suis éducatrice canine depuis 8 ans et je suis spécialisée en comportement et agility. Je serais ravie de rejoindre votre club pour proposer mes services.',
    verified: true,
  },
  {
    id: 2,
    name: 'Marc Dupont',
    email: 'marc.dupont@email.com',
    phone: '06 98 76 54 32',
    requestDate: '2024-11-01',
    experience: '5 ans',
    certifications: ['Certificat de capacité'],
    specialties: ['Éducation de base', 'Socialisation'],
    rating: 4.6,
    totalCourses: 67,
    message: 'Je souhaite rejoindre votre club pour développer mon activité et rencontrer d’autres professionnels.',
    verified: false,
  },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubTeacherRequests'>;

export default function ClubTeacherRequestsScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<Request | null>(null);

  const approve = (id: number) => {
    setSelected(null);
  };
  const reject = (id: number) => {
    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubTeachers')}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Demandes d’affiliation</Text>
            <Text style={styles.headerSub}>
              {pendingRequests.length} demande{pendingRequests.length > 1 ? 's' : ''} en attente
            </Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          {pendingRequests.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="checkmark-circle-outline" size={42} color={palette.gray} />
              <Text style={styles.emptyTitle}>Aucune demande en attente</Text>
              <Text style={styles.emptyText}>Les demandes d’affiliation des éducateurs apparaîtront ici.</Text>
            </View>
          ) : (
            pendingRequests.map((r) => (
              <TouchableOpacity key={r.id} style={styles.card} activeOpacity={0.9} onPress={() => setSelected(r)}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{r.name.split(' ').map((n) => n[0]).join('')}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{r.name}</Text>
                      {r.verified ? (
                        <View style={[styles.badge, { backgroundColor: palette.accent }]}>
                          <MaterialCommunityIcons name="shield-check" size={14} color="#fff" />
                          <Text style={[styles.badgeText, { color: '#fff' }]}>Vérifié</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.cardMeta}>
                      Demande envoyée le{' '}
                      {new Date(r.requestDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.cardMeta}>{r.specialties.join(' · ')}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.gray} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {selected ? (
        <Modal transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Demande d’affiliation</Text>
                <TouchableOpacity onPress={() => setSelected(null)}>
                  <Ionicons name="close" size={22} color={palette.gray} />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 500 }} contentContainerStyle={{ paddingBottom: 12 }}>
                <View style={styles.profileCard}>
                  <View style={styles.avatarLarge}>
                    <Text style={styles.avatarText}>{selected.name.split(' ').map((n) => n[0]).join('')}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{selected.name}</Text>
                      {selected.verified ? (
                        <View style={[styles.badge, { backgroundColor: palette.accent }]}>
                          <MaterialCommunityIcons name="shield-check" size={14} color="#fff" />
                          <Text style={[styles.badgeText, { color: '#fff' }]}>Vérifié</Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <MaterialCommunityIcons name="star" size={16} color="#FACC15" />
                      <Text style={styles.cardMeta}>
                        {selected.rating} ({selected.totalCourses} cours donnés)
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email-outline" size={16} color={palette.gray} />
                  <Text style={styles.cardMeta}>{selected.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="phone-outline" size={16} color={palette.gray} />
                  <Text style={styles.cardMeta}>{selected.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar-outline" size={16} color={palette.gray} />
                  <Text style={styles.cardMeta}>{selected.experience} d’expérience</Text>
                </View>

                <Text style={styles.sectionTitle}>Certifications</Text>
                <View style={{ gap: 6, marginBottom: 10 }}>
                  {selected.certifications.map((cert) => (
                    <View key={cert} style={styles.certCard}>
                      <MaterialCommunityIcons name="certificate-outline" size={16} color="#F59E0B" />
                      <Text style={styles.cardMeta}>{cert}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.sectionTitle}>Spécialités</Text>
                <View style={styles.chips}>
                  {selected.specialties.map((s) => (
                    <View key={s} style={[styles.badge, { backgroundColor: '#FDF5E6' }]}>
                      <Text style={[styles.badgeText, { color: palette.primary }]}>{s}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.sectionTitle}>Message de présentation</Text>
                <View style={styles.messageBox}>
                  <Text style={styles.cardMeta}>{selected.message}</Text>
                </View>

                <View style={styles.notice}>
                  <MaterialCommunityIcons name="calendar-month-outline" size={16} color={palette.accent} />
                  <Text style={styles.noticeText}>
                    Demande reçue le{' '}
                    {new Date(selected.requestDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={[styles.actionBtn, styles.actionGhost]} onPress={() => reject(selected.id)}>
                  <Ionicons name="close" size={16} color="#DC2626" />
                  <Text style={[styles.actionText, { color: '#DC2626' }]}>Refuser</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: palette.accent }]} onPress={() => approve(selected.id)}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.actionText}>Accepter</Text>
                </TouchableOpacity>
              </View>
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
  container: { padding: 16 },
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
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  cardMeta: { color: palette.gray, fontSize: 13 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#ECFEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.text, fontWeight: '700' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { fontWeight: '700', fontSize: 12 },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: { color: palette.text, fontWeight: '700' },
  emptyText: { color: palette.gray, textAlign: 'center' },
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
    gap: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  profileCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  sectionTitle: { color: palette.text, fontWeight: '700', marginTop: 12 },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: palette.border,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  messageBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ECFEFF',
    borderWidth: 1,
    borderColor: '#A5F3FC',
    marginTop: 10,
  },
  noticeText: { color: palette.text, fontSize: 12, flex: 1 },
  modalFooter: { flexDirection: 'row', gap: 10, marginTop: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionGhost: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: palette.border },
  actionText: { color: '#fff', fontWeight: '700' },
});
