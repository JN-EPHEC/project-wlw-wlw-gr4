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
  primary: '#41B6A6',
  primaryDark: '#359889',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type EventItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  type: 'social' | 'competition' | 'training' | 'openday';
  status: 'upcoming' | 'full';
};

const seedEvents: EventItem[] = [
  {
    id: 1,
    title: 'Balade en forêt de Fontainebleau',
    description: 'Grande balade canine en forêt avec pique-nique. Ouvert à tous les niveaux.',
    date: 'Sam 28 Oct',
    time: '10:00',
    location: 'Parking de la forêt',
    participants: 12,
    maxParticipants: 20,
    type: 'social',
    status: 'upcoming',
  },
  {
    id: 2,
    title: "Compétition d'agility inter-clubs",
    description: 'Participez à notre compétition amicale d’agility. Inscription requise.',
    date: 'Dim 5 Nov',
    time: '14:00',
    location: "Terrain d'agility",
    participants: 8,
    maxParticipants: 15,
    type: 'competition',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Atelier comportement canin',
    description: 'Atelier sur la communication canine et la résolution de problèmes comportementaux.',
    date: 'Mer 8 Nov',
    time: '18:30',
    location: 'Salle de formation',
    participants: 15,
    maxParticipants: 15,
    type: 'training',
    status: 'full',
  },
  {
    id: 4,
    title: 'Journée portes ouvertes',
    description: 'Découvrez notre club et nos activités. Démonstrations et essais gratuits.',
    date: 'Sam 11 Nov',
    time: '10:00',
    location: 'Club Canin Paris',
    participants: 0,
    maxParticipants: 50,
    type: 'openday',
    status: 'upcoming',
  },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubEventsManagement'>;

export default function ClubEventsManagementScreen({ navigation }: Props) {
  const [events, setEvents] = useState<EventItem[]>(seedEvents);
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    type: '' as EventItem['type'] | '',
  });

  const stats = useMemo(
    () => ({
      total: events.length,
      upcoming: events.filter((e) => e.status === 'upcoming').length,
      participants: events.reduce((sum, e) => sum + e.participants, 0),
    }),
    [events]
  );

  const badgeForType = (type: EventItem['type']) => {
    const map = {
      social: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Social' },
      competition: { bg: '#F3E8FF', text: '#7C3AED', label: 'Compétition' },
      training: { bg: '#FFEDD5', text: '#EA580C', label: 'Formation' },
      openday: { bg: '#DCFCE7', text: '#166534', label: 'Portes ouvertes' },
    } as const;
    const conf = map[type];
    return (
      <View style={[styles.badge, { backgroundColor: conf.bg }]}>
        <Text style={[styles.badgeText, { color: conf.text }]}>{conf.label}</Text>
      </View>
    );
  };

  const handleCreate = () => {
    if (!draft.title.trim()) return;
    const next: EventItem = {
      id: events.length + 1,
      title: draft.title.trim(),
      description: draft.description.trim(),
      date: draft.date || 'À planifier',
      time: draft.time || '--:--',
      location: draft.location || 'À préciser',
      participants: 0,
      maxParticipants: Number(draft.maxParticipants) || 0,
      type: (draft.type as EventItem['type']) || 'social',
      status: 'upcoming',
    };
    setEvents([next, ...events]);
    setDraft({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: '',
      type: '',
    });
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate({ name: 'clubCommunity', params: {} })}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Événements</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="calendar-month-outline" size={16} color="#fff" />
              <Text style={styles.headerSub}>Gérez vos événements</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={22} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Événements</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.upcoming}</Text>
            <Text style={styles.statLabel}>À venir</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.participants}</Text>
            <Text style={styles.statLabel}>Inscrits</Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="calendar" size={18} color={palette.primary} />
            <Text style={styles.sectionTitle}>Événements à venir</Text>
          </View>

          {events.map((event) => (
            <View
              key={event.id}
              style={[
                styles.card,
                event.status === 'full' && { borderColor: '#FDBA74', backgroundColor: '#FFF7ED' },
              ]}
            >
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={styles.dateBox}>
                  {event.date.split(' ').map((chunk, idx) => (
                    <Text key={idx} style={styles.dateText}>
                      {chunk}
                    </Text>
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{event.title}</Text>
                    {badgeForType(event.type)}
                  </View>
                  <Text style={styles.cardContent}>{event.description}</Text>
                  <View style={{ gap: 4, marginTop: 6 }}>
                    <View style={styles.metaRow}>
                      <Ionicons name="time-outline" size={14} color={palette.gray} />
                      <Text style={styles.cardMeta}>{event.time}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <MaterialCommunityIcons name="map-marker-outline" size={14} color={palette.gray} />
                      <Text style={styles.cardMeta}>{event.location}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Ionicons name="people-outline" size={14} color={palette.gray} />
                      <Text style={styles.cardMeta}>
                        {event.participants}/{event.maxParticipants} participants
                      </Text>
                      {event.status === 'full' ? (
                        <View style={[styles.badge, { backgroundColor: '#F97316' }]}>
                          <Text style={[styles.badgeText, { color: '#fff' }]}>Complet</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionBtn, styles.actionGhost]}>
                  <MaterialCommunityIcons name="account-group-outline" size={16} color={palette.text} />
                  <Text style={[styles.actionText, { color: palette.text }]}>Participants</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionGhost]}>
                  <MaterialCommunityIcons name="pencil-outline" size={16} color={palette.text} />
                  <Text style={[styles.actionText, { color: palette.text }]}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.circleBtn]}>
                  <MaterialCommunityIcons name="trash-can-outline" size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvel événement</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={22} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={styles.label}>Titre de l’événement</Text>
                <TextInput
                  value={draft.title}
                  onChangeText={(text) => setDraft({ ...draft, title: text })}
                  placeholder="Ex: Balade en forêt..."
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  value={draft.description}
                  onChangeText={(text) => setDraft({ ...draft, description: text })}
                  placeholder="Décrivez votre événement..."
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  multiline
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Date</Text>
                  <TextInput
                    value={draft.date}
                    onChangeText={(text) => setDraft({ ...draft, date: text })}
                    placeholder="Sam 28 Oct"
                    style={styles.input}
                    placeholderTextColor={palette.gray}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Heure</Text>
                  <TextInput
                    value={draft.time}
                    onChangeText={(text) => setDraft({ ...draft, time: text })}
                    placeholder="10:00"
                    style={styles.input}
                    placeholderTextColor={palette.gray}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.label}>Lieu</Text>
                <TextInput
                  value={draft.location}
                  onChangeText={(text) => setDraft({ ...draft, location: text })}
                  placeholder="Ex: Parking de la forêt..."
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Type d’événement</Text>
                <View style={styles.typeRow}>
                  {(['social', 'competition', 'training', 'openday'] as EventItem['type'][]).map((type) => {
                    const active = draft.type === type;
                    const labels: Record<EventItem['type'], string> = {
                      social: 'Social',
                      competition: 'Compétition',
                      training: 'Formation',
                      openday: 'Portes ouvertes',
                    };
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.typePill, active && styles.typePillActive]}
                        onPress={() => setDraft({ ...draft, type })}
                      >
                        <Text style={[styles.typePillText, active && styles.typePillTextActive]}>{labels[type]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View>
                <Text style={styles.label}>Participants max</Text>
                <TextInput
                  value={draft.maxParticipants}
                  onChangeText={(text) => setDraft({ ...draft, maxParticipants: text })}
                  placeholder="Ex: 20"
                  keyboardType="number-pad"
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <TouchableOpacity style={styles.publishBtn} onPress={handleCreate} activeOpacity={0.9}>
                <MaterialCommunityIcons name="calendar-plus" size={18} color="#fff" />
                <Text style={styles.publishText}>Créer l’événement</Text>
              </TouchableOpacity>
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
  headerSub: { color: '#E0F2F1', fontSize: 12 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
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
    gap: 12,
  },
  dateBox: {
    width: 60,
    borderRadius: 12,
    backgroundColor: '#ECFEFF',
    borderWidth: 1,
    borderColor: '#CFFAFE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  dateText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 15, flex: 1 },
  cardContent: { color: palette.text, fontSize: 14, lineHeight: 20, marginTop: 4 },
  cardMeta: { color: palette.gray, fontSize: 13 },
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
  },
  actionGhost: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: palette.border },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontWeight: '700', fontSize: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  typePillActive: { backgroundColor: '#ECFEFF', borderColor: palette.primary },
  typePillText: { color: palette.text, fontWeight: '600' },
  typePillTextActive: { color: palette.primary },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  publishText: { color: '#fff', fontWeight: '700' },
});
