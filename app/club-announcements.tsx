import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { ClubStackParamList } from '@/navigation/types';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
    error: '#DC2626',
};

type Announcement = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
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
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: draft.title.trim(),
      content: draft.content.trim(),
      author: 'Vous',
      date: 'À l\'instant',
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setDraft({ title: '', content: '' });
    setShowModal(false);
    setIsPublishing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>Annonces</Text>
                <Text style={styles.headerSub}>{announcements.length} publication(s)</Text>
            </View>
        </View>

        <View style={styles.content}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowModal(true)}>
                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                <Text style={styles.primaryButtonText}>Publier une annonce</Text>
            </TouchableOpacity>

            {announcements.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="bullhorn-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyTitle}>Aucune annonce publiée</Text>
                    <Text style={styles.emptySubtitle}>Les annonces importantes pour vos membres apparaîtront ici.</Text>
                </View>
            ) : (
                announcements.map((a) => (
                    <View key={a.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{a.title}</Text>
                        <Text style={styles.cardContent}>{a.content}</Text>
                        <View style={styles.cardFooter}>
                            <Text style={styles.cardMeta}>{a.author} • {a.date}</Text>
                        </View>
                    </View>
                ))
            )}
        </View>
      </ScrollView>

      <Modal transparent visible={showModal} animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackdrop}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Nouvelle annonce</Text>
                <TextInput value={draft.title} onChangeText={t => setDraft({...draft, title: t})} placeholder="Titre de l'annonce" style={styles.input} />
                <TextInput value={draft.content} onChangeText={t => setDraft({...draft, content: t})} placeholder="Contenu de l'annonce..." style={[styles.input, {height: 120}]} multiline />
                <TouchableOpacity style={[styles.primaryButton, isPublishing && {opacity: 0.7}]} onPress={handlePublish} disabled={isPublishing}>
                    {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Publier</Text>}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 100 },
  header: { backgroundColor: colors.accent, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  content: { padding: 16, gap: 16 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.accent, paddingVertical: 14, borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 8, elevation: 2, shadowColor: colors.shadow },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  cardContent: { fontSize: 15, color: colors.textMuted, lineHeight: 22 },
  cardFooter: { borderTopWidth: 1, borderTopColor: colors.background, paddingTop: 8, marginTop: 8},
  cardMeta: { fontSize: 13, color: colors.textMuted },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  emptySubtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
  // Modal
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: colors.surface, borderRadius: 22, padding: 24, width: '90%', elevation: 5, gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
  input: { backgroundColor: colors.background, borderRadius: 12, padding: 14, fontSize: 15 },
});