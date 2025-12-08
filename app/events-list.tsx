import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
};

const events = [
  {
    id: 1,
    title: 'Stage Agility intensif',
    date: '10 avr.',
    time: '14:00',
    location: 'Bois de Vincennes',
    price: '29 €',
    image: 'https://images.unsplash.com/photo-1557971779-95a20f2d0e4a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Initiation obéissance chiots',
    date: '12 avr.',
    time: '10:00',
    location: 'Parc Montsouris',
    price: '19 €',
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Balade collective en ville',
    date: '15 avr.',
    time: '18:30',
    location: 'Place de la Republique',
    price: 'Gratuit',
    image: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=800&q=80',
  },
];

type Props = NativeStackScreenProps<UserStackParamList, 'events'>;

export default function EventsListScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('clubCommunity', { clubId })} style={styles.back}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Événements</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('eventDetail', { eventId: event.id, clubId })}
          >
            <Image source={{ uri: event.image }} style={styles.image} />
            <View style={styles.info}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.badge}>{event.date}</Text>
                <Text style={styles.badge}>{event.time}</Text>
              </View>
              <Text style={styles.title}>{event.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="location-outline" size={14} color={palette.gray} />
                <Text style={styles.sub}>{event.location}</Text>
              </View>
              <Text style={styles.price}>{event.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { padding: 16, gap: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: { width: '100%', height: 160 },
  info: { padding: 12, gap: 6 },
  badge: {
    backgroundColor: '#E0F2F1',
    color: palette.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: '700',
    fontSize: 12,
  },
  title: { color: palette.text, fontSize: 16, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 13 },
  price: { color: palette.primary, fontWeight: '700', marginTop: 4 },
});
