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

const mockClub = {
  id: 1,
  name: 'Canin Club Paris',
  rating: 4.8,
  reviews: 127,
  distance: '1.2 km',
  verified: true,
  headerImage: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?auto=format&fit=crop&w=1200&q=80',
  description:
    "Centre d'éducation canine moderne spécialisé dans le dressage positif et l'obéissance. Notre équipe accompagne votre chien avec bienveillance.",
  address: '42 Avenue des Champs-Elysées, 75008 Paris',
  phone: '+33 1 23 45 67 89',
  email: 'contact@caninclubparis.fr',
  website: 'www.caninclubparis.fr',
  certifications: ['CCAD', 'Certificat de capacité', 'Formation PSC1'],
  trainers: [
    { id: 1, name: 'Sophie Martin', specialty: 'Dressage & Obéissance', experience: '12 ans' },
    { id: 2, name: 'Lucas Dubois', specialty: 'Agility & Sport', experience: '8 ans' },
    { id: 3, name: 'Emma Bernard', specialty: 'Comportement', experience: '10 ans' },
  ],
  schedule: [
    { day: 'Lundi - Vendredi', hours: '9h00 - 19h00' },
    { day: 'Samedi', hours: '9h00 - 17h00' },
    { day: 'Dimanche', hours: 'Fermé' },
  ],
  photos: [
    'https://images.unsplash.com/photo-1592486058499-f262efe8292a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1629130646965-e86223170abc?auto=format&fit=crop&w=600&q=80',
  ],
};

type Props = NativeStackScreenProps<UserStackParamList, 'clubDetail'>;

export default function ClubDetailScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const club = { ...mockClub, id: clubId }; // would map id to data

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: club.headerImage }} style={styles.heroImage} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
          <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('clubs')}>
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.heroTitle}>{club.name}</Text>
              {club.verified ? <MaterialCommunityIcons name="check-decagram" size={18} color="#fff" /> : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                <Text style={styles.ratingText}>{club.rating}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('reviews', { clubId })}>
                <Text style={[styles.heroMeta, styles.linkText]}>{club.reviews} avis</Text>
              </TouchableOpacity>
              <Text style={styles.heroMeta}>{club.distance}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.sub}>{club.description}</Text>
        </View>

        <View style={styles.sectionRow}>
          <Ionicons name="location-outline" size={18} color={palette.primary} />
          <Text style={styles.sub}>{club.address}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Ionicons name="call-outline" size={18} color={palette.primary} />
          <Text style={styles.sub}>{club.phone}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Ionicons name="mail-outline" size={18} color={palette.primary} />
          <Text style={styles.sub}>{club.email}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Ionicons name="globe-outline" size={18} color={palette.primary} />
          <Text style={styles.sub}>{club.website}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Certifications</Text>
          <View style={styles.chips}>
            {club.certifications.map((c) => (
              <View key={c} style={styles.chip}>
                <Text style={styles.chipText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Équipe</Text>
          {club.trainers.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.listItem}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('teacherDetail', { teacherId: t.id, clubId })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{t.name.slice(0, 1)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{t.name}</Text>
                <Text style={styles.sub}>{t.specialty} · {t.experience}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.gray} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Horaires</Text>
          {club.schedule.map((s) => (
            <View key={s.day} style={styles.scheduleRow}>
              <Text style={styles.sub}>{s.day}</Text>
              <Text style={styles.scheduleTime}>{s.hours}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Galerie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {club.photos.map((p, idx) => (
              <Image key={idx} source={{ uri: p }} style={styles.photo} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('homeTrainingBooking', { clubId })}>
            <Text style={styles.secondaryText}>Séance à domicile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('booking', { clubId })}>
            <Text style={styles.primaryBtnText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  heroContent: { position: 'absolute', left: 16, right: 16, bottom: 12 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  heroMeta: { color: '#E5E7EB', fontSize: 13 },
  rating: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: { color: '#1F2937', fontWeight: '700', fontSize: 12 },
  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  sectionRow: { paddingHorizontal: 16, flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 6 },
  title: { color: palette.text, fontSize: 18, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 14 },
  linkText: { textDecorationLine: 'underline' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  listTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.primary, fontWeight: '700' },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  scheduleTime: { color: palette.text, fontWeight: '600' },
  photo: { width: 180, height: 120, borderRadius: 12, backgroundColor: '#E5E7EB' },
  bottomActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 4 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: { color: palette.primary, fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
