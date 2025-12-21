import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    purple: '#7C3AED',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    gold: '#FBBF24',
    silver: '#D1D5DB',
    bronze: '#FB923C',
};

const leaderboards: any = { /* ... seed data from original file ... */ };
type Props = NativeStackScreenProps<ClubStackParamList, 'clubLeaderboard'>;

export default function ClubLeaderboardScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'overall' | 'sessions' | 'events' | 'rating'>('overall');

  const data = useMemo(() => {
    if (activeTab === 'sessions') return leaderboards.bySessions;
    if (activeTab === 'events') return leaderboards.byEvents;
    if (activeTab === 'rating') return leaderboards.byRating;
    return leaderboards.overall;
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Classement</Text>
      </View>
      <View style={styles.tabs}>
        <TabButton id='overall' label='Général' icon='trophy-outline' active={activeTab==='overall'} onPress={setActiveTab} />
        <TabButton id='sessions' label='Cours' icon='school-outline' active={activeTab==='sessions'} onPress={setActiveTab} />
        <TabButton id='events' label='Événements' icon='calendar-outline' active={activeTab==='events'} onPress={setActiveTab} />
        <TabButton id='rating' label='Avis' icon='star-outline' active={activeTab==='rating'} onPress={setActiveTab} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {data.map((club: any, index: number) => <ClubCard key={club.id} club={club} rank={index + 1} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const TabButton = ({ id, label, icon, active, onPress }: any) => (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={() => onPress(id)}>
        <MaterialCommunityIcons name={icon} size={18} color={active ? colors.primary : colors.textMuted} />
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
);

const ClubCard = ({ club, rank }: { club: any, rank: number }) => {
    const rankColor = rank === 1 ? colors.gold : rank === 2 ? colors.silver : rank === 3 ? colors.bronze : colors.textMuted;
    
    return (
        <View style={[styles.card, { borderLeftColor: rankColor }]}>
            <Text style={[styles.rank, { color: rankColor }]}>{rank}</Text>
            <Image source={{ uri: club.image }} style={styles.avatar} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{club.name}</Text>
                <Text style={styles.cardSubtitle}>{club.city}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
                {club.totalScore && <Text style={[styles.score, {color: rankColor}]}>{club.totalScore}</Text>}
                {club.sessions && <Text style={styles.statText}>{club.sessions} cours</Text>}
                {club.events && <Text style={styles.statText}>{club.events} events</Text>}
                {club.rating && <Text style={styles.statText}>{club.rating.toFixed(1)}/5</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 12 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, padding: 8, margin: 16, borderRadius: 18, elevation: 2, shadowColor: '#000'},
  tab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 12, gap: 8 },
  tabActive: { backgroundColor: 'rgba(39, 179, 163, 0.1)' },
  tabText: { color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: colors.primary },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2, shadowColor: '#000', borderLeftWidth: 5 },
  rank: { fontSize: 18, fontWeight: 'bold', width: 28, textAlign: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardSubtitle: { fontSize: 14, color: colors.textMuted },
  score: { fontSize: 18, fontWeight: 'bold' },
  statText: { fontSize: 15, fontWeight: '600', color: colors.text },
});