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
import { addDoc, collection, Timestamp, doc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '@/firebaseConfig';

import { ClubStackParamList } from '@/navigation/types';
import { useClubEvents } from '@/hooks/useClubEvents';
import { useGetUserNames } from '@/hooks/useGetUserNames';
import { useAuth } from '@/context/AuthContext';
import { createNotificationFromTemplate } from '@/utils/notificationHelpers';

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
  endTime?: string;
  location: string;
  address?: string;
  distance?: number;
  participants: number;
  maxParticipants: number;
  maxSpectators: number;
  participantData?: Array<{ userId: string; numDogs: number }>;
  type: 'Social' | 'Compétition' | 'Formation' | 'Portes ouvertes';
  status: 'upcoming' | 'full';
  category?: string;
  level?: string;
  ageMin?: string;
  priceParticipant?: number;
  priceSpectator?: number;
  currency?: string;
  program?: Array<{ time: string; activity: string }>;
  requirements?: string[];
  amenities?: string[];
  photos?: string[];
};

const seedEvents: EventItem[] = [
  {
    id: '1',
    title: 'Balade en forêt de Fontainebleau',
    description: 'Grande balade canine en forêt avec pique-nique. Ouvert à tous les niveaux.',
    date: 'Sam 28 Oct',
    time: '10:00',
    location: 'Parking de la forêt',
    participants: 12,
    maxParticipants: 20,
    maxSpectators: 50,
    type: 'Social',
    status: 'upcoming',
  },
  {
    id: '2',
    title: "Compétition d'agility inter-clubs",
    description: 'Participez à notre compétition amicale d\'agility. Inscription requise.',
    date: 'Dim 5 Nov',
    time: '14:00',
    location: "Terrain d'agility",
    participants: 8,
    maxParticipants: 15,
    maxSpectators: 30,
    type: 'Compétition',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Atelier comportement canin',
    description: 'Atelier sur la communication canine et la résolution de problèmes comportementaux.',
    date: 'Mer 8 Nov',
    time: '18:30',
    location: 'Salle de formation',
    participants: 15,
    maxParticipants: 15,
    maxSpectators: 25,
    type: 'Formation',
    status: 'full',
  },
  {
    id: '4',
    title: 'Journée portes ouvertes',
    description: 'Découvrez notre club en famille !',
    date: 'Sam 15 Nov',
    time: '09:00',
    location: 'Terrain du club',
    participants: 20,
    maxParticipants: 40,
    maxSpectators: 100,
    type: 'Portes ouvertes',
    status: 'upcoming',
  },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubEventsManagement'>;

export default function EventsScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const clubId = (route.params as any)?.clubId || (user as any)?.clubId || '';
  const { events: firestoreEvents, loading } = useClubEvents(clubId);
  
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>(seedEvents);
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    distance: '',
    maxParticipants: '',
    maxSpectators: '',
    type: '',
    category: '',
    level: '',
    ageMin: '',
    priceParticipant: '',
    priceSpectator: '',
    currency: 'EUR',
    program: [] as Array<{ time: string; activity: string }>,
    requirements: [] as string[],
    amenities: [] as string[],
    photos: [] as string[],
  });
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [programInput, setProgramInput] = useState({ time: '', activity: '' });
  const [showProgramTimePicker, setShowProgramTimePicker] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<EventItem | null>(null);

  const requirementOptions = ['Vaccination', 'Assurance', 'Diplôme', 'Passeport sanitaire', 'Licence'];

  const handleAddAmenity = () => {
    if (amenitiesInput.trim()) {
      setDraft({
        ...draft,
        amenities: [...draft.amenities, amenitiesInput.trim()],
      });
      setAmenitiesInput('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setDraft({
      ...draft,
      amenities: draft.amenities.filter((_, i) => i !== index),
    });
  };

  const handleToggleRequirement = (requirement: string) => {
    if (selectedRequirements.includes(requirement)) {
      setSelectedRequirements(selectedRequirements.filter(r => r !== requirement));
      setDraft({
        ...draft,
        requirements: draft.requirements.filter(r => r !== requirement),
      });
    } else {
      const newRequirements = [...selectedRequirements, requirement];
      setSelectedRequirements(newRequirements);
      setDraft({
        ...draft,
        requirements: newRequirements,
      });
    }
  };

  const handleAddProgram = () => {
    if (programInput.time && programInput.activity.trim()) {
      setDraft({
        ...draft,
        program: [...draft.program, { time: programInput.time, activity: programInput.activity.trim() }],
      });
      setProgramInput({ time: '', activity: '' });
      setShowProgramTimePicker(false);
    }
  };

  const handleRemoveProgram = (index: number) => {
    setDraft({
      ...draft,
      program: draft.program.filter((_, i) => i !== index),
    });
  };

  const handleProgramTimeChange = (event: any, date?: Date) => {
    if (date) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      setProgramInput({ ...programInput, time: `${hours}:${minutes}` });
    }
    setShowProgramTimePicker(false);
  };

  // Update local state when Firestore data changes
  useEffect(() => {
    if (firestoreEvents && firestoreEvents.length > 0) {
      // Map Firestore docs to EventItem format
      const mapped = firestoreEvents.map((doc: any) => {
        const status: 'upcoming' | 'full' = (doc.dogSlots && doc.participantData?.length >= doc.dogSlots) ? 'full' : 'upcoming';
        return {
          id: doc.id || '',
          title: doc.title || '',
          description: doc.description || '',
          date: doc.startDate ? new Date(doc.startDate.seconds * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : 'N/A',
          time: doc.startDate ? new Date(doc.startDate.seconds * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          location: doc.location || '',
          address: doc.address || '',
          distance: doc.distance || undefined,
          participants: doc.participantData?.length || 0,
          maxParticipants: doc.dogSlots || 0,
          maxSpectators: doc.spectatorSlots || 0,
          participantData: doc.participantData || [],
          type: normalizeEventType(doc.type) || 'Social',
          status: status,
          category: doc.category || '',
          level: doc.level || '',
          ageMin: doc.ageMin || '',
          priceParticipant: doc.priceParticipant || undefined,
          priceSpectator: doc.priceSpectator || undefined,
          currency: doc.currency || 'EUR',
          program: doc.program || [],
          requirements: doc.requirements || [],
          amenities: doc.amenities || [],
          photos: doc.photos || [],
        };
      });
      setEvents(mapped);
    }
  }, [firestoreEvents]);

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          event.title.toLowerCase().includes('') &&
          (clubId ? true : true)
      ),
    [events, clubId]
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
    return typeMap[type] || 'Social';
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
    if (!draft.title.trim() || !draft.location.trim() || !draft.type || !draft.maxParticipants || !clubId) {
      console.log('❌ Missing required fields');
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const startDate = Timestamp.fromDate(eventDate);
      
      // Helper to clean undefined values
      const cleanData = (obj: any) => {
        return Object.fromEntries(
          Object.entries(obj).filter(([_, v]) => v !== undefined && v !== '')
        );
      };
      
      const eventData = cleanData({
        title: draft.title.trim(),
        description: draft.description.trim() || undefined,
        location: draft.location.trim(),
        address: draft.address.trim() || undefined,
        distance: draft.distance ? Number(draft.distance) : undefined,
        clubId: clubId,
        type: draft.type || 'Social',
        category: draft.category || undefined,
        level: draft.level || undefined,
        ageMin: draft.ageMin || undefined,
        startDate: startDate,
        endDate: startDate,
        dogSlots: Number(draft.maxParticipants) || 0,
        spectatorSlots: Number(draft.maxSpectators) || 0,
        priceParticipant: draft.priceParticipant ? Number(draft.priceParticipant) : undefined,
        priceSpectator: draft.priceSpectator ? Number(draft.priceSpectator) : undefined,
        price: draft.priceParticipant ? Number(draft.priceParticipant) : undefined,
        currency: draft.currency || 'EUR',
        program: draft.program.length > 0 ? draft.program : undefined,
        requirements: draft.requirements.length > 0 ? draft.requirements : undefined,
        amenities: draft.amenities.length > 0 ? draft.amenities : undefined,
        photos: draft.photos.length > 0 ? draft.photos : undefined,
        isActive: true,
        participants: 0,
        participantData: [],
        createdAt: Timestamp.now(),
      });
      
      if (editingEventId) {
        const eventRef = doc(db, 'events', editingEventId);
        await updateDoc(eventRef, {
          ...eventData,
          updatedAt: Timestamp.now(),
        });
        console.log('✅ Event updated in Firestore:', editingEventId);
        
        setEvents(events.map(e => 
          e.id === editingEventId 
            ? {
                ...e,
                title: draft.title.trim(),
                description: draft.description.trim(),
                location: draft.location.trim(),
                address: draft.address.trim(),
                distance: draft.distance ? Number(draft.distance) : undefined,
                maxParticipants: Number(draft.maxParticipants) || 0,
                maxSpectators: Number(draft.maxSpectators) || 0,
                type: (draft.type || 'Social') as EventItem['type'],
                date: eventDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
                time: eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                category: draft.category,
                level: draft.level,
                ageMin: draft.ageMin,
                priceParticipant: draft.priceParticipant ? Number(draft.priceParticipant) : undefined,
                priceSpectator: draft.priceSpectator ? Number(draft.priceSpectator) : undefined,
                program: draft.program,
                requirements: draft.requirements,
                amenities: draft.amenities,
              }
            : e
        ));
      } else {
        const docRef = await addDoc(collection(db, 'events'), eventData);
        console.log('✅ Event created in Firestore:', docRef.id);
        
        // ✅ Créer notification event_created pour TOUS les membres du club
        try {
          // Récupérer tous les membres du club
          const clubRef = doc(db, 'club', clubId);
          const clubSnap = await getDocs(query(collection(db, 'users'), where('clubId', '==', clubId)));
          
          const memberIds = clubSnap.docs.map(m => m.id);
          
          // Créer une notif pour chaque membre
          for (const memberId of memberIds) {
            try {
              await createNotificationFromTemplate('event_created', {
                recipientId: memberId,
                recipientType: 'user',
                relatedId: docRef.id,
                senderId: user?.uid,
                senderName: (profile as any)?.displayName || 'Club',
                actionParams: { eventId: docRef.id },
                metadata: {
                  eventTitle: draft.title.trim(),
                  eventDate: eventDate.toLocaleDateString('fr-FR'),
                },
              });
            } catch (notifErr) {
              console.warn(`Erreur notif pour membre ${memberId}:`, notifErr);
            }
          }
        } catch (notifErr) {
          console.warn('Avertissement: notifications event_created non créées:', notifErr);
        }
        
        const next: EventItem = {
          id: docRef.id,
          title: draft.title.trim(),
          description: draft.description.trim(),
          date: eventDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
          time: eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          location: draft.location.trim(),
          address: draft.address.trim(),
          distance: draft.distance ? Number(draft.distance) : undefined,
          participants: 0,
          maxParticipants: Number(draft.maxParticipants) || 0,
          maxSpectators: Number(draft.maxSpectators) || 0,
          participantData: [],
          type: (draft.type || 'Social') as EventItem['type'],
          status: 'upcoming',
          category: draft.category,
          level: draft.level,
          ageMin: draft.ageMin,
          priceParticipant: draft.priceParticipant ? Number(draft.priceParticipant) : undefined,
          priceSpectator: draft.priceSpectator ? Number(draft.priceSpectator) : undefined,
          program: draft.program,
          requirements: draft.requirements,
          amenities: draft.amenities,
        };
        setEvents([next, ...events]);
      }
      
      setDraft({
        title: '',
        description: '',
        location: '',
        address: '',
        distance: '',
        maxParticipants: '',
        maxSpectators: '',
        type: '',
        category: '',
        level: '',
        ageMin: '',
        priceParticipant: '',
        priceSpectator: '',
        currency: 'EUR',
        program: [],
        requirements: [],
        amenities: [],
        photos: [],
      });
      setSelectedRequirements([]);
      setAmenitiesInput('');
      setProgramInput({ time: '', activity: '' });
      setEventDate(new Date());
      setEditingEventId(null);
      setShowModal(false);
    } catch (error) {
      console.error('❌ Error creating/updating event:', error);
      Alert.alert('Erreur', 'Impossible de créer/modifier l\'événement');
    }
  };

  const handleEdit = (event: EventItem) => {
    setDraft({
      title: event.title,
      description: event.description,
      location: event.location,
      address: event.address || '',
      distance: event.distance ? String(event.distance) : '',
      maxParticipants: String(event.maxParticipants),
      maxSpectators: String(event.maxSpectators),
      type: event.type,
      category: event.category || '',
      level: event.level || '',
      ageMin: event.ageMin || '',
      priceParticipant: event.priceParticipant ? String(event.priceParticipant) : '',
      priceSpectator: event.priceSpectator ? String(event.priceSpectator) : '',
      currency: event.currency || 'EUR',
      program: event.program || [],
      requirements: event.requirements || [],
      amenities: event.amenities || [],
      photos: event.photos || [],
    });
    setSelectedRequirements(event.requirements || []);
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
              await deleteDoc(doc(db, 'events', event.id));
              setEvents(events.filter(e => e.id !== event.id));
              console.log('✅ Event deleted from Firestore:', event.id);
            } catch (error) {
              console.error('❌ Error deleting event:', error);
              Alert.alert('Erreur', 'Impossible de supprimer l\'événement');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Événements</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setDraft({
              title: '', description: '', location: '', address: '', distance: '',
              maxParticipants: '', maxSpectators: '', type: '', category: '',
              level: '', ageMin: '', priceParticipant: '', priceSpectator: '',
              currency: 'EUR', program: [], requirements: [], amenities: [], photos: [],
            });
            setEventDate(new Date());
            setEditingEventId(null);
            setShowModal(true);
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : (
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 0 }}>
        <View style={styles.eventsList}>
          {filteredEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
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
                setSelectedRequirements([]);
                setAmenitiesInput('');
                setProgramInput({ time: '', activity: '' });
              }}>
                <Ionicons name="close" size={22} color={palette.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, gap: 12 }}>
              <View>
                <Text style={styles.sectionTitle}>Infos basiques</Text>
                <View style={{ marginTop: 8, gap: 10 }}>
                  <View>
                    <Text style={styles.label}>Titre <Text style={styles.required}>*</Text></Text>
                    <TextInput value={draft.title} onChangeText={(text) => setDraft({ ...draft, title: text })} placeholder="Stage agility..." style={styles.input} placeholderTextColor={palette.gray} />
                  </View>
                  <View>
                    <Text style={styles.label}>Description</Text>
                    <TextInput value={draft.description} onChangeText={(text) => setDraft({ ...draft, description: text })} placeholder="Décrivez..." style={[styles.input, { height: 80, textAlignVertical: 'top' }]} multiline placeholderTextColor={palette.gray} />
                  </View>
                  <View>
                    <Text style={styles.label}>Type</Text>
                    <View style={styles.typeRow}>
                      {eventTypes.map((t) => (
                        <TouchableOpacity key={t.value} style={[styles.typePill, draft.type === t.value && styles.typePillActive]} onPress={() => setDraft({ ...draft, type: t.value })}>
                          <Text style={[styles.typePillText, draft.type === t.value && styles.typePillTextActive]}>{t.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.sectionTitle}>Date & Localisation</Text>
                <View style={{ marginTop: 8, gap: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Date <Text style={styles.required}>*</Text></Text>
                      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.value}>{eventDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                        <Ionicons name="calendar-outline" size={20} color={palette.primary} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Heure <Text style={styles.required}>*</Text></Text>
                      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                        <Text style={styles.value}>{eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
                        <Ionicons name="time-outline" size={20} color={palette.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.label}>Lieu <Text style={styles.required}>*</Text></Text>
                    <TextInput value={draft.location} onChangeText={(text) => setDraft({ ...draft, location: text })} placeholder="Parc..." style={styles.input} placeholderTextColor={palette.gray} />
                  </View>
                  <View>
                    <Text style={styles.label}>Adresse</Text>
                    <TextInput value={draft.address} onChangeText={(text) => setDraft({ ...draft, address: text })} placeholder="123 Rue..." style={styles.input} placeholderTextColor={palette.gray} />
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.sectionTitle}>Places</Text>
                <View style={{ marginTop: 8, gap: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Places chiens <Text style={styles.required}>*</Text></Text>
                      <TextInput value={draft.maxParticipants} onChangeText={(text) => setDraft({ ...draft, maxParticipants: text })} placeholder="20" keyboardType="number-pad" style={styles.input} placeholderTextColor={palette.gray} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Spectateurs</Text>
                      <TextInput value={draft.maxSpectators} onChangeText={(text) => setDraft({ ...draft, maxSpectators: text })} placeholder="50" keyboardType="number-pad" style={styles.input} placeholderTextColor={palette.gray} />
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.sectionTitle}>Détails</Text>
                <View style={{ marginTop: 8, gap: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Niveau</Text>
                      <TextInput value={draft.level} onChangeText={(text) => setDraft({ ...draft, level: text })} placeholder="Tous" style={styles.input} placeholderTextColor={palette.gray} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Âge min</Text>
                      <TextInput value={draft.ageMin} onChangeText={(text) => setDraft({ ...draft, ageMin: text })} placeholder="18 mois" style={styles.input} placeholderTextColor={palette.gray} />
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.sectionTitle}>Tarifs</Text>
                <View style={{ marginTop: 8, gap: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Participant (€)</Text>
                      <TextInput value={draft.priceParticipant} onChangeText={(text) => setDraft({ ...draft, priceParticipant: text })} placeholder="35" keyboardType="decimal-pad" style={styles.input} placeholderTextColor={palette.gray} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Spectateur (€)</Text>
                      <TextInput value={draft.priceSpectator} onChangeText={(text) => setDraft({ ...draft, priceSpectator: text })} placeholder="10" keyboardType="decimal-pad" style={styles.input} placeholderTextColor={palette.gray} />
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.sectionTitle}>Prérequis</Text>
                <View style={{ marginTop: 8, gap: 12 }}>
                  {requirementOptions.map((req) => (
                    <TouchableOpacity
                      key={req}
                      style={styles.checkboxRow}
                      onPress={() => handleToggleRequirement(req)}
                    >
                      <View style={[styles.checkbox, selectedRequirements.includes(req) && styles.checkboxChecked]}>
                        {selectedRequirements.includes(req) && (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>{req}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={styles.sectionTitle}>Services inclus</Text>
                <View style={{ marginTop: 8, gap: 10 }}>
                  {draft.amenities.map((amenity, index) => (
                    <View key={index} style={styles.amenityItem}>
                      <Text style={styles.amenityText}>{amenity}</Text>
                      <TouchableOpacity onPress={() => handleRemoveAmenity(index)} style={styles.removeBtn}>
                        <Ionicons name="close" size={20} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                      value={amenitiesInput}
                      onChangeText={setAmenitiesInput}
                      placeholder="Ex: Parking"
                      style={[styles.input, { flex: 1 }]}
                      placeholderTextColor={palette.gray}
                    />
                    <TouchableOpacity style={styles.addAmenityBtn} onPress={handleAddAmenity}>
                      <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.sectionTitle}>Programme</Text>
                <View style={{ marginTop: 8, gap: 10 }}>
                  {draft.program.map((prog, index) => (
                    <View key={index} style={styles.programItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.programTime}>{prog.time}</Text>
                        <Text style={styles.programActivity}>{prog.activity}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleRemoveProgram(index)} style={styles.removeBtn}>
                        <Ionicons name="close" size={20} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={{ gap: 10 }}>
                    <TouchableOpacity style={styles.input} onPress={() => setShowProgramTimePicker(true)}>
                      <Text style={styles.value}>
                        {programInput.time ? programInput.time : 'Choisir heure'}
                      </Text>
                      <Ionicons name="time-outline" size={20} color={palette.primary} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        value={programInput.activity}
                        onChangeText={(text) => setProgramInput({ ...programInput, activity: text })}
                        placeholder="Activité"
                        style={[styles.input, { flex: 1 }]}
                        placeholderTextColor={palette.gray}
                      />
                      <TouchableOpacity style={styles.addProgramBtn} onPress={handleAddProgram}>
                        <Ionicons name="add" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.publishBtn} onPress={handleCreate} activeOpacity={0.9}>
                <MaterialCommunityIcons name={editingEventId ? "pencil" : "calendar-plus"} size={18} color="#fff" />
                <Text style={styles.publishText}>{editingEventId ? 'Mettre à jour' : "Créer l'événement"}</Text>
              </TouchableOpacity>
              
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>

          {showDatePicker && (
            <DateTimePicker value={eventDate} mode="date" display="default" onChange={handleDateChange} />
          )}

          {showTimePicker && (
            <DateTimePicker value={eventDate} mode="time" display="default" onChange={handleTimeChange} />
          )}

          {showProgramTimePicker && (
            <DateTimePicker value={new Date()} mode="time" display="default" onChange={handleProgramTimeChange} />
          )}
        </View>
      </Modal>

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
  const participantData = event.participantData || [];

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

          {participantData.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <MaterialCommunityIcons name="account-off-outline" size={48} color={palette.gray} />
              <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14 }}>
                Aucun participant pour le moment
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
              {participantData.map((participant: any, index: number) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    backgroundColor: '#F9FAFB',
                    borderRadius: 10,
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
                      flexShrink: 0,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                      {participant.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: palette.text, fontWeight: '600', marginBottom: 4 }}>
                      {participant.name || 'Sans nom'}
                    </Text>
                    <Text style={{ color: palette.gray, fontSize: 12, marginBottom: 2 }}>
                      Email: {participant.email}
                    </Text>
                    <Text style={{ color: palette.gray, fontSize: 12, marginBottom: 2 }}>
                      Téléphone: {participant.phone}
                    </Text>
                    <Text style={{ color: palette.gray, fontSize: 12 }}>
                      Chien: {participant.dog}
                    </Text>
                  </View>
                </View>
              ))}
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
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', flex: 1 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsList: { gap: 12, paddingHorizontal: 16, paddingVertical: 16 },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  dateBox: {
    width: 56,
    height: 56,
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  dateText: { color: '#fff', fontSize: 12, fontWeight: '600', lineHeight: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  cardTitle: { color: palette.text, fontSize: 16, fontWeight: '600', flex: 1 },
  cardContent: { color: palette.gray, fontSize: 13, marginBottom: 8, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardMeta: { color: palette.gray, fontSize: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionGhost: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: palette.border },
  actionText: { fontSize: 13, fontWeight: '600' },
  circleBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: palette.border },
  modalTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16, marginBottom: 6 },
  label: { color: palette.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  required: { color: '#DC2626' },
  input: { borderWidth: 1, borderColor: palette.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: palette.text, fontSize: 14, backgroundColor: '#F9FAFB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  value: { color: palette.text, fontSize: 14 },
  typeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typePill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 2, borderColor: palette.border, backgroundColor: '#F9FAFB' },
  typePillActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  typePillText: { color: palette.text, fontSize: 13, fontWeight: '600' },
  typePillTextActive: { color: '#fff' },
  publishBtn: { backgroundColor: palette.primary, borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  publishText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10, paddingVertical: 8 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: palette.border, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: palette.primary, borderColor: palette.primary },
  checkboxLabel: { color: palette.text, fontSize: 14, fontWeight: '500' },
  amenityItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F3F4F6', borderRadius: 10, borderWidth: 1, borderColor: palette.border },
  amenityText: { color: palette.text, fontSize: 14, fontWeight: '500', flex: 1 },
  programItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F3F4F6', borderRadius: 10, borderWidth: 1, borderColor: palette.border },
  programTime: { color: palette.primary, fontSize: 14, fontWeight: '700' },
  programActivity: { color: palette.text, fontSize: 13, marginTop: 4 },
  removeBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  addAmenityBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  addProgramBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
});
