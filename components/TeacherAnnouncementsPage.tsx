import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';
import { useCommunityChannels } from '@/hooks/useCommunityChannels';
import { useCommunityMessages } from '@/hooks/useCommunityMessages';
import { useMessagesWithUserInfo } from '@/hooks/useMessagesWithUserInfo';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useClubPermissions } from '@/hooks/useClubPermissions';
import { useAuth } from '@/context/AuthContext';

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
  terracotta: '#D97706',
};

export default function TeacherAnnouncementsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const route = useRoute<RouteProp<TeacherStackParamList, 'teacher-announcements'>>();
  const clubId = route.params?.clubId || null;
  const { user, profile } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Récupérer les channels du club
  const { channels, loading: channelsLoading } = useCommunityChannels(String(clubId) || '');
  const announcementChannel = useMemo(
    () => channels.find((ch) => ch.type === 'announcements'),
    [channels]
  );

  // Récupérer les messages du channel d'annonces
  const { messages, loading: messagesLoading, sendMessage } = useCommunityMessages(
    announcementChannel?.id || '',
    user?.uid || ''
  );

  // Enrichir les messages avec les infos utilisateur
  const { messagesWithInfo } = useMessagesWithUserInfo(messages);

  // Récupérer les membres du club pour obtenir les infos de rôle
  const { members } = useCommunityMembers(String(clubId) || '');

  // Vérifier les permissions
  const userRole = (profile as any)?.role || 'user';
  const { permissions } = useClubPermissions(String(clubId) || '', user?.uid || '', userRole);
  const canPostAnnouncements = permissions.canPostInAnnouncements;

  const handlePublish = async () => {
    if (!announcementContent.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un message');
      return;
    }

    if (!announcementChannel) {
      Alert.alert('Erreur', 'Channel d\'annonces non trouvé');
      return;
    }

    setIsPublishing(true);
    try {
      await sendMessage(announcementContent.trim());
      setAnnouncementContent('');
      setIsModalVisible(false);
      Alert.alert('Succès', 'Annonce publiée');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de publier l\'annonce');
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const formatDate = (date: Date | { toDate?: () => Date } | any) => {
    const d = date?.toDate ? date.toDate() : date instanceof Date ? date : new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    const isYesterday =
      d.getFullYear() === yesterday.getFullYear() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getDate() === yesterday.getDate();

    if (isToday) return `Aujourd'hui à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    if (isYesterday) return `Hier à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
  };

  // Récupérer le rôle du créateur du message
  const getMessageAuthorRole = (userId: string) => {
    const member = members.find((m) => m.id === userId);
    return member?.role || 'user';
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'owner':
        return '#FEF3E2';
      case 'educator':
        return '#FEF0E8';
      default:
        return '#F0F9FF';
    }
  };

  const getRoleBadgeTextColor = (role?: string) => {
    switch (role) {
      case 'owner':
        return '#B45309';
      case 'educator':
        return palette.terracotta;
      default:
        return '#0369A1';
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color={palette.surface} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Annonces</Text>
            </View>
            {canPostAnnouncements && (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setIsModalVisible(true)}
              >
                <Ionicons name="add" size={22} color={palette.surface} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        <View style={{ padding: 16, gap: 12 }}>
          {messagesLoading || channelsLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={palette.primary} />
            </View>
          ) : messagesWithInfo.length === 0 ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Ionicons name="notifications-off-outline" size={48} color={palette.gray} />
              <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14 }}>
                Aucune annonce pour le moment
              </Text>
            </View>
          ) : (
            messagesWithInfo.map((msg) => {
              const authorRole = getMessageAuthorRole(msg.createdBy);
              return (
                <View key={msg.id} style={styles.announcementCard}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.author}>{msg.userFirstName || 'Anonyme'}</Text>
                      {authorRole && (
                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: getRoleBadgeColor(authorRole) },
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeText,
                              { color: getRoleBadgeTextColor(authorRole) },
                            ]}
                          >
                            {authorRole === 'owner' ? 'Propriétaire' : 'Éducateur'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.cardContent}>{msg.text}</Text>
                  <Text style={styles.cardMeta}>{formatDate(new Date(msg.createdAt))}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <TeacherBottomNav current="teacher-community" />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelBtn}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nouvelle annonce</Text>
            <TouchableOpacity
              onPress={handlePublish}
              disabled={isPublishing}
              style={{ opacity: isPublishing ? 0.5 : 1 }}
            >
              <Text style={styles.publishBtn}>{isPublishing ? '...' : 'Publier'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              placeholder="Tapez votre annonce ici..."
              placeholderTextColor={palette.gray}
              value={announcementContent}
              onChangeText={setAnnouncementContent}
              multiline
              numberOfLines={8}
              style={styles.input}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  modalSafe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backBtn: {
    padding: 8,
  },
  addBtn: {
    padding: 8,
  },
  title: {
    color: palette.surface,
    fontSize: 28,
    fontWeight: '700',
  },
  announcementCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  author: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 14,
  },
  cardContent: {
    color: palette.text,
    lineHeight: 20,
    fontSize: 14,
    marginBottom: 8,
  },
  cardMeta: {
    color: palette.gray,
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 11,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    color: palette.gray,
    fontSize: 14,
    fontWeight: '600',
  },
  publishBtn: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  input: {
    backgroundColor: palette.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 12,
    color: palette.text,
    fontSize: 14,
    textAlignVertical: 'top',
    fontFamily: 'Helvetica',
  },
});
