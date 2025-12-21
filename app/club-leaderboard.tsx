import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#7C3AED',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Club = {
  id: number;
  rank: number;
  name: string;
  image: string;
  city: string;
  totalScore?: number;
  rating?: number;
  sessions?: number;
  events?: number;
  teachers?: number;
  members?: number;
  badge?: string;
  growth?: string;
  participants?: number;
  reviews?: number;
};

const leaderboards = {
  season: 'Automne 2024',
  overall: [
    {
      id: 1,
      rank: 1,
      name: 'Canin Club Paris',
      image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?w=150',
      city: 'Paris',
      totalScore: 9850,
      rating: 4.9,
      sessions: 342,
      events: 28,
      teachers: 12,
      members: 856,
      badge: '🏆',
    },
    {
      id: 2,
      rank: 2,
      name: 'Dog Academy Lyon',
      image: 'https://images.unsplash.com/photo-1592486058499-f262efe8292a?w=150',
      city: 'Lyon',
      totalScore: 9620,
      rating: 4.85,
      sessions: 315,
      events: 24,
      teachers: 10,
      members: 742,
      badge: '🥈',
    },
    {
      id: 3,
      rank: 3,
      name: 'Edu Dog Marseille',
      image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?w=150',
      city: 'Marseille',
      totalScore: 9380,
      rating: 4.82,
      sessions: 298,
      events: 22,
      teachers: 9,
      members: 698,
      badge: '🥉',
    },
    {
      id: 4,
      rank: 4,
      name: 'Sport Canin Bordeaux',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150',
      city: 'Bordeaux',
      totalScore: 8940,
      rating: 4.78,
      sessions: 276,
      events: 19,
      teachers: 8,
      members: 624,
    },
    {
      id: 5,
      rank: 5,
      name: 'Puppy School Nice',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150',
      city: 'Nice',
      totalScore: 8720,
      rating: 4.76,
      sessions: 254,
      events: 18,
      teachers: 7,
      members: 589,
    },
  ],
  bySessions: [
    {
      id: 1,
      rank: 1,
      name: 'Canin Club Paris',
      city: 'Paris',
      sessions: 342,
      growth: '+12%',
      image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?w=150',
    },
    {
      id: 2,
      rank: 2,
      name: 'Dog Academy Lyon',
      city: 'Lyon',
      sessions: 315,
      growth: '+8%',
      image: 'https://images.unsplash.com/photo-1592486058499-f262efe8292a?w=150',
    },
    {
      id: 3,
      rank: 3,
      name: 'Edu Dog Marseille',
      city: 'Marseille',
      sessions: 298,
      growth: '+15%',
      image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?w=150',
    },
    {
      id: 4,
      rank: 4,
      name: 'Sport Canin Bordeaux',
      city: 'Bordeaux',
      sessions: 276,
      growth: '+5%',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150',
    },
    {
      id: 5,
      rank: 5,
      name: 'Puppy School Nice',
      city: 'Nice',
      sessions: 254,
      growth: '+18%',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150',
    },
  ],
  byEvents: [
    {
      id: 1,
      rank: 1,
      name: 'Canin Club Paris',
      city: 'Paris',
      events: 28,
      participants: 1240,
      image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?w=150',
    },
    {
      id: 2,
      rank: 2,
      name: 'Dog Academy Lyon',
      city: 'Lyon',
      events: 24,
      participants: 1050,
      image: 'https://images.unsplash.com/photo-1592486058499-f262efe8292a?w=150',
    },
    {
      id: 3,
      rank: 3,
      name: 'Edu Dog Marseille',
      city: 'Marseille',
      events: 22,
      participants: 980,
      image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?w=150',
    },
    {
      id: 4,
      rank: 4,
      name: 'Sport Canin Bordeaux',
      city: 'Bordeaux',
      events: 19,
      participants: 845,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150',
    },
    {
      id: 5,
      rank: 5,
      name: 'Puppy School Nice',
      city: 'Nice',
      events: 18,
      participants: 790,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150',
    },
  ],
  byRating: [
    {
      id: 1,
      rank: 1,
      name: 'Canin Club Paris',
      city: 'Paris',
      rating: 4.9,
      reviews: 856,
      image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?w=150',
    },
    {
      id: 2,
      rank: 2,
      name: 'Dog Academy Lyon',
      city: 'Lyon',
      rating: 4.85,
      reviews: 742,
      image: 'https://images.unsplash.com/photo-1592486058499-f262efe8292a?w=150',
    },
    {
      id: 3,
      rank: 3,
      name: 'Edu Dog Marseille',
      city: 'Marseille',
      rating: 4.82,
      reviews: 698,
      image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?w=150',
    },
    {
      id: 4,
      rank: 4,
      name: 'Sport Canin Bordeaux',
      city: 'Bordeaux',
      rating: 4.78,
      reviews: 624,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150',
    },
    {
      id: 5,
      rank: 5,
      name: 'Puppy School Nice',
      city: 'Nice',
      rating: 4.76,
      reviews: 589,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150',
    },
  ],
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubLeaderboard'>;

export default function ClubLeaderboardScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'overall' | 'sessions' | 'events' | 'rating'>('overall');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <MaterialCommunityIcons name="crown-outline" size={20} color="#FACC15" />;
    if (rank === 2) return <MaterialCommunityIcons name="medal-outline" size={20} color="#9CA3AF" />;
    if (rank === 3) return <MaterialCommunityIcons name="medal-outline" size={20} color="#F97316" />;
    return <View style={styles.rankCircle}><Text style={styles.rankText}>{rank}</Text></View>;
  };

  const rankBg = (rank: number) => {
    if (rank === 1) return ['#FBBF24', '#F97316'];
    if (rank === 2) return ['#D1D5DB', '#9CA3AF'];
    if (rank === 3) return ['#FB923C', '#F59E0B'];
    return null;
  };

  const data: Club[] = useMemo(() => {
    if (activeTab === 'overall') return leaderboards.overall;
    if (activeTab === 'sessions') return leaderboards.bySessions;
    if (activeTab === 'events') return leaderboards.byEvents;
    return leaderboards.byRating;
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubProfile')}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Classement Inter-Clubs</Text>
          <Text style={styles.headerSub}>{leaderboards.season}</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="trophy-outline" size={24} color="#fff" />
        </View>
      </View>

      <View style={styles.tabs}>
        {[
          { id: 'overall', label: 'Général', icon: 'trophy-outline' as const },
          { id: 'sessions', label: 'Cours', icon: 'people-outline' as const },
          { id: 'events', label: 'Événements', icon: 'calendar-outline' as const },
          { id: 'rating', label: 'Avis', icon: 'star-outline' as const },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as typeof activeTab)}
            >
              <Ionicons name={tab.icon} size={16} color={active ? '#fff' : palette.text} />
              <Text style={[styles.tabText, active && { color: '#fff' }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {data.map((club) => {
          const topBg = rankBg(club.rank);
          const isTop = !!topBg;
          return (
            <TouchableOpacity
              key={club.id}
              style={[
                styles.card,
                isTop && { borderColor: topBg?.[0], backgroundColor: topBg ? topBg[0] + '22' : '#fff' },
              ]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('clubDetail', { clubId: club.id })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {getRankIcon(club.rank)}
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: club.image }} style={styles.image} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.cardTitle, isTop && { color: palette.text }]}>
                      {club.name} {('badge' in club && club.badge) ? club.badge : ''}
                    </Text>
                  </View>
                  <Text style={styles.cardMeta}>{club.city}</Text>
                </View>
                {activeTab === 'overall' && 'totalScore' in club && club.totalScore ? (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.score, { color: isTop ? palette.text : '#7C3AED' }]}>{club.totalScore}</Text>
                    <Text style={styles.cardMeta}>points</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.statsRow}>
                {typeof club.rating === 'number' ? (
                  <View style={styles.stat}>
                    <MaterialCommunityIcons name="star" size={16} color="#FACC15" />
                    <Text style={styles.statText}>{club.rating}</Text>
                  </View>
                ) : null}
                {typeof club.sessions === 'number' ? (
                  <View style={styles.stat}>
                    <MaterialCommunityIcons name="account-group-outline" size={16} color="#41B6A6" />
                    <Text style={styles.statText}>{club.sessions}</Text>
                  </View>
                ) : null}
                {typeof club.events === 'number' ? (
                  <View style={styles.stat}>
                    <MaterialCommunityIcons name="calendar" size={16} color="#F28B6F" />
                    <Text style={styles.statText}>{club.events}</Text>
                  </View>
                ) : null}
                {typeof club.teachers === 'number' ? (
                  <View style={styles.stat}>
                    <MaterialCommunityIcons name="school-outline" size={16} color="#E9B782" />
                    <Text style={styles.statText}>{club.teachers}</Text>
                  </View>
                ) : null}
                {typeof club.participants === 'number' ? (
                  <View style={styles.stat}>
                    <MaterialCommunityIcons name="account-multiple" size={16} color="#41B6A6" />
                    <Text style={styles.statText}>{club.participants}</Text>
                  </View>
                ) : null}
                {typeof club.reviews === 'number' ? (
                  <View style={styles.stat}>
                    <MaterialCommunityIcons name="chat-outline" size={16} color="#F28B6F" />
                    <Text style={styles.statText}>{club.reviews} avis</Text>
                  </View>
                ) : null}
              </View>

              {club.growth ? (
                <View style={styles.growth}>
                  <MaterialCommunityIcons name="trending-up" size={14} color="#16A34A" />
                  <Text style={[styles.cardMeta, { color: '#166534' }]}>{club.growth}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#EDE9FE', fontSize: 12 },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  tabActive: { backgroundColor: palette.primary },
  tabText: { color: palette.text, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  cardMeta: { color: palette.gray, fontSize: 13 },
  imageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#fff',
  },
  image: { width: '100%', height: '100%' },
  rankCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { color: palette.text, fontWeight: '700' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
  },
  statText: { color: palette.text, fontWeight: '600' },
  score: { fontWeight: '700', fontSize: 20 },
  growth: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
