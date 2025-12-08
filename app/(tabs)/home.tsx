import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { UserStackParamList } from '@/navigation/types';
import UserBottomNav from '@/components/UserBottomNav';

const { width } = Dimensions.get('window');

type Promo = {
  id: number;
  title: string;
  description: string;
  club: string;
  discount: string;
  image: string;
  color: string;
};

const promotions: Promo[] = [
  {
    id: 1,
    title: '50% sur votre 1ère séance',
    description: "Découvrez l'agility",
    club: 'Agility Pro',
    discount: '-50%',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    color: '#7C3AED',
  },
  {
    id: 2,
    title: 'Mois gratuit pour les nouveaux',
    description: 'Abonnement premium',
    club: 'Canin Club Paris',
    discount: 'GRATUIT',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80',
    color: '#DB2777',
  },
  {
    id: 3,
    title: 'Pack découverte 3 séances',
    description: 'Obéissance + Agility',
    club: 'Dog Academy',
    discount: '-30%',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80',
    color: '#2563EB',
  },
];

const boostedClubs = [
  {
    id: 1,
    name: 'Elite Dog Training',
    rating: 4.9,
    verified: true,
    distance: '0.8 km',
    speciality: 'Compétition',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Champions Canins',
    rating: 4.8,
    verified: true,
    distance: '1.5 km',
    speciality: 'Agility Pro',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Stage Agility intensif',
    date: '10 avr.',
    time: '14:00',
    location: 'Bois de Vincennes',
    participants: 24,
    image: 'https://images.unsplash.com/photo-1557971779-95a20f2d0e4a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Initiation obéissance chiots',
    date: '12 avr.',
    time: '10:00',
    location: 'Parc Montsouris',
    participants: 18,
    image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?auto=format&fit=crop&w=800&q=80',
  },
];

const upcomingTrainings = [
  {
    id: 1,
    title: 'Séance agility',
    status: 'confirmed',
    club: 'Agility Pro',
    trainer: 'Alexandre',
    dog: 'Nala',
    date: 'Demain',
    time: '18:00',
  },
  {
    id: 2,
    title: 'Obéissance urbaine',
    status: 'pending',
    club: 'City Dog',
    trainer: 'Julie',
    dog: 'Rocky',
    date: 'Jeu 12',
    time: '17:30',
  },
];

const dailyAITrainings = [
  {
    id: 1,
    title: 'Rappel sécurisé',
    description: 'Renforcer le rappel en milieu urbain avec distractions.',
    difficulty: 'Intermédiaire',
    duration: '10 min',
    completed: false,
    icon: 'shield-checkmark-outline' as const,
    color: '#7C3AED',
    bg: '#F3E8FF',
  },
  {
    id: 2,
    title: 'Marche en laisse',
    description: 'Rester calme au pas dans une rue passante.',
    difficulty: 'Débutant',
    duration: '8 min',
    completed: true,
    icon: 'walk-outline' as const,
    color: '#10B981',
    bg: '#ECFDF3',
  },
];

const palette = {
  primary: '#41B6A6',
  primaryDark: '#359889',
  gray: '#6B7280',
  text: '#1F2937',
};

type HomeNavigationProp = NativeStackNavigationProp<UserStackParamList, 'home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const profileInitials = useMemo(() => 'SD', []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{profileInitials}</Text>
              </View>
              <View>
                <Text style={styles.headerHint}>Bienvenue sur Smart Dogs</Text>
                <Text style={styles.headerTitle}>Smart Dogs</Text>
                <Text style={styles.headerSub}>Prêt(e) pour une nouvelle séance ?</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notif} onPress={() => navigation.navigate('notifications')}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>Rechercher un club, un dresseur...</Text>
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('clubs')}>
              <Text style={styles.navButtonText}>Clubs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('community')}>
              <Text style={styles.navButtonText}>Communauté</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('mydog')}>
              <Text style={styles.navButtonText}>Mes chiens</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 18 }}>
          {/* Promotions */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="tag-multiple" size={18} color="#7C3AED" />
              <Text style={styles.sectionTitle}>Promotions du moment</Text>
            </View>
            <View style={styles.badgeNew}>
              <MaterialCommunityIcons name="star" size={14} color="#7C3AED" />
              <Text style={styles.badgeNewText}>Nouveau</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {promotions.map((promo) => (
              <TouchableOpacity key={promo.id} activeOpacity={0.9} style={[styles.promoCard, { width: width * 0.8 }]}>
                <Image source={{ uri: promo.image }} style={styles.promoImage} />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 18 }]} />
                <View style={styles.promoDiscount}>
                  <Text style={styles.promoDiscountText}>{promo.discount}</Text>
                </View>
                <View style={styles.promoContent}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDesc}>{promo.description}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.promoClub}>{promo.club}</Text>
                    <MaterialCommunityIcons name="gift-outline" size={18} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Clubs boostés */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color="#F97316" />
              <Text style={styles.sectionTitle}>Clubs Boostés</Text>
            </View>
            <Text style={styles.link}>Voir tout</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {boostedClubs.map((club) => (
              <TouchableOpacity key={club.id} style={[styles.boostCard, { width: width * 0.8 }]}>
                <Image source={{ uri: club.image }} style={styles.boostImage} />
                <View style={[StyleSheet.absoluteFill, styles.boostOverlay]} />
                <View style={styles.boostBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={14} color="#fff" />
                  <Text style={styles.boostBadgeText}>Boosté</Text>
                </View>
                <View style={styles.boostRating}>
                  <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                  <Text style={styles.boostRatingText}>{club.rating}</Text>
                </View>
                <View style={styles.boostContent}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.boostTitle}>{club.name}</Text>
                    {club.verified ? (
                      <MaterialCommunityIcons name="check-decagram" size={18} color="#fff" style={{ marginLeft: 6 }} />
                    ) : null}
                  </View>
                  <Text style={styles.boostSub}>{club.speciality}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="location-outline" size={14} color="#fff" />
                    <Text style={styles.boostSub}>{club.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Événements */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="calendar-outline" size={18} color={palette.primary} />
              <Text style={styles.sectionTitle}>Événements à venir</Text>
            </View>
            <Text style={styles.link}>Calendrier</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {upcomingEvents.map((event) => (
              <TouchableOpacity key={event.id} style={[styles.eventCard, { width: width * 0.6 }]}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 16 }]} />
                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>
                    {event.date} · {event.time}
                  </Text>
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="location-outline" size={14} color="#E5E7EB" />
                    <Text style={styles.eventSub}>{event.location}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="people-outline" size={14} color="#E5E7EB" />
                    <Text style={styles.eventSub}>{event.participants} participants</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Prochaines séances */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="calendar-outline" size={18} color="#E9B782" />
              <Text style={styles.sectionTitle}>Mes prochaines séances</Text>
            </View>
            <Text style={styles.link}>Réserver</Text>
          </View>
          <View style={{ gap: 12 }}>
            {upcomingTrainings.map((t) => (
              <View
                key={t.id}
                style={[
                  styles.trainingCard,
                  { borderLeftColor: t.status === 'confirmed' ? palette.primary : '#E9B782' },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.trainingTitle}>{t.title}</Text>
                    <View
                      style={[
                        styles.statusChip,
                        t.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          t.status === 'confirmed' ? { color: '#166534' } : { color: '#92400E' },
                        ]}
                      >
                        {t.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.trainingSub}>{t.club}</Text>
                  <Text style={styles.trainingMeta}>
                    avec {t.trainer} · {t.dog}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.trainingDate}>{t.date}</Text>
                  <Text style={styles.trainingMeta}>{t.time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Exercices du jour */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="brain" size={18} color="#7C3AED" />
              <Text style={styles.sectionTitle}>Exercices du jour</Text>
            </View>
            <View style={styles.badgeGradient}>
              <MaterialCommunityIcons name="star" size={14} color="#fff" />
              <Text style={styles.badgeGradientText}>DjanAI</Text>
            </View>
          </View>

          <View style={[styles.aiIntro, cardShadow()]}>
            <View style={styles.aiIcon}>
              <MaterialCommunityIcons name="star" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Programme personnalisé</Text>
              <Text style={styles.aiSub}>
                Créez le profil de votre chien et recevez un programme d'entraînement adapté par DjanAI.
              </Text>
              <TouchableOpacity
                style={styles.chipPrimary}
                onPress={() => navigation.navigate('djanai', { previousPage: 'home' })}
              >
                <MaterialCommunityIcons name="star" size={14} color="#fff" />
                <Text style={styles.chipPrimaryText}>Commencer</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            {dailyAITrainings.map((ex) => (
              <View key={ex.id} style={[styles.aiCard, { opacity: ex.completed ? 0.6 : 1 }]}>
                <View style={[styles.aiIconSmall, { backgroundColor: ex.bg }]}>
                  <Ionicons name={ex.icon} size={20} color={ex.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.aiItemTitle}>{ex.title}</Text>
                    {ex.completed ? <Ionicons name="checkmark-circle" size={16} color="#16A34A" /> : null}
                  </View>
                  <Text style={styles.aiItemSub}>{ex.description}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
                    <View style={styles.chipMuted}>
                      <Text style={styles.chipMutedText}>{ex.difficulty}</Text>
                    </View>
                    <Text style={styles.aiMeta}>{ex.duration}</Text>
                  </View>
                </View>
                {!ex.completed ? (
                  <View style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Commencer</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>

          <View style={styles.chatCard}>
            <View style={styles.chatIcon}>
              <MaterialCommunityIcons name="brain" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatTitle}>Besoin de conseils ?</Text>
              <Text style={styles.chatSub}>Discutez avec DjanAI, votre assistant intelligent</Text>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate('djanai', { previousPage: 'home' })}
            >
              <Text style={styles.chatButtonText}>Discuter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <UserBottomNav current="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  container: { paddingBottom: 120 },
  header: {
    backgroundColor: '#41B6A6',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700' },
  headerHint: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  notif: { padding: 6 },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#F28B6F',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  searchBar: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchPlaceholder: { color: '#9CA3AF', fontSize: 14 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  navButtonText: { color: '#fff', fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: '#1F2937', fontSize: 16, fontWeight: '700' },
  badgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  badgeNewText: { color: '#7C3AED', fontWeight: '700', fontSize: 12 },
  promoCard: { borderRadius: 18, overflow: 'hidden', height: 180, justifyContent: 'flex-end' },
  promoImage: { width: '100%', height: '100%' },
  promoDiscount: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  promoDiscountText: { color: '#7C3AED', fontWeight: '700', fontSize: 12 },
  promoContent: { position: 'absolute', left: 14, right: 14, bottom: 12 },
  promoTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  promoDesc: { color: '#E5E7EB', fontSize: 13, marginTop: 2 },
  promoClub: { color: '#E5E7EB', fontSize: 12 },
  link: { color: '#41B6A6', fontSize: 13, fontWeight: '600' },
  boostCard: { borderRadius: 16, overflow: 'hidden', height: 200, justifyContent: 'flex-end' },
  boostImage: { width: '100%', height: '100%' },
  boostOverlay: { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 16 },
  boostBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#F97316',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boostBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  boostRating: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boostRatingText: { color: '#1F2937', fontWeight: '700', fontSize: 12 },
  boostContent: { position: 'absolute', left: 14, right: 14, bottom: 12 },
  boostTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  boostSub: { color: '#E5E7EB', fontSize: 12, marginTop: 4 },
  eventCard: { borderRadius: 16, overflow: 'hidden', height: 160, justifyContent: 'flex-end' },
  eventImage: { width: '100%', height: '100%' },
  eventBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  eventBadgeText: { color: '#2563EB', fontWeight: '700', fontSize: 12 },
  eventContent: { position: 'absolute', left: 12, right: 12, bottom: 12, gap: 6 },
  eventTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  eventSub: { color: '#E5E7EB', fontSize: 12 },
  trainingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    flexDirection: 'row',
    gap: 12,
    ...cardShadow(),
  },
  trainingTitle: { color: '#1F2937', fontWeight: '700', fontSize: 15 },
  trainingSub: { color: '#6B7280', fontSize: 13, marginTop: 2 },
  trainingMeta: { color: '#9CA3AF', fontSize: 12 },
  trainingDate: { color: '#1F2937', fontWeight: '700', fontSize: 14 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusChipText: { fontSize: 11, fontWeight: '700' },
  statusConfirmed: { backgroundColor: '#DCFCE7' },
  statusPending: { backgroundColor: '#FEF3C7' },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
  },
  badgeGradientText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  aiIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 14,
  },
  aiIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: { color: '#1F2937', fontWeight: '700', fontSize: 15 },
  aiSub: { color: '#6B7280', fontSize: 13, marginTop: 4 },
  chipPrimary: {
    marginTop: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  chipPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  aiCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...cardShadow(),
  },
  aiIconSmall: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiItemTitle: { color: '#1F2937', fontWeight: '700', fontSize: 14 },
  aiItemSub: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  aiMeta: { color: '#9CA3AF', fontSize: 12 },
  chipMuted: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  chipMutedText: { color: '#374151', fontWeight: '700', fontSize: 12 },
  actionButton: {
    backgroundColor: '#41B6A6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  chatCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatTitle: { color: '#fff', fontWeight: '700', fontSize: 15 },
  chatSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
  chatButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chatButtonText: { color: '#7C3AED', fontWeight: '700', fontSize: 13 },
});

function cardShadow() {
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  };
}
