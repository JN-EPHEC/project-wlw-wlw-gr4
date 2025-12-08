import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  terracotta: '#F28B6F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Channel = {
  id: string;
  name: string;
  description: string;
  type: 'announcement' | 'public' | 'private';
  members: number;
  unread: number;
  lastMessage: string;
  lastTime: string;
};

const channelsSeed: Channel[] = [
  {
    id: 'announcements',
    name: 'Annonces officielles',
    description: 'Seuls les éducateurs peuvent publier',
    type: 'announcement',
    members: 127,
    unread: 3,
    lastMessage: 'Nouvelle session ce samedi...',
    lastTime: 'Il y a 2h',
  },
  {
    id: 'general',
    name: 'Discussion générale',
    description: 'Chat général du club',
    type: 'public',
    members: 127,
    unread: 12,
    lastMessage: "Sophie: Quelqu'un pour une balade...",
    lastTime: 'Il y a 5 min',
  },
  {
    id: 'events',
    name: 'Événements',
    description: 'Organisation des événements',
    type: 'public',
    members: 89,
    unread: 5,
    lastMessage: 'Marc: RDV samedi 10h ?',
    lastTime: 'Il y a 30 min',
  },
  {
    id: 'tips',
    name: 'Astuces & Conseils',
    description: 'Partage de conseils',
    type: 'public',
    members: 102,
    unread: 8,
    lastMessage: 'Emma: Nouveau tutoriel rappel',
    lastTime: 'Il y a 1 h',
  },
  {
    id: 'beginners',
    name: 'Débutants',
    description: 'Questions des nouveaux',
    type: 'public',
    members: 45,
    unread: 2,
    lastMessage: 'Julie: Comment apprendre le assis ?',
    lastTime: 'Il y a 2 h',
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Équipe du club uniquement',
    type: 'private',
    members: 8,
    unread: 0,
    lastMessage: 'Pierre: Réunion demain ?',
    lastTime: 'Hier',
  },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubChannels'>;

export default function ClubChannelsScreen({ navigation }: Props) {
  const [channels, setChannels] = useState<Channel[]>(channelsSeed);
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState({ name: '', description: '', type: 'public' as Channel['type'] });

  const stats = useMemo(
    () => ({
      total: channels.length,
      publics: channels.filter((c) => c.type === 'public').length,
      unread: channels.reduce((sum, c) => sum + c.unread, 0),
    }),
    [channels]
  );

  const goToChannel = (ch: Channel) => {
    navigation.navigate('clubChannelChat', { channelId: ch.id, channelName: ch.name });
  };

  const handleCreate = () => {
    if (!draft.name.trim()) return;
    const next: Channel = {
      id: draft.name.toLowerCase().replace(/\s+/g, '-'),
      name: draft.name.trim(),
      description: draft.description.trim() || 'Nouveau salon',
      type: draft.type,
      members: 0,
      unread: 0,
      lastMessage: 'Nouveau salon créé',
      lastTime: 'À l’instant',
    };
    setChannels([next, ...channels]);
    setDraft({ name: '', description: '', type: 'public' });
    setShowModal(false);
  };

  const renderChannelCard = (channel: Channel, variant: 'announcement' | 'public' | 'private') => {
    const isAnnouncement = variant === 'announcement';
    const isPrivate = variant === 'private';
    const cardStyle =
      isAnnouncement
        ? styles.cardAnnouncement
        : isPrivate
        ? styles.cardPrivate
        : styles.cardDefault;

    return (
      <TouchableOpacity
        key={channel.id}
        style={[styles.card, cardStyle]}
        activeOpacity={0.9}
        onPress={() => goToChannel(channel)}
      >
        <View style={styles.cardIconWrapper}>
          {isAnnouncement ? (
            <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
          ) : isPrivate ? (
            <MaterialCommunityIcons name="lock-outline" size={22} color="#7C3AED" />
          ) : (
            <MaterialCommunityIcons name="pound" size={20} color="#4B5563" />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>{channel.name}</Text>
              <Text
                style={[
                  styles.cardDesc,
                  isAnnouncement && { color: palette.terracotta },
                  isPrivate && { color: '#7C3AED' },
                ]}
              >
                {channel.description}
              </Text>
            </View>
            {channel.unread > 0 ? (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isAnnouncement
                      ? palette.terracotta
                      : isPrivate
                      ? '#7C3AED'
                      : '#EF4444',
                  },
                ]}
              >
                <Text style={[styles.badgeText, { color: '#fff' }]}>{channel.unread}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.cardLast}>{channel.lastMessage}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.cardMeta}>{channel.lastTime}</Text>
            <Text style={styles.cardMeta}>·</Text>
            <Text style={styles.cardMeta}>
              <Ionicons name="people-outline" size={12} color={palette.gray} /> {channel.members}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.gray} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('clubCommunity', {})}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Salons de discussion</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="message-text-outline" size={16} color="#fff" />
              <Text style={styles.headerSub}>Gérez vos salons</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={22} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Salons</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.publics}</Text>
            <Text style={styles.statLabel}>Publics</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.unread}</Text>
            <Text style={styles.statLabel}>Non lus</Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          <View>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="bell-outline" size={18} color={palette.terracotta} />
              <Text style={styles.sectionTitle}>Annonces</Text>
            </View>
            {channels
              .filter((c) => c.type === 'announcement')
              .map((c) => renderChannelCard(c, 'announcement'))}
          </View>

          <View>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="pound" size={18} color="#4B5563" />
              <Text style={styles.sectionTitle}>Salons publics</Text>
            </View>
            <View style={{ gap: 8 }}>
              {channels
                .filter((c) => c.type === 'public')
                .map((c) => renderChannelCard(c, 'public'))}
            </View>
          </View>

          <View>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="lock-outline" size={18} color="#7C3AED" />
              <Text style={styles.sectionTitle}>Salons privés</Text>
            </View>
            <View style={{ gap: 8 }}>
              {channels
                .filter((c) => c.type === 'private')
                .map((c) => renderChannelCard(c, 'private'))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau salon</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={22} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={styles.label}>Nom du salon</Text>
                <TextInput
                  value={draft.name}
                  onChangeText={(text) => setDraft({ ...draft, name: text })}
                  placeholder="Ex: questions-débutants"
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  value={draft.description}
                  onChangeText={(text) => setDraft({ ...draft, description: text })}
                  placeholder="Décrivez le but du salon..."
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  multiline
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Type de salon</Text>
                <View style={styles.typeRow}>
                  {(['public', 'private'] as Channel['type'][]).map((type) => {
                    const active = draft.type === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.typePill, active && styles.typePillActive]}
                        onPress={() => setDraft({ ...draft, type })}
                      >
                        <Text style={[styles.typePillText, active && styles.typePillTextActive]}>
                          {type === 'public' ? 'Public' : 'Privé'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <TouchableOpacity style={styles.publishBtn} onPress={handleCreate} activeOpacity={0.9}>
                <MaterialCommunityIcons name="pound" size={18} color="#fff" />
                <Text style={styles.publishText}>Créer le salon</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#4B5563',
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
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#E5E7EB', fontSize: 12 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { color: palette.text, fontWeight: '700', fontSize: 16 },
  statLabel: { color: palette.gray, fontSize: 12 },
  divider: { width: 1, height: 32, backgroundColor: palette.border, marginHorizontal: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
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
  },
  cardAnnouncement: {
    borderColor: '#F28B6F66',
    backgroundColor: '#FFF1EB',
  },
  cardDefault: {
    borderColor: palette.border,
  },
  cardPrivate: {
    borderColor: '#C4B5FD',
    backgroundColor: '#F5F3FF',
  },
  cardIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  cardDesc: { color: palette.gray, fontSize: 12, marginTop: 2 },
  cardLast: { color: palette.text, marginTop: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  cardMeta: { color: palette.gray, fontSize: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontWeight: '700', fontSize: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  label: { color: palette.text, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
  },
  typeRow: { flexDirection: 'row', gap: 8 },
  typePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
  },
  typePillActive: { backgroundColor: '#ECFEFF', borderColor: palette.primary },
  typePillText: { color: palette.text, fontWeight: '600' },
  typePillTextActive: { color: palette.primary },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4B5563',
    paddingVertical: 12,
    borderRadius: 12,
  },
  publishText: { color: '#fff', fontWeight: '700' },
});
