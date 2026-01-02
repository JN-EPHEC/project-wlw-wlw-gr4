import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';
import { useCommunityChannels } from '@/hooks/useCommunityChannels';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useAuth } from '@/context/AuthContext';

const palette = {
  primary: '#E39A5C',
  primaryDark: '#D48242',
  accent: '#2F9C8D',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E6E2DD',
  surface: '#FFFFFF',
  background: '#F7F4F0',
  success: '#16A34A',
  warning: '#F59E0B',
};

export default function TeacherClubCommunityPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const route = useRoute<RouteProp<TeacherStackParamList, 'teacher-club-community'>>();
  const baseClubId = route.params?.clubId ?? null;
  const { user } = useAuth();

  // Récupérer les channels et les membres du club
  const { channels, loading: channelsLoading } = useCommunityChannels(baseClubId || '');
  const { members, loading: membersLoading } = useCommunityMembers(baseClubId || '');

  // Séparer les channels par type
  const announcementChannels = channels.filter((ch) => ch.type === 'announcements');
  const discussionChannels = channels.filter((ch) => ch.type === 'chat');

  const handleNavigate = (page: keyof TeacherStackParamList, clubId: string, channelId?: string) => {
    const params: any = { clubId };
    if (channelId) params.channelId = channelId;
    navigation.navigate(page, params);
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
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.navigate('teacher-community')}
              >
                <Ionicons name="arrow-back" size={18} color={palette.surface} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Club</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="people-outline" size={16} color="#fff" />
                  <Text style={styles.headerSub}>{members.length} membres</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => handleNavigate('teacher-club-members', baseClubId || '')}
            >
              <Text style={styles.headerBtnText}>Membres</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ padding: 16, gap: 16 }}>
          {channelsLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={palette.primary} />
            </View>
          ) : (
            <>
              {/* Annonces */}
              {announcementChannels.length > 0 && (
                <View>
                  <View style={styles.sectionHeading}>
                    <MaterialCommunityIcons name="bell-outline" size={18} color={palette.primary} />
                    <Text style={styles.sectionTitle}>Annonces</Text>
                  </View>
                  {announcementChannels.map((channel) => (
                    <TouchableOpacity
                      key={channel.id}
                      activeOpacity={0.9}
                      style={styles.announcementCard}
                      onPress={() => navigation.navigate('teacher-announcements', { clubId: baseClubId })}
                    >
                      <View style={styles.announcementIcon}>
                        <MaterialCommunityIcons name="bell-ring" size={22} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={styles.cardTitle}>{channel.name}</Text>
                        </View>
                        <Text style={styles.cardMeta}>{channel.description}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {announcementChannels.length > 0 && discussionChannels.length > 0 && (
                <View style={styles.divider} />
              )}

              {/* Canaux de discussion */}
              {discussionChannels.length > 0 && (
                <View>
                  <View style={styles.sectionHeading}>
                    <MaterialCommunityIcons name="forum-outline" size={18} color={palette.primary} />
                    <Text style={styles.sectionTitle}>Canaux</Text>
                  </View>
                  <View style={{ gap: 12 }}>
                    {discussionChannels.map((channel) => (
                      <TouchableOpacity
                        key={channel.id}
                        style={styles.channelCard}
                        onPress={() => handleNavigate('teacher-channel-chat', baseClubId || '', channel.id)}
                      >
                        <View style={styles.channelIcon}>
                          <Ionicons name="chatbubbles-outline" size={18} color={palette.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardTitle}>{channel.name}</Text>
                          <Text style={styles.cardMeta}>{channel.description}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {channels.length === 0 && (
                <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                  <MaterialCommunityIcons name="forum-outline" size={40} color={palette.gray} />
                  <Text style={{ color: palette.gray, fontSize: 14, marginTop: 12, fontWeight: '600' }}>
                    Aucun canal pour le moment
                  </Text>
                </View>
              )}

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('teacher-community')}>
                  <Text style={styles.secondaryText}>Retour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => handleNavigate('teacher-club-members', baseClubId || '')}
                >
                  <Text style={styles.primaryBtnText}>Inviter membres</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 8,
  },
  header: {
    padding: 16,
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
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13 },
  headerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  headerBtnText: { color: palette.surface, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  announcementCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
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
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 10 },
  eventCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 4,
    borderLeftColor: palette.accent,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
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
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
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
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
  },
  secondaryText: { color: palette.text, fontWeight: '700', fontSize: 13 },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
