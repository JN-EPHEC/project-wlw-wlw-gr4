import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import UserBottomNav from '@/components/UserBottomNav';
import { UserStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useCommunityChannels } from '@/hooks/useCommunityChannels';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useClubEvents } from '@/hooks/useClubEvents';

const palette = {
  primary: '#41B6A6',
  terracotta: '#F28B6F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'clubCommunity'>;

export default function ClubCommunityScreen({ navigation, route }: Props) {
  const { clubId } = route.params as { clubId: string };
  const clubIdStr = clubId;
  const { user } = useAuth();

  console.log('🔍 [ClubCommunity] clubId:', clubId);
  console.log('👤 [ClubCommunity] Current user ID:', user?.uid);
  console.log('📧 [ClubCommunity] Current user email:', user?.email);

  // Fetch channels, members and events
  const { channels, loading: channelsLoading, error: channelsError } = useCommunityChannels(clubIdStr);
  const { members, loading: membersLoading } = useCommunityMembers(clubIdStr);
  const { events, loading: eventsLoading } = useClubEvents(clubIdStr);

  const handleChannelClick = (channelId: string, channelName: string) => {
    navigation.push('clubChannelChat' as any, {
      clubId: clubIdStr,
      channelId,
      channelName,
    });
  };

  const handleAnnouncementsClick = () => {
    navigation.navigate('clubAnnouncements' as any, { clubId: clubIdStr });
  };

  const handleEventsClick = () => {
    navigation.navigate('events', { clubId: clubIdStr });
  };

  // Separate channels by type
  const announcementChannels = channels.filter((ch) => ch.type === 'announcements');
  const discussionChannels = channels.filter((ch) => ch.type === 'chat');

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },
    header: {
      backgroundColor: palette.primary,
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    backButton: {
      padding: 6,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    headerTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '700',
    },
    headerSub: {
      color: '#E2E8F0',
      fontSize: 13,
    },
    sectionHeading: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
      marginBottom: 12,
      marginTop: 24,
    },
    channelCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: palette.primary,
    },
    announcementCard: {
      borderLeftColor: palette.terracotta,
      backgroundColor: '#FFFAF0',
    },
    channelName: {
      fontSize: 15,
      fontWeight: '700',
      color: palette.text,
      marginBottom: 4,
    },
    channelDesc: {
      fontSize: 12,
      color: palette.gray,
      marginBottom: 8,
    },
    channelMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lastMessage: {
      fontSize: 12,
      color: palette.gray,
      flex: 1,
    },
    unreadBadge: {
      backgroundColor: palette.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginLeft: 8,
    },
    unreadText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
    },
    containerPadding: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    membersBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(65, 182, 166, 0.1)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 20,
    },
    membersBadgeText: {
      color: palette.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (channelsLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Communauté</Text>
            <Text style={styles.headerSub}>{channels.length} canaux • {members.length} membres</Text>
          </View>
        </View>

        {/* Members badge */}
        <View style={styles.membersBadge}>
          <MaterialCommunityIcons name="account-multiple" size={16} color={palette.primary} />
          <Text style={styles.membersBadgeText}>{members.length} membres en ligne</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.containerPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* Announcements Section */}
        {announcementChannels.length > 0 && (
          <>
            <TouchableOpacity onPress={handleAnnouncementsClick} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 24 }}>
              <Text style={styles.sectionHeading}>📢 Annonces</Text>
              <Text style={{ color: palette.primary, fontSize: 14, fontWeight: '600' }}>Voir tout</Text>
            </TouchableOpacity>
            {announcementChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={[styles.channelCard, styles.announcementCard]}
                onPress={() => handleChannelClick(channel.id, channel.name)}
              >
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelDesc}>{channel.type === 'announcements' ? 'Seuls les éducateurs peuvent publier' : ''}</Text>
                <View style={styles.channelMeta}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    Seuls les éducateurs peuvent publier
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {announcementChannels.length === 0 && (
          <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
            <Text style={styles.sectionHeading}>📢 Annonces</Text>
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="bell-outline" size={40} color={palette.gray} />
              <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14 }}>
                Pas d'annonces pour le moment
              </Text>
            </View>
          </View>
        )}

        {/* Events Section */}
        {events.length > 0 && (
          <>
            <TouchableOpacity onPress={handleEventsClick} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 24 }}>
              <Text style={styles.sectionHeading}>📅 Événements</Text>
              <Text style={{ color: palette.primary, fontSize: 14, fontWeight: '600' }}>Voir tout</Text>
            </TouchableOpacity>
            {events.slice(0, 3).map((event) => {
              const startDate = event.startDate?.toDate?.() || new Date(event.startDate);
              const dateStr = startDate.toLocaleDateString('fr-FR', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              });
              const timeStr = startDate.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              const availableSlots = event.dogSlots - (event.participants?.reduce((sum, p) => sum + (p.numDogs || 0), 0) || 0);

              return (
                <TouchableOpacity
                  key={event.id}
                  style={styles.channelCard}
                  onPress={handleEventsClick}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Text style={[styles.channelName, { flex: 1 }]} numberOfLines={2}>{event.title}</Text>
                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ 
                        backgroundColor: '#E0F2F1', 
                        color: palette.primary, 
                        paddingHorizontal: 8, 
                        paddingVertical: 2, 
                        borderRadius: 8, 
                        fontWeight: '700', 
                        fontSize: 11 
                      }}>
                        {availableSlots}/{event.dogSlots}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="calendar-outline" size={12} color={palette.gray} />
                      <Text style={styles.channelDesc}>{dateStr}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="time-outline" size={12} color={palette.gray} />
                      <Text style={styles.channelDesc}>{timeStr}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="location-outline" size={12} color={palette.gray} />
                    <Text style={[styles.channelDesc, { flex: 1 }]} numberOfLines={1}>
                      {event.location || 'Lieu non spécifié'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Discussion Channels Section */}
        {discussionChannels.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>💬 Discussions</Text>
            {discussionChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={styles.channelCard}
                onPress={() => handleChannelClick(channel.id, channel.name)}
              >
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelDesc}>Salon de discussion du club</Text>
                <View style={styles.channelMeta}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    Tapez pour accéder au salon
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {channels.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chat-outline" size={48} color={palette.gray} />
            <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14 }}>
              Aucun salon pour le moment
            </Text>
          </View>
        )}
      </ScrollView>

      <UserBottomNav current="community" />
    </SafeAreaView>
  );
}
