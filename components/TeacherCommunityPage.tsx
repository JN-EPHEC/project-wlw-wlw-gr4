import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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

const threads = [
  { id: 1, title: 'Progression de Nova sur le rappel', author: 'Marie D.', replies: 8, time: 'Il y a 2h', tag: 'Suivi client' },
  { id: 2, title: 'Idees de jeux pour chiot reactive', author: 'Forum public', replies: 15, time: 'Il y a 4h', tag: 'Conseils' },
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
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Communaute</Text>
            <Text style={styles.subtitle}>Messages clients et clubs en un seul endroit</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('teacher-home')}>
            <Ionicons name="pencil" size={18} color={palette.primary} />
          </TouchableOpacity>
        </View>

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
              <Text style={styles.quickTitle}>Envoyer mes dispos</Text>
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
                  <Text style={styles.cardMeta}>{thread.replies} reponses</Text>
                </View>
                <TouchableOpacity
                  style={styles.replyButton}
                  onPress={() => navigation.navigate('teacher-community')}
                >
                  <Text style={styles.replyText}>Repondre</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>A suivre</Text>
            <TouchableOpacity onPress={() => navigation.navigate('teacher-appointments')}>
              <Text style={styles.link}>Planifier</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.followCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.dot} />
              <View>
                <Text style={styles.cardTitle}>Compte rendu a envoyer</Text>
                <Text style={styles.cardMeta}>3 sessions sans note</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.replyButton, { marginTop: 12 }]}
              onPress={() => navigation.navigate('teacher-home')}
            >
              <Text style={styles.replyText}>Completer</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 13, maxWidth: '80%' },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channels: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  channelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
  },
  channelChipActive: {
    backgroundColor: '#FFF3EC',
    borderColor: palette.primary,
  },
  channelText: { color: palette.gray, fontWeight: '700' },
  channelTextActive: { color: palette.primary },
  badge: {
    backgroundColor: palette.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  quickActions: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
  },
  quickTitle: { fontSize: 15, fontWeight: '700', color: palette.text },
  quickMeta: { color: palette.gray, fontSize: 13 },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  tag: {
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: palette.accent, fontWeight: '700', fontSize: 12 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
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
  link: { color: palette.primary, fontWeight: '700' },
  followCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  dot: { width: 10, height: 10, borderRadius: 10, backgroundColor: '#F59E0B' },
});
