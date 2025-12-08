import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const data = {
  season: 'Hiver 2025',
  overall: [
    { id: 1, rank: 1, name: 'Sophie Martin', city: 'Paris', rating: 4.9, sessions: 128, growth: '+12%', badge: 'Top coach' },
    { id: 2, rank: 2, name: 'Thomas Leroy', city: 'Lyon', rating: 4.85, sessions: 117, growth: '+10%', badge: 'Client love' },
    { id: 3, rank: 3, name: 'Julie Roux', city: 'Bordeaux', rating: 4.8, sessions: 110, growth: '+8%', badge: 'Community' },
    { id: 4, rank: 4, name: 'Pierre Martel', city: 'Marseille', rating: 4.78, sessions: 98, growth: '+6%' },
    { id: 5, rank: 5, name: 'Emma Blanc', city: 'Toulouse', rating: 4.75, sessions: 92, growth: '+5%' },
  ],
  bySessions: [
    { id: 1, rank: 1, name: 'Sophie Martin', sessions: 128, growth: '+12%' },
    { id: 2, rank: 2, name: 'Thomas Leroy', sessions: 117, growth: '+10%' },
    { id: 3, rank: 3, name: 'Julie Roux', sessions: 110, growth: '+8%' },
    { id: 4, rank: 4, name: 'Pierre Martel', sessions: 98, growth: '+6%' },
  ],
};

const tabs = [
  { key: 'overall', label: 'Global' },
  { key: 'bySessions', label: 'Sessions' },
];

export default function TeacherLeaderboardPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const [activeTab, setActiveTab] = useState<'overall' | 'bySessions'>('overall');

  const list = data[activeTab];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Classements</Text>
            <Text style={styles.subtitle}>{data.season}</Text>
          </View>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('teacher-account')}
          >
            <Ionicons name="arrow-back" size={18} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.podium}>
          <View style={styles.podiumCard}>
            <View style={styles.medal}>
              <Text style={styles.medalText}>1</Text>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' }}
              style={styles.avatar}
            />
            <Text style={styles.podiumName}>{data.overall[0].name}</Text>
            <Text style={styles.podiumMeta}>{data.overall[0].city}</Text>
          </View>
          <View style={styles.podiumCard}>
            <View style={[styles.medal, { backgroundColor: '#E5E7EB' }]}>
              <Text style={[styles.medalText, { color: palette.text }]}>2</Text>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200' }}
              style={styles.avatar}
            />
            <Text style={styles.podiumName}>{data.overall[1].name}</Text>
            <Text style={styles.podiumMeta}>{data.overall[1].city}</Text>
          </View>
          <View style={styles.podiumCard}>
            <View style={[styles.medal, { backgroundColor: '#FDE68A' }]}>
              <Text style={[styles.medalText, { color: '#92400E' }]}>3</Text>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' }}
              style={styles.avatar}
            />
            <Text style={styles.podiumName}>{data.overall[2].name}</Text>
            <Text style={styles.podiumMeta}>{data.overall[2].city}</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key as 'overall' | 'bySessions')}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {list.map((teacher) => (
            <View key={teacher.id} style={styles.row}>
              <View style={styles.rank}>
                <Text style={styles.rankText}>{teacher.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{teacher.name}</Text>
                {'city' in teacher && <Text style={styles.meta}>{(teacher as any).city}</Text>}
                {'sessions' in teacher && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="time-outline" size={14} color={palette.gray} />
                    <Text style={styles.meta}>{teacher.sessions} sessions</Text>
                  </View>
                )}
              </View>
              {'rating' in teacher && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.statText}>{(teacher as any).rating}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.badge}
                onPress={() => navigation.navigate('teacherDetail', {
                  teacherId: teacher.id,
                  clubId: 1,
                  previousTarget: 'teacherLeaderboard',
                })}
              >
                <Text style={styles.badgeText}>{teacher.growth}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('teacher-account')}>
            <Text style={styles.secondaryText}>Voir mon score</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('teacher-appointments')}>
            <Text style={styles.primaryBtnText}>Ameliorer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-home" />
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
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podium: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  podiumCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
  },
  medal: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  medalText: { color: '#fff', fontWeight: '700' },
  avatar: { width: 60, height: 60, borderRadius: 20, backgroundColor: '#E5E7EB' },
  podiumName: { color: palette.text, fontWeight: '700', textAlign: 'center' },
  podiumMeta: { color: palette.gray, fontSize: 12 },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  tab: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  tabActive: { backgroundColor: '#FFF3EC', borderColor: palette.primary },
  tabText: { color: palette.gray, fontWeight: '700' },
  tabTextActive: { color: palette.primary },
  row: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { color: palette.primary, fontWeight: '700' },
  name: { color: palette.text, fontWeight: '700', fontSize: 15 },
  meta: { color: palette.gray, fontSize: 13 },
  stat: { alignItems: 'center', gap: 4 },
  statText: { color: palette.text, fontWeight: '700' },
  badge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: palette.accent, fontWeight: '700', fontSize: 12 },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
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
