import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const announcementChannel = {
  name: 'Annonces du club',
  description: 'Infos officielles',
  unread: 2,
  lastMessage: 'Club: Mise a jour planning weekend',
  lastMessageTime: 'Il y a 2 h',
};

const eventHighlight = {
  title: 'Collectif agility',
  date: 'Sam 10:00',
  place: 'Terrain principal',
  slots: '8/12 places',
};

const channels = [
  { id: 'general', name: 'General', description: 'Messages du club', unread: 3, last: 'Thomas: Merci pour la seance' },
  { id: 'cours-22', name: 'Cours du 22', description: 'Groupe dedie', unread: 0, last: 'Photo ajoutee par Sophie' },
  { id: 'coachs', name: 'Canal educateurs', description: 'Organisation interne', unread: 1, last: 'Ajuster les tarifs' },
];

export default function TeacherClubCommunityPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const route = useRoute<RouteProp<TeacherStackParamList, 'teacher-club-community'>>();
  const baseClubId = route.params?.clubId ?? null;
  const baseChannelId = route.params?.channelId;

  const buildParams = (data?: { clubId?: number | null; channelId?: string | null }) => {
    const nextClubId = data?.clubId ?? baseClubId;
    const nextChannelId = data?.channelId ?? baseChannelId;
    const params: Record<string, unknown> = {};
    if (nextClubId !== undefined) params.clubId = nextClubId;
    if (nextChannelId !== undefined) params.channelId = nextChannelId;
    return Object.keys(params).length > 0 ? (params as any) : undefined;
  };

  const handleNavigate = (page: keyof TeacherStackParamList, data?: { clubId?: number | null; channelId?: string | null }) => {
    navigation.navigate(page as any, buildParams(data));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('teacher-community', route.params)}
            >
              <Ionicons name="arrow-back" size={18} color={palette.primary} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Club Vincennes</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="people-outline" size={16} color="#fff" />
                <Text style={styles.headerSub}>186 membres</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => handleNavigate('teacher-club-members', { clubId: baseClubId })}
          >
            <Text style={styles.headerBtnText}>Membres</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          <View>
            <View style={styles.sectionHeading}>
              <MaterialCommunityIcons name="bell-outline" size={18} color={palette.primary} />
              <Text style={styles.sectionTitle}>Annonces</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.announcementCard}>
              <View style={styles.announcementIcon}>
                <MaterialCommunityIcons name="bell-ring" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.cardTitle}>{announcementChannel.name}</Text>
                  {announcementChannel.unread > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{announcementChannel.unread}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.cardMeta}>{announcementChannel.description}</Text>
                <Text style={styles.cardMeta}>{announcementChannel.lastMessage}</Text>
                <Text style={styles.cardTime}>{announcementChannel.lastMessageTime}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View>
            <View style={styles.sectionHeading}>
              <MaterialCommunityIcons name="calendar-month-outline" size={18} color={palette.accent} />
              <Text style={styles.sectionTitle}>Evenement a venir</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.eventCard}
              onPress={() => navigation.navigate('teacher-appointments')}
            >
              <View style={styles.eventIcon}>
                <MaterialCommunityIcons name="calendar-star" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{eventHighlight.title}</Text>
                <Text style={styles.cardMeta}>{eventHighlight.date} - {eventHighlight.place}</Text>
                <Text style={[styles.cardMeta, { color: palette.text }]}>{eventHighlight.slots}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeading}>
            <MaterialCommunityIcons name="forum-outline" size={18} color={palette.primary} />
            <Text style={styles.sectionTitle}>Canaux</Text>
          </View>
          <View style={{ gap: 12 }}>
            {channels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={styles.channelCard}
                onPress={() => handleNavigate('teacher-channel-chat', { clubId: baseClubId, channelId: channel.id })}
              >
                <View style={styles.channelIcon}>
                  <Ionicons name="chatbubbles-outline" size={18} color={palette.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.cardTitle}>{channel.name}</Text>
                    {channel.unread > 0 && (
                      <View style={[styles.badge, { backgroundColor: '#E0F2F1' }]}>
                        <Text style={[styles.badgeText, { color: palette.accent }]}>{channel.unread}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardMeta}>{channel.description}</Text>
                  <Text style={styles.cardTime}>{channel.last}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('teacher-community')}>
              <Text style={styles.secondaryText}>Poster</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleNavigate('teacher-club-members', { clubId: baseClubId })}
            >
              <Text style={styles.primaryBtnText}>Inviter membres</Text>
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
    backgroundColor: palette.primary,
    padding: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#FFE4D6', fontSize: 13 },
  headerBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  headerBtnText: { color: palette.primary, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  announcementIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  cardTime: { color: palette.gray, fontSize: 12 },
  badge: {
    backgroundColor: palette.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 8 },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: { flexDirection: 'row', gap: 10 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: { color: palette.text, fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
