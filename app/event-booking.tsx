import React, { useMemo, useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';

import { UserStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'eventBooking'>;

export default function EventBookingScreen({ navigation, route }: Props) {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', dog: '' });

  // Récupérer l'événement de Firebase
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          // Formater les données pour l'affichage
          const startDate = eventData.startDate instanceof Timestamp ? 
            eventData.startDate.toDate() : 
            new Date(eventData.startDate);
          const dateStr = startDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
          });
          const timeStr = startDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          });
          setEvent({
            id: eventSnap.id,
            ...eventData,
            dateFormatted: dateStr,
            timeFormatted: timeStr,
          });
        }
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const canBook = form.name && form.email && form.phone && form.dog;

  const handleBooking = async () => {
    if (!canBook) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Erreur', 'Vous devez être connecté pour vous inscrire');
      return;
    }

    setSubmitting(true);
    try {
      // Save booking to Firestore
      const eventRef = doc(db, 'events', eventId);
      
      // Get current event data to check if user is already registered
      const eventSnap = await getDoc(eventRef);
      const currentData = eventSnap.data();
      const currentParticipants = Array.isArray(currentData?.participantData) ? currentData.participantData : [];
      
      // Check if user is already registered
      const alreadyRegistered = currentParticipants.some(p => p.userId === user.uid);
      if (alreadyRegistered) {
        Alert.alert('Erreur', 'Vous êtes déjà inscrit à cet événement');
        setSubmitting(false);
        return;
      }

      // Check if event is full
      if (currentParticipants.length >= (currentData?.dogSlots || 0)) {
        Alert.alert('Erreur', 'Cet événement est complet');
        setSubmitting(false);
        return;
      }
      
      // Prepare participant data object with userId
      const newParticipant = {
        userId: user.uid,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dog: form.dog.trim(),
        bookingDate: Timestamp.now(),
      };
      
      // Update event with new participant
      await updateDoc(eventRef, {
        participantData: [...currentParticipants, newParticipant],
      });

      console.log('✅ Booking confirmed:', newParticipant);
      console.log('✅ Total participants now:', currentParticipants.length + 1);
      
      // Show success message
      Alert.alert(
        '✅ Confirmation',
        `Votre inscription pour "${event.title}" a été confirmée ! Nous vous contacterons sur ${form.phone} pour les détails.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Go back to event detail - it will refresh the data
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error booking:', error);
      Alert.alert('Erreur', 'Impossible de confirmer votre inscription. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: palette.text }}>Événement non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color={palette.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Réserver</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.hero}>
          <Image 
            source={{ uri: event.image || 'https://via.placeholder.com/400x200?text=Event' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{event.dateFormatted}</Text>
            <Text style={styles.heroBadgeText}>{event.timeFormatted}</Text>
          </View>
        </View>

        <Text style={styles.title}>{event.title}</Text>
        {event.description && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Ionicons name="information-circle-outline" size={16} color={palette.gray} />
              <Text style={styles.sub}>{event.description}</Text>
            </View>
          </>
        )}
        <Text style={styles.price}>{event.price}€</Text>

        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.cardTitle}>Informations</Text>
          <Input label="Votre nom" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Nom complet" />
          <Input label="Email" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} placeholder="votre@email.com" keyboardType="email-address" />
          <Input label="Téléphone" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} placeholder="+33 6 12 34 56 78" keyboardType="phone-pad" />
          <Input label="Nom du chien" value={form.dog} onChangeText={(t) => setForm({ ...form, dog: t })} placeholder="Nala" />
        </View>

        <TouchableOpacity
          style={[styles.primary, (!canBook || submitting) && { opacity: 0.5 }]}
          onPress={handleBooking}
          disabled={!canBook || submitting}
        >
          <Text style={styles.primaryText}>{submitting ? 'En cours...' : 'Confirmer ma place'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { padding: 8, borderRadius: 12, backgroundColor: '#E0F2F1' },
  headerTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  hero: { borderRadius: 16, overflow: 'hidden', position: 'relative' },
  heroImage: { width: '100%', height: 200 },
  heroBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 6,
  },
  heroBadgeText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  title: { color: palette.text, fontSize: 20, fontWeight: '700', marginTop: 6 },
  sub: { color: palette.gray, fontSize: 13 },
  price: { color: palette.primary, fontWeight: '700', marginTop: 4 },
  description: { color: palette.gray, fontSize: 14, lineHeight: 20, marginTop: 6 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
  },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  label: { color: '#6B7280', fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: palette.text,
    backgroundColor: '#F9FAFB',
  },
  primary: {
    marginTop: 8,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
