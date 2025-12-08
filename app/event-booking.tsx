import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const events = [
  {
    id: '1',
    title: 'Stage Agility intensif',
    date: '10 avr.',
    time: '14:00',
    location: 'Bois de Vincennes',
    price: '29 €',
    image: 'https://images.unsplash.com/photo-1557971779-95a20f2d0e4a?auto=format&fit=crop&w=800&q=80',
    description: 'Atelier intensif pour progresser en agility avec des éducateurs expérimentés.',
  },
  {
    id: '2',
    title: 'Initiation obéissance chiots',
    date: '12 avr.',
    time: '10:00',
    location: 'Parc Montsouris',
    price: '19 €',
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?auto=format&fit=crop&w=800&q=80',
    description: 'Premiers pas en obéissance pour chiots, sociabilisation et bases du rappel.',
  },
];

type Props = NativeStackScreenProps<UserStackParamList, 'eventBooking'>;

export default function EventBookingScreen({ navigation, route }: Props) {
  const { eventId } = route.params;
  const event = useMemo(
    () => events.find((e) => e.id === String(eventId)) || events[0],
    [eventId],
  );

  const [form, setForm] = useState({ name: '', email: '', dog: '' });
  const canBook = form.name && form.email && form.dog;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('eventDetail', { eventId })} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color={palette.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Réserver</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.hero}>
          <Image source={{ uri: event.image }} style={styles.heroImage} />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{event.date}</Text>
            <Text style={styles.heroBadgeText}>{event.time}</Text>
          </View>
        </View>

        <Text style={styles.title}>{event.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Ionicons name="location-outline" size={16} color={palette.gray} />
          <Text style={styles.sub}>{event.location}</Text>
        </View>
        <Text style={styles.price}>{event.price}</Text>
        <Text style={styles.description}>{event.description}</Text>

        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.cardTitle}>Informations</Text>
          <Input label="Votre nom" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Nom complet" />
          <Input label="Email" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} placeholder="votre@email.com" keyboardType="email-address" />
          <Input label="Nom du chien" value={form.dog} onChangeText={(t) => setForm({ ...form, dog: t })} placeholder="Nala" />
        </View>

        <TouchableOpacity
          style={[styles.primary, !canBook && { opacity: 0.5 }]}
          onPress={() => navigation.navigate('eventDetail', { eventId })}
          disabled={!canBook}
        >
          <Text style={styles.primaryText}>Confirmer ma place</Text>
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
  keyboardType?: 'default' | 'email-address';
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
