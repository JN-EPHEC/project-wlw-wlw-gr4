import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  terracotta: '#F28B6F',
  terracottaDark: '#E67A5F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Announcement = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  isNew: boolean;
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubAnnouncements'>;

export default function ClubAnnouncementsScreen({ navigation }: Props) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '' });
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    if (!draft.title.trim() || !draft.content.trim() || isPublishing) return;
    
    setIsPublishing(true);
    const next: Announcement = {
      id: announcements.length + 1,
      title: draft.title.trim(),
      content: draft.content.trim(),
      author: 'Vous',
      date: 'A l\'instant',
      isNew: true,
    };
    setAnnouncements([next, ...announcements]);
    setDraft({ title: '', content: '' });
    setShowModal(false);
    setIsPublishing(false);
  };

  const stats = {
    total: announcements.length,
    newCount: announcements.filter((a) => a.isNew).length,
    readers: 0,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubCommunity', {})}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Annonces</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="volume-high" size={16} color="#fff" />
              <Text style={styles.headerSub}>Publications officielles du club</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={22} color={palette.terracotta} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Annonces</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.newCount}</Text>
            <Text style={styles.statLabel}>Nouvelles</Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="bell-outline" size={18} color={palette.terracotta} />
            <Text style={styles.sectionTitle}>Toutes les annonces</Text>
          </View>

          {announcements.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="bell-outline" size={48} color={palette.gray} />
              <Text style={styles.emptyText}>Aucune annonce pour le moment</Text>
              <Text style={styles.emptySubText}>Créez votre première annonce pour communiquer avec vos membres</Text>
            </View>
          ) : (
            announcements.map((a) => (
              <View
                key={a.id}
                style={[
                  styles.card,
                  a.isNew && { borderColor: '#F28B6F66', backgroundColor: '#FFF1EB' },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.cardTitle}>{a.title}</Text>
                      {a.isNew ? (
                        <View style={[styles.badge, { backgroundColor: '#F28B6F' }]}>
                          <Text style={[styles.badgeText, { color: '#fff' }]}>Nouveau</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
                <Text style={styles.cardContent}>{a.content}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardMeta}>{a.author}</Text>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.cardMeta}>{a.date}</Text>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity style={styles.iconBtn}>
                    <MaterialCommunityIcons name="pencil-outline" size={16} color={palette.gray} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn}>
                    <MaterialCommunityIcons name="trash-can-outline" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="bell-outline" size={18} color={palette.terracotta} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Annonces officielles</Text>
              <Text style={styles.infoText}>
                Seuls les éducateurs du club peuvent publier des annonces. Tous les membres recevront une notification.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle annonce</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={22} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={styles.label}>Titre de l'annonce</Text>
                <TextInput
                  value={draft.title}
                  onChangeText={(text) => setDraft({ ...draft, title: text })}
                  placeholder="Ex: Nouvelle session de groupe..."
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Contenu</Text>
                <TextInput
                  value={draft.content}
                  onChangeText={(text) => setDraft({ ...draft, content: text })}
                  placeholder="Décrivez votre annonce..."
                  style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                  multiline
                  placeholderTextColor={palette.gray}
                />
              </View>
              <TouchableOpacity 
                style={[styles.publishBtn, isPublishing && { opacity: 0.6 }]} 
                onPress={handlePublish} 
                activeOpacity={0.9}
                disabled={isPublishing}
              >
                <MaterialCommunityIcons name="bell-outline" size={18} color="#fff" />
                <Text style={styles.publishText}>Publier l'annonce</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: palette.terracotta,
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSub: {
    color: '#FFE4D6',
    fontSize: 12,
  },
  createBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
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
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statValue: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 16,
  },
  statLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: palette.border,
    marginHorizontal: 10,
  },
  sectionTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubText: {
    color: palette.gray,
    fontSize: 13,
    textAlign: 'center',
  },
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
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  cardContent: {
    color: palette.text,
    lineHeight: 20,
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardMeta: {
    color: palette.gray,
    fontSize: 12,
  },
  bullet: {
    color: palette.gray,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFF1EB',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F28B6F66',
  },
  infoTitle: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 16,
  },
  label: {
    color: palette.text,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.terracotta,
    paddingVertical: 12,
    borderRadius: 12,
  },
  publishText: {
    color: '#fff',
    fontWeight: '700',
  },
});
