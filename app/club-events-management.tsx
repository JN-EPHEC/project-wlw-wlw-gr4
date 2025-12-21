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
import { useAuth } from '@/context/AuthContext';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
    error: '#DC2626',
};

type EventItem = any;
type Props = NativeStackScreenProps<ClubStackParamList, 'clubEventsManagement'>;

export default function EventsScreen({ route }: Props) {
  const { user } = useAuth();
  const clubId = (route.params as any)?.clubId || (user as any)?.clubId || '';
  const { events, loading } = useClubEvents(clubId);
  
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<any>({});
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleOpenModal = (event: EventItem | null = null) => {
      if(event) {
          setDraft({
              ...event,
              startDate: event.startDate?.toDate ? event.startDate.toDate() : new Date(event.startDate)
          });
          setIsEditing(event.id);
      } else {
          setDraft({ title: '', description: '', location: '', type: 'Social', dogSlots: 10, spectatorSlots: 20, priceParticipant: 25, startDate: new Date() });
          setIsEditing(null);
      }
      setShowModal(true);
  };
  
  const handleSave = async () => {
    if (!draft.title) return Alert.alert("Erreur", "Le titre est requis.");

    const eventData = {
        ...draft,
        clubId,
        startDate: Timestamp.fromDate(draft.startDate),
        dogSlots: Number(draft.dogSlots),
        spectatorSlots: Number(draft.spectatorSlots),
        priceParticipant: Number(draft.priceParticipant),
    };

    try {
        if(isEditing) {
            await updateDoc(doc(db, 'events', isEditing), eventData);
        } else {
            await addDoc(collection(db, 'events'), { ...eventData, createdAt: Timestamp.now() });
        }
        setShowModal(false);
    } catch(e) {
        Alert.alert("Erreur", "Impossible de sauvegarder l'événement.");
    }
  };

  const handleDelete = async (eventId: string) => {
      Alert.alert("Confirmer", "Supprimer cet événement ?", [
          { text: "Annuler", style: "cancel"},
          { text: "Supprimer", style: "destructive", onPress: async () => {
              try {
                await deleteDoc(doc(db, "events", eventId));
              } catch(e) {
                  Alert.alert("Erreur", "Impossible de supprimer.");
              }
          }}
      ])
  }

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Gestion Événements</Text>
        </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => handleOpenModal()}>
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.primaryButtonText}>Créer un événement</Text>
        </TouchableOpacity>

        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-month-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Aucun événement programmé</Text>
          </View>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.card}>
                <EventCardHeader event={event} onEdit={() => handleOpenModal(event)} onDelete={() => handleDelete(event.id)} />
                <Text style={styles.cardContent}>{event.description}</Text>
                <View style={styles.metaGrid}>
                    <MetaItem icon="calendar-outline" text={event.startDate?.toDate().toLocaleDateString('fr-FR')} />
                    <MetaItem icon="time-outline" text={event.startDate?.toDate().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})} />
                    <MetaItem icon="logo-euro" text={`${event.priceParticipant || 0}`} />
                    <MetaItem icon="paw-outline" text={`${event.participantData?.length || 0}/${event.dogSlots}`} />
                </View>
            </View>
          ))
        )}
      </ScrollView>

      <EventModal visible={showModal} onClose={() => setShowModal(false)} onSave={handleSave} event={draft} setEvent={setDraft} />
    </SafeAreaView>
  );
}

const EventCardHeader = ({ event, onEdit, onDelete }: any) => (
    <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{event.title}</Text>
        <View style={{flexDirection: 'row', gap: 8}}>
            <TouchableOpacity style={styles.iconButton} onPress={onEdit}><Ionicons name="pencil-outline" size={18} color={colors.text} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onDelete}><Ionicons name="trash-outline" size={18} color={colors.error} /></TouchableOpacity>
        </View>
    </View>
);

const MetaItem = ({ icon, text }: any) => (
    <View style={styles.metaItem}>
        <Ionicons name={icon} size={16} color={colors.primary} />
        <Text style={styles.metaText}>{text}</Text>
    </View>
);

const EventModal = ({ visible, onClose, onSave, event, setEvent }: any) => {
    const [showPicker, setShowPicker] = useState<null | 'date' | 'time'>(null);

    const handleDateChange = (e: any, selectedDate?: Date) => {
        setShowPicker(null);
        if(selectedDate) {
            const currentDate = event.startDate || new Date();
            const newDate = new Date(currentDate);
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            setEvent({...event, startDate: newDate });
        }
    };

    const handleTimeChange = (e: any, selectedTime?: Date) => {
        setShowPicker(null);
        if(selectedTime){
            const currentDate = event.startDate || new Date();
            const newTime = new Date(currentDate);
            newTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
            setEvent({...event, startDate: newTime });
        }
    };
    
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{event?.id ? "Modifier" : "Créer"} un événement</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TextInput placeholder="Titre" value={event?.title} onChangeText={t => setEvent({...event, title: t})} style={styles.input} />
                        <TextInput placeholder="Description" value={event?.description} onChangeText={t => setEvent({...event, description: t})} style={[styles.input, {height: 80}]} multiline />
                        <TextInput placeholder="Lieu" value={event?.location} onChangeText={t => setEvent({...event, location: t})} style={styles.input} />
                        <TouchableOpacity style={styles.input} onPress={() => setShowPicker('date')}><Text>{(event?.startDate || new Date()).toLocaleDateString('fr-FR')}</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.input} onPress={() => setShowPicker('time')}><Text>{(event?.startDate || new Date()).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</Text></TouchableOpacity>
                        <TextInput placeholder="Places chiens" value={String(event?.dogSlots || '')} onChangeText={t => setEvent({...event, dogSlots: t})} style={styles.input} keyboardType="number-pad" />
                        <TextInput placeholder="Places spectateurs" value={String(event?.spectatorSlots || '')} onChangeText={t => setEvent({...event, spectatorSlots: t})} style={styles.input} keyboardType="number-pad" />
                        <TextInput placeholder="Prix participant" value={String(event?.priceParticipant || '')} onChangeText={t => setEvent({...event, priceParticipant: t})} style={styles.input} keyboardType="decimal-pad" />
                    </ScrollView>
                    <TouchableOpacity style={styles.primaryButton} onPress={onSave}><Text style={styles.primaryButtonText}>Enregistrer</Text></TouchableOpacity>
                    {showPicker === 'date' && <DateTimePicker value={event?.startDate || new Date()} mode="date" display="default" onChange={handleDateChange} />}
                    {showPicker === 'time' && <DateTimePicker value={event?.startDate || new Date()} mode="time" display="default" onChange={handleTimeChange} />}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 2, shadowColor: colors.shadow },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, flex: 1 },
  iconButton: { padding: 6, borderRadius: 12, backgroundColor: colors.background },
  cardContent: { fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: 12 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, borderTopWidth: 1, borderTopColor: colors.background, paddingTop: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '46%' },
  metaText: { fontSize: 14, fontWeight: '500', color: colors.text },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  emptySubtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
  // Modal
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: colors.surface, borderRadius: 22, padding: 24, width: '90%', maxHeight: '80%', elevation: 5, gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 8 },
  input: { backgroundColor: colors.background, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 10 },
});
