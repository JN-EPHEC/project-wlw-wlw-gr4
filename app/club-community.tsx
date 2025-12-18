import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import { UserStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useCommunityChannels } from '@/hooks/useCommunityChannels';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useClubEvents } from '@/hooks/useClubEvents';

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
    accent: '#E9B782',
};

type Props = NativeStackScreenProps<UserStackParamList, 'clubCommunity'>;

export default function ClubCommunityScreen({ navigation, route }: Props) {
  const { clubId } = route.params as { clubId: string };
  const { user } = useAuth();

  const { channels, loading: channelsLoading } = useCommunityChannels(clubId);
  const { members, loading: membersLoading } = useCommunityMembers(clubId);
  const { events, loading: eventsLoading } = useClubEvents(clubId);

  const handleChannelClick = (channelId: string, channelName: string) => {
    navigation.navigate('chatRoom' as any, { clubId, channelId, channelName });
  };

  const announcementChannels = channels.filter((ch) => ch.type === 'announcements');
  const discussionChannels = channels.filter((ch) => ch.type === 'chat');

  const loading = channelsLoading || membersLoading || eventsLoading;

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>Communauté</Text>
                <Text style={styles.headerSub}>{members.length} membres • {channels.length} canaux</Text>
            </View>
        </View>

        <View style={styles.content}>
            <Section title="📢 Annonces" actionText="Voir tout" onActionPress={() => navigation.navigate('clubAnnouncements' as any)}>
                {announcementChannels.length > 0 ? announcementChannels.map(channel => (
                    <ChannelCard key={channel.id} channel={channel} onPress={handleChannelClick} />
                )) : <EmptyState text="Aucune annonce pour le moment." />}
            </Section>

            <Section title="📅 Événements à venir" actionText="Calendrier" onActionPress={() => navigation.navigate('events', { clubId })}>
                {events.length > 0 ? events.slice(0,2).map(event => (
                    <EventCard key={event.id} event={event} onPress={() => navigation.navigate('eventDetail', { eventId: event.id, clubId: event.clubId })} />
                )) : <EmptyState text="Aucun événement prévu." />}
            </Section>

            <Section title="💬 Salons de discussion">
                {discussionChannels.length > 0 ? discussionChannels.map(channel => (
                    <ChannelCard key={channel.id} channel={channel} onPress={handleChannelClick} />
                )) : <EmptyState text="Aucun salon de discussion disponible." />}
            </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ title, actionText, onActionPress, children }: any) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {onActionPress && <TouchableOpacity onPress={onActionPress}><Text style={styles.link}>{actionText}</Text></TouchableOpacity>}
        </View>
        {children}
    </View>
);

const ChannelCard = ({ channel, onPress }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(channel.id, channel.name)}>
        <View style={styles.cardIcon}>
            <Ionicons name={channel.type === 'announcements' ? 'megaphone-outline' : 'chatbubbles-outline'} size={22} color={colors.primary} />
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{channel.name}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>{channel.lastMessage || 'Appuyez pour voir les messages'}</Text>
        </View>
        {channel.unreadCount > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{channel.unreadCount}</Text></View>}
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
);

const EventCard = ({ event, onPress }: any) => {
    const startDate = event.startDate?.toDate ? event.startDate.toDate() : new Date();
    const dateStr = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const timeStr = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const availableSlots = event.dogSlots - (event.participants?.length || 0);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.eventDate}>
                <Text style={styles.eventDateDay}>{dateStr.split(' ')[0]}</Text>
                <Text style={styles.eventDateMonth}>{dateStr.split(' ')[1]}</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={1}>{event.location}</Text>
            </View>
            <View style={styles.slotsBadge}><Text style={styles.slotsText}>{availableSlots} places</Text></View>
        </TouchableOpacity>
    );
};

const EmptyState = ({ text }: { text: string }) => (
    <View style={styles.emptyState}><Text style={styles.emptyText}>{text}</Text></View>
);

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    container: { paddingBottom: 100 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
    backBtn: { padding: 8 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
    content: { padding: 16, gap: 24 },
    section: { gap: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    link: { fontSize: 14, fontWeight: '600', color: colors.primary },
    card: { backgroundColor: colors.surface, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2, shadowColor: colors.shadow },
    cardIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(39, 179, 163, 0.1)' },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
    cardSubtitle: { fontSize: 14, color: colors.textMuted },
    unreadBadge: { backgroundColor: colors.primary, minWidth: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
    unreadText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    eventDate: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.accent, marginRight: 4 },
    eventDateDay: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    eventDateMonth: { fontSize: 12, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' },
    slotsBadge: { backgroundColor: 'rgba(39, 179, 163, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    slotsText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
    emptyState: { alignItems: 'center', paddingVertical: 20 },
    emptyText: { fontSize: 15, color: colors.textMuted },
});