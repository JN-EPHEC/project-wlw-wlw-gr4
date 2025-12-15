import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { addDoc, collection, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '@/firebaseConfig';

import { ClubStackParamList } from '@/navigation/types';
import { useClubEvents } from '@/hooks/useClubEvents';
import { useGetUserNames } from '@/hooks/useGetUserNames';
import { useAuth } from '@/context/AuthContext';

const palette = {
  primary: '#41B6A6',
  primaryDark: '#359889',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  maxSpectators: number;
  participantData?: Array<{ userId: string; numDogs: number }>;
  type: 'Social' | 'Compétition' | 'Formation' | 'Portes ouvertes';
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

export default function ClubEventsManagementScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  const clubId = (route.params as any)?.clubId || (profile as any)?.clubId || user?.uid || '';
  const { events: firebaseEvents, loading: eventsLoading } = useClubEvents(clubId);
  
  console.log('🔍 [ClubEventsManagement] clubId:', clubId);
  console.log('🔍 [ClubEventsManagement] firebaseEvents:', firebaseEvents.length, 'loading:', eventsLoading);
  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<EventItem | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    location: '',
    maxParticipants: '',
    maxSpectators: '',
    type: '' as EventItem['type'] | '',
  });

  // Utiliser les événements Firebase si disponibles
  useEffect(() => {
    if (!eventsLoading && firebaseEvents.length > 0) {
      const converted = firebaseEvents.map((e) => {
        // Convert Timestamp to Date properly
        let eventDate = null;
        if (e.startDate) {
          if (e.startDate.toDate) {
            eventDate = e.startDate.toDate();
          } else {
            eventDate = new Date(e.startDate);
          }
        }
        
        return {
          id: e.id,
          title: e.title,
          description: e.description,
          date: eventDate ? eventDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : 'À planifier',
          time: eventDate ? eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
          location: e.location || 'À préciser',
          participants: e.participants || 0,
          maxParticipants: e.dogSlots || 0,
          maxSpectators: e.spectatorSlots || 0,
          participantData: e.participants || [],
          type: normalizeEventType(e.type),
          status: 'upcoming' as const,
        };
      }) as EventItem[];
      setEvents(converted);
    } else if (!eventsLoading) {
      setEvents([]);
    }
  }, [firebaseEvents, eventsLoading]);

  const stats = useMemo(
    () => ({
      total: events.length,
      upcoming: events.filter((e) => e.status === 'upcoming').length,
      participants: events.reduce(
        (sum, e) =>
          sum +
          (Array.isArray(e.participantData)
            ? e.participantData.reduce((pSum, p) => pSum + (p.numDogs || 0), 0)
            : 0),
        0
      ),
    }),
    [events]
  );

  const badgeForType = (type: EventItem['type']) => {
    const map = {
      'Social': { bg: '#DBEAFE', text: '#1D4ED8', label: 'Social' },
      'Compétition': { bg: '#F3E8FF', text: '#7C3AED', label: 'Compétition' },
      'Formation': { bg: '#FFEDD5', text: '#EA580C', label: 'Formation' },
      'Portes ouvertes': { bg: '#DCFCE7', text: '#166534', label: 'Portes ouvertes' },
    } as const;
    const conf = map[type] || { bg: '#E5E7EB', text: '#6B7280', label: 'Inconnu' };
    return (
      <View style={[styles.badge, { backgroundColor: conf.bg }]}>
        <Text style={[styles.badgeText, { color: conf.text }]}>{conf.label}</Text>
      </View>
    );
  };

  const normalizeEventType = (type: any): EventItem['type'] => {
    // Map old lowercase types to new PascalCase types
    const typeMap: Record<string, EventItem['type']> = {
      'social': 'Social',
      'competition': 'Compétition',
      'training': 'Formation',
      'openday': 'Portes ouvertes',
      'formation': 'Formation',
      'portes ouvertes': 'Portes ouvertes',
      'Social': 'Social',
      'Compétition': 'Compétition',
      'Formation': 'Formation',
      'Portes ouvertes': 'Portes ouvertes',
    };
    const normalized = typeMap[type] || 'Social';
    console.log('📝 normalizeEventType:', type, '→', normalized);
    return normalized;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) setEventDate(date);
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (date) setEventDate(date);
    setShowTimePicker(false);
  };

  const eventTypes = [
    { label: 'Social', value: 'Social' as EventItem['type'] },
    { label: 'Compétition', value: 'Compétition' as EventItem['type'] },
    { label: 'Formation', value: 'Formation' as EventItem['type'] },
    { label: 'Portes ouvertes', value: 'Portes ouvertes' as EventItem['type'] },
  ];

  const handleCreate = async () => {
    // Validation des champs obligatoires
    if (!draft.title.trim() || !draft.location.trim() || !draft.type || !draft.maxParticipants || !clubId) {
      console.log('❌ Missing required fields');
      return;
    }
    
    try {
      // Use eventDate directly as Timestamp
      const startDate = Timestamp.fromDate(eventDate);
      
      // Create document for Firestore
      const eventData = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        location: draft.location.trim(),
        clubId: clubId,
        type: draft.type || 'Social',
        startDate: startDate,
        endDate: startDate,
        dogSlots: Number(draft.maxParticipants) || 0,
        spectatorSlots: Number(draft.maxSpectators) || 0,
        price: 0,
        currency: 'EUR',
        isActive: true,
        participants: 0,
        participants: [], // array of {userId, numDogs}
        createdAt: Timestamp.now(),
      };
      
      if (editingEventId) {
        // Update existing event
        const eventRef = doc(db, 'events', editingEventId);
        await updateDoc(eventRef, {
          ...eventData,
          updatedAt: Timestamp.now(),
        });
        console.log('✅ Event updated in Firestore:', editingEventId);
        
        // Update local state
        setEvents(events.map(e => 
          e.id === editingEventId 
            ? {
                ...e,
                title: draft.title.trim(),
                description: draft.description.trim(),
                location: draft.location.trim(),
                maxParticipants: Number(draft.maxParticipants) || 0,
                maxSpectators: Number(draft.maxSpectators) || 0,
                type: (draft.type || 'Social') as EventItem['type'],
                date: eventDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
                time: eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              }
            : e
        ));
      } else {
        // Create new event
        const docRef = await addDoc(collection(db, 'events'), eventData);
        console.log('✅ Event created in Firestore:', docRef.id);
        
        // Add to local state with Firestore ID
        const next: EventItem = {
          id: docRef.id,
          title: draft.title.trim(),
          description: draft.description.trim(),
          date: eventDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
          time: eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          location: draft.location.trim(),
          participants: 0,
          maxParticipants: Number(draft.maxParticipants) || 0,
          maxSpectators: Number(draft.maxSpectators) || 0,
          participantData: [],
          type: (draft.type || 'Social') as EventItem['type'],
          status: 'upcoming',
        };
        setEvents([next, ...events]);
      }
      
      // Reset form
      setDraft({
        title: '',
        description: '',
        location: '',
        maxParticipants: '',
        maxSpectators: '',
        type: '',
      });
      setEventDate(new Date());
      setEditingEventId(null);
      setShowModal(false);
    } catch (error) {
      console.error('❌ Error creating/updating event:', error);
    }
  };

  const handleEdit = (event: EventItem) => {
    // Parse the date from the display format
    const dateParts = event.date.split(' ');
    const timeParts = event.time.split(':');
    
    // Set draft with event data
    setDraft({
      title: event.title,
      description: event.description,
      location: event.location,
      maxParticipants: String(event.maxParticipants),
      maxSpectators: String(event.maxSpectators),
      type: event.type,
    });
    
    // Try to reconstruct the date from the components we have
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (timeParts.length === 2) {
      date.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0);
    }
    setEventDate(date);
    
    // Set edit mode
    setEditingEventId(event.id);
    setShowModal(true);
  };

  const handleDelete = (event: EventItem) => {
    Alert.alert(
      'Supprimer l\'événement',
      `Êtes-vous sûr de vouloir supprimer "${event.title}" ?`,
      [
        { text: 'Annuler', onPress: () => {}, style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const eventRef = doc(db, 'events', event.id);
              await deleteDoc(eventRef);
              console.log('✅ Event deleted from Firestore:', event.id);
              
              // Update local state
              setEvents(events.filter(e => e.id !== event.id));
            } catch (error) {
              console.error('❌ Error deleting event:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {eventsLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : (
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
                      <Ionicons name="paw" size={14} color={palette.gray} />
                      <Text style={styles.cardMeta}>
                        {event.participantData ? event.participantData.reduce((sum, p) => sum + (p.numDogs || 0), 0) : 0}/{event.maxParticipants} chiens
                      </Text>
                      {event.status === 'full' ? (
                        <View style={[styles.badge, { backgroundColor: '#F97316' }]}>
                          <Text style={[styles.badgeText, { color: '#fff' }]}>Complet</Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.metaRow}>
                      <Ionicons name="people-outline" size={14} color={palette.gray} />
                      <Text style={styles.cardMeta}>
                        {event.maxSpectators} spectateurs max
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionGhost]}
                  onPress={() => {
                    setSelectedEventForParticipants(event);
                    setShowParticipantsModal(true);
                  }}
                >
                  <MaterialCommunityIcons name="account-group-outline" size={16} color={palette.text} />
                  <Text style={[styles.actionText, { color: palette.text }]}>Participants</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionGhost]}
                  onPress={() => handleEdit(event)}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={16} color={palette.text} />
                  <Text style={[styles.actionText, { color: palette.text }]}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.circleBtn]}
                  onPress={() => handleDelete(event)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      )}

      <Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEventId ? 'Modifier l\'événement' : 'Nouvel événement'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowModal(false);
                setEditingEventId(null);
                setDraft({ title: '', description: '', location: '', maxParticipants: '', maxSpectators: '', type: '' });
              }}>
                <Ionicons name="close" size={22} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={styles.label}>
                  Titre de l'événement <Text style={styles.required}>*</Text>
                </Text>
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
                  <Text style={styles.label}>
                    Date <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.value}>
                      {eventDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color={palette.primary} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>
                    Heure <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={styles.value}>
                      {eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Ionicons name="time-outline" size={20} color={palette.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={styles.label}>
                  Lieu <Text style={styles.required}>*</Text>
                </Text>
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
                  {eventTypes.map((typeOption) => {
                    const active = draft.type === typeOption.value;
                    return (
                      <TouchableOpacity
                        key={typeOption.value}
                        style={[styles.typePill, active && styles.typePillActive]}
                        onPress={() => setDraft({ ...draft, type: typeOption.value })}
                      >
                        <Text style={[styles.typePillText, active && styles.typePillTextActive]}>{typeOption.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View>
                <Text style={styles.label}>
                  Places pour chiens <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  value={draft.maxParticipants}
                  onChangeText={(text) => setDraft({ ...draft, maxParticipants: text })}
                  placeholder="Ex: 20"
                  keyboardType="number-pad"
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>
                  Places pour spectateurs
                </Text>
                <TextInput
                  value={draft.maxSpectators}
                  onChangeText={(text) => setDraft({ ...draft, maxSpectators: text })}
                  placeholder="Ex: 50"
                  keyboardType="number-pad"
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <TouchableOpacity style={styles.publishBtn} onPress={handleCreate} activeOpacity={0.9}>
                <MaterialCommunityIcons name={editingEventId ? "pencil" : "calendar-plus"} size={18} color="#fff" />
                <Text style={styles.publishText}>
                  {editingEventId ? 'Mettre à jour' : 'Créer l\'événement'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={eventDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
      </Modal>

      {/* Participants Modal */}
      {selectedEventForParticipants && (
        <ParticipantsModal
          event={selectedEventForParticipants}
          visible={showParticipantsModal}
          onClose={() => {
            setShowParticipantsModal(false);
            setSelectedEventForParticipants(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

interface ParticipantsModalProps {
  event: EventItem;
  visible: boolean;
  onClose: () => void;
}

function ParticipantsModal({ event, visible, onClose }: ParticipantsModalProps) {
  const { users, loading } = useGetUserNames(event.participantData);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Participants - {event.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={palette.gray} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={palette.primary} />
          ) : users.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <MaterialCommunityIcons name="account-off-outline" size={48} color={palette.gray} />
              <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14 }}>
                Aucun participant pour le moment
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ gap: 8 }}>
              {users.map((user) => {
                const participantInfo = event.participantData?.find(p => p.userId === user.id);
                const numDogs = participantInfo?.numDogs || 0;
                
                return (
                  <View
                    key={user.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      backgroundColor: '#F9FAFB',
                      borderRadius: 10,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: palette.border,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: palette.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                        {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: palette.text, fontWeight: '600' }}>
                        {user.fullName || 'Sans nom'}
                      </Text>
                      <Text style={{ color: palette.gray, fontSize: 12 }}>
                        {user.email} • {numDogs} chien{numDogs > 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
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
  required: { color: '#EF4444', fontWeight: '700' },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: { color: palette.text, fontSize: 14 },
  placeholder: { color: palette.gray, fontSize: 14 },
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
