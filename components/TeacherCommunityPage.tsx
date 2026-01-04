import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';

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

const threads = [
  { id: 1, title: 'Progression de Nova sur le rappel', author: 'Marie D.', replies: 8, time: 'Il y a 2h', tag: 'Suivi client' },
  { id: 2, title: 'Idées de jeux pour chiot réactif', author: 'Forum public', replies: 15, time: 'Il y a 4h', tag: 'Conseils' },
  { id: 3, title: 'Session collective - feedback club', author: 'Club Vincennes', replies: 3, time: 'Il y a 6h', tag: 'Club' },
];

const channels = [
  { id: 'news', label: 'Actus', unread: 2 },
  { id: 'questions', label: 'Questions', unread: 4 },
  { id: 'clubs', label: 'Clubs', unread: 1 },
];

export default function TeacherCommunityPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const [activeChannel, setActiveChannel] = useState('news');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Communauté</Text>
              <Text style={styles.subtitle}>Messages clients et clubs en un seul endroit</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('teacher-home')}>
              <Ionicons name="pencil" size={18} color={palette.surface} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.channels}>
          {channels.map((ch) => {
            const isActive = ch.id === activeChannel;
            return (
              <TouchableOpacity
                key={ch.id}
                style={[styles.channelChip, isActive && styles.channelChipActive]}
                onPress={() => setActiveChannel(ch.id)}
              >
                <Text style={[styles.channelText, isActive && styles.channelTextActive]}>
                  {ch.label}
                </Text>
                {ch.unread > 0 && (
                  <View style={[styles.badge, isActive && { backgroundColor: '#fff' }]}>
                    <Text style={[styles.badgeText, isActive && { color: palette.primary }]}>
                      {ch.unread}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#FFF3EC' }]}
            onPress={() => navigation.navigate('teacher-appointments')}
          >
            <Ionicons name="calendar" size={20} color={palette.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.quickTitle}>Envoyer mes disponibilités</Text>
              <Text style={styles.quickMeta}>2 clients attendent une date</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: '#E0F2F1' }]}
            onPress={() => navigation.navigate('teacher-clubs')}
          >
            <MaterialCommunityIcons name="account-group-outline" size={20} color={palette.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.quickTitle}>Clubs partenaires</Text>
              <Text style={styles.quickMeta}>1 invitation en attente</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {threads.map((thread) => (
            <View key={thread.id} style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{thread.title}</Text>
                  <Text style={styles.cardMeta}>{thread.author} - {thread.time}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{thread.tag}</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={palette.gray} />
                  <Text style={styles.cardMeta}>{thread.replies} réponses</Text>
                </View>
                <TouchableOpacity
                  style={styles.replyButton}
                  onPress={() => navigation.navigate('teacher-community')}
                >
                  <Text style={styles.replyText}>Répondre</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>À suivre</Text>
            <TouchableOpacity onPress={() => navigation.navigate('teacher-appointments')}>
              <Text style={styles.link}>Planifier</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.followCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.dot} />
              <View>
                <Text style={styles.cardTitle}>Compte rendu à envoyer</Text>
                <Text style={styles.cardMeta}>3 sessions sans note</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.replyButton, { marginTop: 12 }]}
              onPress={() => navigation.navigate('teacher-home')}
            >
              <Text style={styles.replyText}>Compléter</Text>
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
    paddingBottom: 20,
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
  subtitle: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13, maxWidth: '80%' },
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
  channels: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: -16,
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  channelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#FAFAF9',
  },
  channelChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryDark,
  },
  channelText: { color: palette.gray, fontWeight: '700' },
  channelTextActive: { color: palette.surface },
  badge: {
    backgroundColor: palette.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  quickActions: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  quickTitle: { fontSize: 15, fontWeight: '700', color: palette.text },
  quickMeta: { color: palette.gray, fontSize: 13 },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  tag: {
    backgroundColor: '#FFF3EC',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: palette.primaryDark, fontWeight: '700', fontSize: 12 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyButton: {
    backgroundColor: palette.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  replyText: { color: '#fff', fontWeight: '700' },
  section: { paddingHorizontal: 16, paddingVertical: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  link: { color: palette.primaryDark, fontWeight: '700' },
  followCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
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
  dot: { width: 10, height: 10, borderRadius: 10, backgroundColor: palette.warning },
});

