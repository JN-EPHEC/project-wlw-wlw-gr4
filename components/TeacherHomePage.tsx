import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { useAuth } from '@/context/AuthContext';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  primaryDark: '#e67a5f',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const nextSessions = [
  { id: 1, time: '09:00', title: 'Coaching chiot', dog: 'Nova', location: 'Parc Monceau', type: 'Solo' },
  { id: 2, time: '11:30', title: 'Agility', dog: 'Rex', location: 'Club Vincennes', type: 'Groupe' },
  { id: 3, time: '15:00', title: 'A la maison', dog: 'Luna', location: 'Boulogne', type: 'Domicile' },
];

const followUps = [
  { id: 1, label: 'Notes a completer', count: 3, icon: 'document-text-outline' as const },
  { id: 2, label: 'Messages non lus', count: 6, icon: 'chatbubble-ellipses-outline' as const },
  { id: 3, label: 'Demandes en attente', count: 2, icon: 'alert-circle-outline' as const },
];

const shortcuts = [
  { id: 'teacher-appointments', label: 'Ouvrir planning', icon: 'calendar' as const },
  { id: 'teacher-community', label: 'Poster une actu', icon: 'megaphone' as const },
  { id: 'teacher-clubs', label: 'Clubs partenaires', icon: 'people' as const },
];

export default function TeacherHomePage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const initials = useMemo(() => 'SM', []);
  const { user } = useAuth();
  const userId = (user as any)?.uid || '';
  const unreadCount = useUnreadNotificationCount(userId);

  const handleNavigate = (page: keyof TeacherStackParamList) => {
    // cast to any to satisfy react-navigation overloads when using a variable screen name
    navigation.navigate(page as any);
  };

  const typeBadge = (type: string) => {
    switch (type) {
      case 'Solo':
        return { color: '#FEF3C7', text: '#92400E' };
      case 'Groupe':
        return { color: '#DBEAFE', text: '#1D4ED8' };
      default:
        return { color: '#E0F2F1', text: '#047857' };
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text style={styles.heroHint}>Bonjour Sophie</Text>
              <Text style={styles.heroTitle}>Vue enseignant</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>En ligne pour de nouveaux clients</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notif}
            onPress={() => navigation.navigate('notifications', { previousTarget: 'teacher-home' })}
          >
            <Ionicons name="notifications-outline" size={20} color={palette.primaryDark} />
            {unreadCount > 0 ? (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 16 }}>
          <View style={styles.focusCard}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.focusLabel}>Prochain rendez-vous</Text>
              <Text style={styles.focusTitle}>Nova - Coaching chiot</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="time-outline" size={16} color={palette.surface} />
                <Text style={styles.focusMeta}>09:00 - Parc Monceau</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="person-outline" size={16} color={palette.surface} />
                <Text style={styles.focusMeta}>Marie Dupont</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.focusButton}
              activeOpacity={0.9}
              onPress={() => handleNavigate('teacher-appointments')}
            >
              <Text style={styles.focusButtonText}>Ouvrir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {followUps.map((item) => (
              <View key={item.id} style={styles.statCard}>
                <Ionicons name={item.icon} size={18} color={palette.primary} />
                <Text style={styles.statValue}>{item.count}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.shortcuts}>
            {shortcuts.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.shortcutCard}
                onPress={() => handleNavigate(action.id as keyof TeacherStackParamList)}
              >
                <Ionicons name={action.icon} size={18} color={palette.primary} />
                <Text style={styles.shortcutText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ gap: 10 }}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="calendar-outline" size={18} color={palette.primary} />
                <Text style={styles.sectionTitle}>Planning du jour</Text>
              </View>
              <TouchableOpacity onPress={() => handleNavigate('teacher-appointments')}>
                <Text style={styles.link}>Voir plus</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10 }}>
              {nextSessions.map((slot) => {
                const badge = typeBadge(slot.type);
                return (
                  <View key={slot.id} style={styles.card}>
                    <View style={styles.iconBadge}>
                      <Ionicons name="time-outline" size={18} color={palette.primary} />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}>{slot.title}</Text>
                        <View style={[styles.badge, { backgroundColor: badge.color }]}>
                          <Text style={[styles.badgeText, { color: badge.text }]}>{slot.type}</Text>
                        </View>
                      </View>
                      <Text style={styles.cardMeta}>{slot.time} - {slot.location}</Text>
                      <Text style={styles.cardMeta}>Chien: {slot.dog}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.communityCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="message-text-outline" size={18} color={palette.accent} />
              <Text style={styles.sectionTitle}>Communauté</Text>
            </View>
            <Text style={styles.sub}>3 questions en attente de réponse aujourd hui.</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.pillButton, { backgroundColor: palette.accent }]}
                onPress={() => handleNavigate('teacher-community')}
              >
                <Text style={styles.pillButtonText}>Répondre maintenant</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pillButton, { backgroundColor: '#E5E7EB' }]}
                onPress={() => handleNavigate('teacher-appointments')}
              >
                <Text style={[styles.pillButtonText, { color: palette.text }]}>Envoyer dispo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  hero: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.primary, fontWeight: '700', fontSize: 18 },
  heroHint: { color: palette.gray, fontSize: 13 },
  heroTitle: { color: palette.text, fontSize: 20, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#22C55E' },
  statusText: { color: palette.gray, fontSize: 12 },
  notif: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  notifBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  focusCard: {
    backgroundColor: palette.primary,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  focusLabel: { color: '#FFE4D6', fontSize: 13 },
  focusTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  focusMeta: { color: '#FFE4D6', fontSize: 13 },
  focusButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  focusButtonText: { color: palette.primary, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: { fontSize: 18, fontWeight: '700', color: palette.text },
  statLabel: { fontSize: 12, color: palette.gray, textAlign: 'center' },
  shortcuts: { flexDirection: 'row', gap: 10 },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#FFF3EC',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    alignItems: 'flex-start',
  },
  shortcutText: { color: palette.text, fontWeight: '700', fontSize: 13 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  link: { color: palette.primary, fontWeight: '600' },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  communityCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: palette.border,
  },
  sub: { color: palette.gray, fontSize: 13 },
  pillButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  pillButtonText: { color: '#fff', fontWeight: '700' },
});
