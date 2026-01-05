import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherRoute, TeacherStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useEducatorClubs } from '@/hooks/useEducatorClubs';

const palette = {
  primary: '#F28B6F',
  primaryDark: '#E1725A',
  accent: '#2F9C8D',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E6E2DD',
  surface: '#FFFFFF',
  background: '#F7F4F0',
};

const quickActions = [
  { id: 'teacher-channel-chat', label: 'Répondre aux clients', icon: 'chatbubbles-outline' as const },
  { id: 'teacher-club-community', label: 'Canaux clubs', icon: 'albums-outline' as const },
  { id: 'teacher-club-members', label: 'Membres', icon: 'people-outline' as const },
];

export default function TeacherCommunitySelectionPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const route = useRoute<RouteProp<TeacherStackParamList, 'teacher-community'>>();
  const { user, profile } = useAuth();

  // Récupérer les clubs de l'éducateur
  const educatorId = (profile as any)?.educatorId || user?.uid;
  const { clubs, loading } = useEducatorClubs(educatorId || null);

  const targetPage: TeacherRoute = route.params?.page ?? 'teacher-club-community';
  const fallbackClubId = route.params?.clubId ?? null;

  const handleNavigate = <T extends TeacherRoute,>(page: T, params?: TeacherStackParamList[T]) => {
    navigation.navigate(page as any, params as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Communauté</Text>
              <Text style={styles.subtitle}>Choisissez un club ou une discussion</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('teacher-community')}>
              <Ionicons name="create-outline" size={18} color={palette.surface} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

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
            <Text style={styles.link}>Gérer</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={palette.primary} />
            </View>
          ) : clubs.length === 0 ? (
            <View style={{ paddingVertical: 30, alignItems: 'center' }}>
              <MaterialCommunityIcons name="club" size={40} color={palette.gray} />
              <Text style={{ color: palette.gray, fontSize: 14, marginTop: 12, fontWeight: '600' }}>
                Aucun club pour le moment
              </Text>
              <Text style={{ color: palette.gray, fontSize: 12, marginTop: 4 }}>
                Rejoignez un club pour accéder à la communauté
              </Text>
            </View>
          ) : (
            clubs.map((club) => (
              <TouchableOpacity
                key={club.clubId}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => handleNavigate(targetPage, { clubId: club.clubId })}
              >
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons name="shield-check-outline" size={18} color={palette.primary} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.cardTitle}>{club.clubName}</Text>
                  <Text style={styles.cardMeta}>{club.members} membres</Text>
                </View>
                {club.unreadCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{club.unreadCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))
          )}
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
              <Text style={styles.primaryBtnText}>Répondre</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-community" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  hero: {
    paddingTop: 6,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.surface },
  subtitle: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13 },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    marginHorizontal: 16,
    marginTop: -18,
    marginBottom: 12,
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FAFAF9',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  quickText: { color: palette.text, fontWeight: '700', fontSize: 12, textAlign: 'center' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  link: { color: palette.primaryDark, fontWeight: '700' },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
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
    borderRadius: 999,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  messageCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 4,
    borderLeftColor: palette.accent,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  dot: { width: 10, height: 10, borderRadius: 10 },
  primaryBtn: {
    backgroundColor: palette.primary,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});

