import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherRoute, TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const clubs = [
  { id: 1, name: 'Club Vincennes', members: 186, unread: 4, last: 'Nouveau post dans Annonces' },
  { id: 2, name: 'Caniparc Ouest', members: 94, unread: 2, last: 'Feedback cours collectif' },
  { id: 3, name: 'Petits Loups', members: 42, unread: 0, last: 'Pas de nouveaute' },
];

const quickActions = [
  { id: 'teacher-channel-chat', label: 'Repondre clients', icon: 'chatbubbles-outline' as const },
  { id: 'teacher-club-community', label: 'Canaux clubs', icon: 'albums-outline' as const },
  { id: 'teacher-club-members', label: 'Membres', icon: 'people-outline' as const },
];

export default function TeacherCommunitySelectionPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const route = useRoute<RouteProp<TeacherStackParamList, 'teacher-community'>>();

  const targetPage: TeacherRoute = route.params?.page ?? 'teacher-club-community';
  const fallbackClubId = route.params?.clubId ?? null;

  const handleNavigate = (page: TeacherRoute, data?: { clubId?: number | null; channelId?: string | null }) => {
    const nextParams =
      data || fallbackClubId !== null
        ? ({ clubId: data?.clubId ?? fallbackClubId, channelId: data?.channelId } as any)
        : undefined;
    navigation.navigate(page as any, nextParams);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Communaute</Text>
            <Text style={styles.subtitle}>Choisissez un club ou une discussion</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('teacher-community')}>
            <Ionicons name="create-outline" size={18} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickCard}
              onPress={() => {
                if (action.id === 'teacher-channel-chat') {
                  handleNavigate('teacher-channel-chat', { channelId: 'inbox', clubId: fallbackClubId });
                } else {
                  handleNavigate(action.id as TeacherRoute, { clubId: fallbackClubId });
                }
              }}
            >
              <Ionicons name={action.icon} size={18} color={palette.primary} />
              <Text style={styles.quickText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="account-group-outline" size={18} color={palette.primary} />
            <Text style={styles.sectionTitle}>Mes clubs</Text>
          </View>
          <TouchableOpacity onPress={() => handleNavigate('teacher-clubs')}>
            <Text style={styles.link}>Gerer</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {clubs.map((club) => (
            <TouchableOpacity
              key={club.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => handleNavigate(targetPage as keyof TeacherStackParamList, club.id)}
            >
              <View style={styles.iconBadge}>
                <MaterialCommunityIcons name="shield-check-outline" size={18} color={palette.primary} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.cardTitle}>{club.name}</Text>
                <Text style={styles.cardMeta}>{club.members} membres</Text>
                <Text style={styles.cardMeta}>{club.last}</Text>
              </View>
              {club.unread > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{club.unread}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={palette.accent} />
            <Text style={styles.sectionTitle}>Messages rapides</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('teacher-channel-chat', { channelId: 'inbox', clubId: fallbackClubId })}
          >
            <Text style={styles.link}>Ouvrir</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          <View style={styles.messageCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.cardTitle}>Clients en attente</Text>
            </View>
            <Text style={styles.cardMeta}>2 demandes de dispo et 1 compte rendu</Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 10 }]}
              onPress={() => navigation.navigate('teacher-channel-chat', { channelId: 'inbox', clubId: fallbackClubId })}
            >
              <Text style={styles.primaryBtnText}>Repondre</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-community" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 13 },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFF3EC',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    alignItems: 'flex-start',
  },
  quickText: { color: palette.text, fontWeight: '700', fontSize: 13 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  link: { color: palette.primary, fontWeight: '700' },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
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
  badge: {
    backgroundColor: palette.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  dot: { width: 10, height: 10, borderRadius: 10 },
  primaryBtn: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
