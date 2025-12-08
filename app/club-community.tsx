import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import UserBottomNav from '@/components/UserBottomNav';
import { UserStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  terracotta: '#F28B6F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const announcementChannel = {
  name: 'Annonces officielles',
  description: 'Seuls les éducateurs peuvent publier',
  unread: 2,
  lastMessage: 'Sophie: Nouvelle session ce samedi !',
  lastMessageTime: 'Il y a 2 h',
};

const eventsSummary = {
  upcomingEvents: 4,
  nextEvent: {
    title: 'Balade en forêt de Fontainebleau',
    date: 'Sam 28 Oct',
  },
};

const discussionChannels = [
  {
    id: 'general',
    name: 'Discussion générale',
    description: 'Chat du club',
    unread: 3,
    lastMessage: "Sophie: Quelqu'un a des conseils pour...",
    lastMessageTime: 'Il y a 30 min',
  },
  {
    id: 'course-oct-22',
    name: 'Cours du 22 Oct',
    description: 'Salon dédié au cours',
    unread: 0,
    lastMessage: 'Marc: Qui sera présent demain ?',
    lastMessageTime: 'Il y a 1 h',
  },
  {
    id: 'tips',
    name: 'Astuces & Conseils',
    description: 'Partagez vos conseils',
    unread: 1,
    lastMessage: 'Julie a partagé une vidéo',
    lastMessageTime: 'Il y a 4 h',
  },
];

type Props = NativeStackScreenProps<UserStackParamList, 'clubCommunity'>;

export default function ClubCommunityScreen({ navigation, route }: Props) {
  const { clubId } = route.params;

  const handleChannelClick = (channelId: string, channelName: string) => {
    if (channelId === 'tips' || channelId === 'tips-tricks') {
      navigation.navigate('forum', { clubId, channelId, channelName });
    } else {
      navigation.navigate('chatRoom', { clubId, channelId, channelName });
    }
  };

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
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sectionTitle: {
      color: palette.text,
      fontSize: 17,
      fontWeight: '700',
    },
    badge: {
      backgroundColor: '#FDF5E6',
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    badgeText: {
      color: palette.primary,
      fontWeight: '700',
      fontSize: 12,
    },
    announcementCard: {
      flexDirection: 'row',
      gap: 12,
      padding: 14,
      marginTop: 12,
      backgroundColor: '#FFF7ED',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#FED7AA',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    announcementIcon: {
      width: 50,
      height: 50,
      borderRadius: 14,
      backgroundColor: palette.terracotta,
      alignItems: 'center',
      justifyContent: 'center',
    },
    announcementDescription: {
      color: palette.terracotta,
      fontSize: 12,
      marginTop: 4,
    },
    eventCard: {
      flexDirection: 'row',
      gap: 12,
      padding: 14,
      marginTop: 12,
      backgroundColor: '#ECFEFF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#A5F3FC',
      alignItems: 'center',
    },
    eventIcon: {
      width: 50,
      height: 50,
      borderRadius: 14,
      backgroundColor: palette.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    eventDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    channelCard: {
      flexDirection: 'row',
      gap: 12,
      padding: 14,
      backgroundColor: '#fff',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    channelIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: '#F1F5F9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      color: palette.text,
      fontWeight: '700',
      fontSize: 15,
    },
    cardMeta: {
      color: palette.gray,
      fontSize: 13,
      marginTop: 2,
    },
  cardTime: {
    color: palette.gray,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: {
    color: '#1D4ED8',
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    color: '#1E40AF',
    fontSize: 13,
    lineHeight: 18,
  },
});

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('community')}
        accessibilityLabel="Retour"
        accessibilityRole="button"
        >
        <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Communauté du club</Text>
        <Text style={styles.headerSub}>Échangez avec les membres et restez informé</Text>
      </View>

      {/* Annonces officielles */}
      <View style={{ marginTop: 24 }}>
        <View style={styles.sectionHeading}>
        <MaterialCommunityIcons name="bullhorn" size={20} color={palette.terracotta} />
        <Text style={styles.sectionTitle}>Annonces officielles</Text>
        {announcementChannel.unread > 0 && (
          <View style={styles.badge} accessibilityLabel={`${announcementChannel.unread} annonces non lues`}>
          <Text style={styles.badgeText}>{announcementChannel.unread} non lues</Text>
          </View>
        )}
        </View>
        <TouchableOpacity
        style={styles.announcementCard}
        onPress={() => handleChannelClick('announcements', announcementChannel.name)}
        accessibilityLabel="Voir les annonces officielles"
        accessibilityRole="button"
        >
        <View style={styles.announcementIcon}>
          <MaterialCommunityIcons name="bullhorn" size={28} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{announcementChannel.name}</Text>
          <Text style={styles.announcementDescription}>{announcementChannel.description}</Text>
          <Text style={styles.cardMeta} numberOfLines={1}>{announcementChannel.lastMessage}</Text>
          <Text style={styles.cardTime}>{announcementChannel.lastMessageTime}</Text>
        </View>
        </TouchableOpacity>
      </View>

      {/* Prochains événements */}
      <View style={{ marginTop: 32 }}>
        <View style={styles.sectionHeading}>
        <Ionicons name="calendar" size={20} color={palette.primary} />
        <Text style={styles.sectionTitle}>Prochains événements</Text>
        <View style={styles.badge} accessibilityLabel={`${eventsSummary.upcomingEvents} événements à venir`}>
          <Text style={styles.badgeText}>{eventsSummary.upcomingEvents} à venir</Text>
        </View>
        </View>
        <TouchableOpacity
        style={styles.eventCard}
        activeOpacity={0.8}
        accessibilityLabel="Voir le prochain événement"
        accessibilityRole="button"
        onPress={() => navigation.navigate('events', { clubId })}
        >
        <View style={styles.eventIcon}>
          <Ionicons name="calendar" size={28} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{eventsSummary.nextEvent.title}</Text>
          <View style={styles.eventDetails}>
          <Ionicons name="time-outline" size={16} color={palette.primary} />
          <Text style={styles.cardMeta}>{eventsSummary.nextEvent.date}</Text>
          </View>
        </View>
        </TouchableOpacity>
      </View>

      {/* Discussions */}
      <View style={{ marginTop: 32 }}>
        <View style={styles.sectionHeading}>
        <Ionicons name="chatbubbles" size={20} color={palette.primary} />
        <Text style={styles.sectionTitle}>Discussions</Text>
        </View>
        <View style={{ gap: 12, marginTop: 12 }}>
        {discussionChannels.map((channel) => (
          <TouchableOpacity
          key={channel.id}
          style={styles.channelCard}
          onPress={() => handleChannelClick(channel.id, channel.name)}
          accessibilityLabel={`Ouvrir la discussion ${channel.name}`}
          accessibilityRole="button"
          >
          <View style={styles.channelIcon}>
            <Ionicons name="chatbubble-ellipses" size={22} color={palette.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{channel.name}</Text>
            <Text style={styles.cardMeta}>{channel.description}</Text>
            <Text style={styles.cardMeta} numberOfLines={1}>{channel.lastMessage}</Text>
            <Text style={styles.cardTime}>{channel.lastMessageTime}</Text>
          </View>
          {channel.unread > 0 && (
            <View style={styles.badge} accessibilityLabel={`${channel.unread} messages non lus`}>
            <Text style={styles.badgeText}>{channel.unread}</Text>
            </View>
          )}
          </TouchableOpacity>
        ))}
        </View>
      </View>

      {/* Info card */}
      <View style={{ marginTop: 32 }}>
        <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#1D4ED8" style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Besoin d'aide ?</Text>
          <Text style={styles.infoText}>
          Contactez un éducateur ou consultez la FAQ du club pour toute question ou problème.
          </Text>
        </View>
        </View>
      </View>
      </ScrollView>
      <UserBottomNav current="community" />
    </SafeAreaView>
  );
}
