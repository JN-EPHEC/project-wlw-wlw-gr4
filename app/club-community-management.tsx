import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';
import { useCommunityChannels } from '@/hooks/useCommunityChannels';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useClubEvents } from '@/hooks/useClubEvents';
import { useAuth } from '@/context/AuthContext';

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
    accent: '#E9B782',
    purple: '#7C3AED',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubCommunityManagement'>;

export default function ClubCommunityManagementScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  const clubId = (route.params as any)?.clubId || (profile as any)?.clubId || user?.uid || '';
  
  const { channels, loading: channelsLoading } = useCommunityChannels(clubId);
  const { members, loading: membersLoading } = useCommunityMembers(clubId);
  const { events, loading: eventsLoading } = useClubEvents(clubId);

  const loading = channelsLoading || membersLoading || eventsLoading;

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  }

  const handleNavigate = (screen: keyof ClubStackParamList, params?: object) =>
    navigation.navigate(screen as any, params);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Gestion Communauté</Text>
            <Text style={styles.headerSub}>Annonces, membres, et plus</Text>
        </View>

        <View style={styles.content}>
            <View style={styles.statsGrid}>
                <StatBox icon="people-outline" value={members.length} label="Membres" />
                <StatBox icon="chatbubbles-outline" value={channels.length} label="Canaux" />
                <StatBox icon="calendar-outline" value={events.length} label="Événements" />
            </View>
            
            <ManagementCard 
                icon="bullhorn-outline"
                title="Annonces"
                subtitle="Communiquez avec tous vos membres."
                color={colors.accent}
                onPress={() => handleNavigate('clubAnnouncements')}
            />
            <ManagementCard 
                icon="forum-outline"
                title="Salons de discussion"
                subtitle="Gérez les canaux de votre communauté."
                color={colors.primary}
                onPress={() => handleNavigate('clubChannels')}
            />
            <ManagementCard 
                icon="calendar-outline"
                title="Événements"
                subtitle="Créez et gérez les événements du club."
                color={colors.purple}
                onPress={() => handleNavigate('clubEventsManagement', { clubId })}
            />
            <ManagementCard 
                icon="account-group-outline"
                title="Membres"
                subtitle="Gérez les membres et les demandes."
                color={colors.text}
                onPress={() => handleNavigate('clubMembers')}
            />
        </View>
      </ScrollView>
      <ClubBottomNav current="clubCommunity" />
    </SafeAreaView>
  );
}

const StatBox = ({ icon, value, label }: { icon: any, value: number, label: string }) => (
    <View style={styles.statBox}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const ManagementCard = ({ icon, title, subtitle, color, onPress }: any) => (
    <TouchableOpacity style={[styles.card, {borderLeftColor: color}]} onPress={onPress}>
        <View style={[styles.cardIcon, {backgroundColor: color}]}>
            <MaterialCommunityIcons name={icon} size={28} color="#fff" />
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, paddingBottom: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 16, textAlign: 'center', marginTop: 4 },
  content: { padding: 16, marginTop: -16, gap: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statBox: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', gap: 4, elevation: 2, shadowColor: colors.shadow },
  statValue: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, elevation: 2, shadowColor: colors.shadow, borderLeftWidth: 5 },
  cardIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
});