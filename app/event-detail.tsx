import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const eventMock = {
  id: 1,
  name: 'Compétition Régionale Agility',
  date: '15 Novembre 2024',
  time: '09:00 - 17:00',
  location: 'Paris Dog Park',
  address: '123 Rue du Parc, 75015 Paris',
  distance: '2.0 km',
  headerImage: 'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=1200&q=80',
  organizer: {
    name: 'Agility Pro',
    verified: true,
    rating: 4.9,
    logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
  },
  description:
    "Grande compétition régionale d'agility ouverte à tous les niveaux. Venez participer ou assister à cette journée où les meilleurs binômes s'affrontent.",
  participants: { registered: 45, max: 80 },
  price: { participant: 35, spectator: 10 },
  category: 'Compétition',
  level: 'Tous niveaux',
  ageMin: 'Chiens de 18 mois minimum',
  program: [
    { time: '09:00', activity: 'Accueil et inscription' },
    { time: '09:30', activity: 'Échauffement & reconnaissance' },
    { time: '10:30', activity: 'Début des épreuves' },
    { time: '12:30', activity: 'Pause déjeuner' },
    { time: '14:00', activity: 'Épreuves intermédiaire/expert' },
    { time: '16:45', activity: 'Remise des prix' },
  ],
  requirements: [
    'Certificat de vaccination à jour',
    'Assurance responsabilité civile',
    'Chien sociable',
  ],
  amenities: ['Parking gratuit', 'Restauration', 'Échauffement', 'Vétérinaire', 'Trophées'],
  photos: [
    'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80',
  ],
};

type Props = NativeStackScreenProps<UserStackParamList, 'eventDetail'>;

export default function EventDetailScreen({ navigation, route }: Props) {
  const { eventId, clubId } = route.params;
  const event = { ...eventMock, id: eventId, clubId }; // map id if needed
  const spotsRemaining = event.participants.max - event.participants.registered;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: event.headerImage }} style={styles.heroImage} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
          <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('clubs')}>
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{event.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="calendar-outline" size={14} color="#fff" />
              <Text style={styles.heroMeta}>{event.date}</Text>
              <Ionicons name="time-outline" size={14} color="#fff" />
              <Text style={styles.heroMeta}>{event.time}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="location-outline" size={14} color="#fff" />
              <Text style={styles.heroMeta}>{event.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Organisateur</Text>
          <View style={styles.organizer}>
            <Image source={{ uri: event.organizer.logo }} style={styles.organizerLogo} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.listTitle}>{event.organizer.name}</Text>
                {event.organizer.verified ? (
                  <MaterialCommunityIcons name="check-decagram" size={16} color={palette.primary} />
                ) : null}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                <Text style={styles.sub}>{event.organizer.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.linkBtn}>
              <Text style={styles.linkBtnText}>Suivre</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.sub}>{event.description}</Text>
        </View>

        <View style={styles.sectionRow}>
          <Ionicons name="pin-outline" size={18} color={palette.primary} />
          <Text style={styles.sub}>{event.address}</Text>
        </View>
        <View style={styles.sectionRow}>
          <MaterialCommunityIcons name="map-marker-distance" size={18} color={palette.primary} />
          <Text style={styles.sub}>{event.distance}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Infos pratiques</Text>
          <View style={styles.badgesRow}>
            <Badge label="Catégorie" value={event.category} />
            <Badge label="Niveau" value={event.level} />
            <Badge label="Âge min." value={event.ageMin} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Tarifs</Text>
          <View style={styles.card}>
            <View style={styles.priceRow}>
              <Text style={styles.sub}>Participant</Text>
              <Text style={styles.price}>{event.price.participant} €</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.sub}>Spectateur</Text>
              <Text style={styles.price}>{event.price.spectator} €</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Programme</Text>
          {event.program.map((p, idx) => (
            <View key={idx} style={styles.listRow}>
              <Text style={styles.listTime}>{p.time}</Text>
              <Text style={styles.sub}>{p.activity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Conditions</Text>
          {event.requirements.map((r, idx) => (
            <View key={idx} style={styles.bullet}>
              <Ionicons name="checkmark-circle" size={16} color={palette.primary} />
              <Text style={styles.sub}>{r}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Services</Text>
          <View style={styles.chips}>
            {event.amenities.map((a) => (
              <View key={a} style={styles.chip}>
                <Text style={styles.chipText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Galerie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {event.photos.map((p, idx) => (
              <Image key={idx} source={{ uri: p }} style={styles.photo} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sub}>Places restantes</Text>
            <Text style={styles.spots}>{spotsRemaining} / {event.participants.max}</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('eventBooking', { eventId })}>
            <Text style={styles.primaryBtnText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  hero: { height: 220, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  back: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  heroContent: { position: 'absolute', left: 16, right: 16, bottom: 12, gap: 6 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  heroMeta: { color: '#E5E7EB', fontSize: 13 },
  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 6 },
  title: { color: palette.text, fontSize: 18, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 14 },
  organizer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  organizerLogo: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#E5E7EB' },
  listTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  linkBtn: {
    borderWidth: 1,
    borderColor: palette.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  linkBtnText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeLabel: { color: palette.gray, fontSize: 11, fontWeight: '600' },
  badgeValue: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  price: { color: palette.primary, fontWeight: '700', fontSize: 15 },
  divider: { height: 1, backgroundColor: palette.border },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  listTime: { color: palette.text, fontWeight: '700', width: 60 },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  photo: { width: 180, height: 120, borderRadius: 12, backgroundColor: '#E5E7EB' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  spots: { color: palette.text, fontWeight: '700', fontSize: 16 },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
