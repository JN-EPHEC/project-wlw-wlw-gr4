import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { query, where, collection, getDocs } from 'firebase/firestore';

import { ClubStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { useInitializeClubChannels } from '@/hooks/useInitializeClubChannels';
import { useCommunityMessages } from '@/hooks/useCommunityMessages';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useMessagesWithUserInfo } from '@/hooks/useMessagesWithUserInfo';
import { useClubPermissions } from '@/hooks/useClubPermissions';
import { createCommunityChannel } from '@/hooks/useCreateChannel';

const palette = {
  terracotta: '#F28B6F',
  terracottaDark: '#E67A5F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubAnnouncements'>;

export default function ClubAnnouncementsScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  const clubId = (route.params as any)?.clubId || '';
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const creationAttemptRef = useRef<string>(''); // Stocker le clubId pour lequel on a tenté de créer

  // DEBUG: Vérifier la connexion
  useEffect(() => {
    console.log('🔐 [ANNONCES DEBUG]', {
      userId: user?.uid,
      userName: user?.displayName,
      profileRole: (profile as any)?.role,
      profileClubId: (profile as any)?.clubId,
      profileFirstName: (profile as any)?.profile?.firstName || (profile as any)?.firstName,
      profileLastName: (profile as any)?.profile?.lastName || (profile as any)?.lastName,
      routeClubId: clubId,
    });
  }, [user?.uid, profile]);

  // Initialiser les channels par défaut et récupérer les channels du club
  const { channels, loading: channelsLoading, refetch: refetchChannels } = useInitializeClubChannels(clubId, user?.uid || '');
  
  // Trouver le channel d'annonces
  const announcementChannel = useMemo(() => {
    console.log('🔍 [club-announcements] Channels found:', channels.map(ch => ({ id: ch.id, type: ch.type, name: ch.name })));
    return channels.find(ch => ch.type === 'announcements');
  }, [channels]);

  // ✅ Si le channel d'annonces n'existe pas, le créer (UNE SEULE FOIS PAR CLUB)
  useEffect(() => {
    // Vérifier qu'on a déjà tenté pour ce club (pas seulement un boolean)
    if (creationAttemptRef.current === clubId) {
      console.log('⏭️ [club-announcements] Channel creation already attempted for clubId:', clubId);
      return;
    }

    if (!channelsLoading && !announcementChannel && clubId && user?.uid) {
      creationAttemptRef.current = clubId;
      console.log('📱 [club-announcements] Channel "Annonces" manquant, vérification en Firestore...');
      
      // Vérifier que le channel n'existe VRAIMENT pas en Firestore
      const checkAndCreate = async () => {
        try {
          const q = query(
            collection(db, 'channels'),
            where('clubId', '==', clubId),
            where('type', '==', 'announcements')
          );
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            console.log('✅ [club-announcements] Confirme: Channel "Annonces" n\'existe pas, création...');
            const createdChannel = await createCommunityChannel({
              clubId,
              name: 'Annonces',
              description: 'Seuls les propriétaires et éducateurs peuvent publier',
              type: 'announcements',
              createdBy: user.uid,
            });
            console.log('✅ [club-announcements] Channel "Annonces" créé avec succès:', createdChannel?.id);
            // Attendre un peu et recharger les channels
            await new Promise(resolve => setTimeout(resolve, 500));
            refetchChannels?.();
          } else {
            console.log('⚠️ [club-announcements] Le channel "Annonces" existe déjà en Firestore:', snapshot.docs[0].id);
            // Recharger les channels quand même
            refetchChannels?.();
          }
        } catch (error) {
          console.error('❌ [club-announcements] Erreur lors de la vérification/création du channel:', error);
          creationAttemptRef.current = ''; // Réessayer pour un autre club
        }
      };
      
      checkAndCreate();
    }
  }, [channelsLoading, announcementChannel, clubId, user?.uid, refetchChannels]);
  
  // Récupérer les messages du channel d'annonces
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
    deleteMessage,
  } = useCommunityMessages(announcementChannel?.id || '', user?.uid || '');

  // DEBUG: Log quand on a un channel ID
  useEffect(() => {
    if (announcementChannel?.id) {
      console.log('✅ [club-announcements] Channel d\'annonces trouvé:', {
        id: announcementChannel.id,
        name: announcementChannel.name,
        type: announcementChannel.type,
      });
    } else {
      console.log('⚠️ [club-announcements] Pas de channel d\'annonces trouvé');
    }
  }, [announcementChannel?.id]);
  
  // Enrichir les messages avec les infos utilisateur
  const { messagesWithInfo } = useMessagesWithUserInfo(messages);
  
  // Récupérer les membres
  const { members } = useCommunityMembers(clubId);
  
  // Déterminer le rôle de l'utilisateur
  const userRole = (profile as any)?.role || (profile as any)?.profile?.role || 'user';
  
  // Vérifier les permissions
  const { permissions, loading: permissionsLoading } = useClubPermissions(
    clubId,
    user?.uid || '',
    userRole,
    []
  );

  const handlePublish = async () => {
    // Vérifier que titre et contenu sont remplis
    if (!draft.title.trim() || !draft.content.trim()) {
      alert('Veuillez remplir le titre et le contenu');
      return;
    }

    if (isPublishing) return;
    
    console.log('🔍 [handlePublish] Debug info:', {
      canPostInAnnouncements: permissions.canPostInAnnouncements,
      userRole,
      userId: user?.uid,
      clubId,
      announcementChannelId: announcementChannel?.id,
    });
    
    if (!permissions.canPostInAnnouncements) {
      alert(`❌ Vous n'avez pas la permission de publier une annonce.\n\nVotre rôle: ${userRole}\nPermissions: ${JSON.stringify(permissions)}`);
      return;
    }
    
    if (!announcementChannel) {
      alert("Erreur: Canal d'annonces non trouvé");
      return;
    }

    if (!announcementChannel.id) {
      alert("Erreur: ID du canal d'annonces invalide");
      return;
    }
    
    setIsPublishing(true);
    try {
      const fullMessage = `**${draft.title.trim()}**\n\n${draft.content.trim()}`;
      console.log('📝 [handlePublish] Publishing to channel:', announcementChannel.id);
      await sendMessage(fullMessage);
      setDraft({ title: '', content: '' });
      setShowModal(false);
      alert('✓ Annonce publiée avec succès!');
    } catch (err) {
      console.error('Error publishing announcement:', err);
      alert('Erreur lors de la publication de l\'annonce');
    } finally {
      setIsPublishing(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}m`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  // Parser pour extraire le titre et la description du message
  const parseAnnouncementMessage = (text: string) => {
    // Pattern: **titre**\n\ndescription
    const match = text.match(/^\*\*([^*]+)\*\*\s*\n\n(.+)$/s);
    if (match) {
      return {
        title: match[1].trim(),
        description: match[2].trim(),
      };
    }
    // Si pas de format, afficher tout comme description
    return {
      title: '',
      description: text.trim(),
    };
  };

  const stats = {
    total: messagesWithInfo.length,
    newCount: 0, // TODO: Implémenter le tracking des messages lus
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

          {messagesLoading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={palette.terracotta} />
            </View>
          ) : messagesWithInfo.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="bell-outline" size={48} color={palette.gray} />
              <Text style={styles.emptyText}>Aucune annonce pour le moment</Text>
              <Text style={styles.emptySubText}>Créez votre première annonce pour communiquer avec vos membres</Text>
            </View>
          ) : (
            messagesWithInfo.map((msg) => {
              const member = members.find((m) => m.id === msg.createdBy);
              const role = member?.role || 'member';
              const { title, description } = parseAnnouncementMessage(msg.text);
              const displayName = role === 'owner' ? 'Propriétaire du club' : (msg.userName || 'Utilisateur');
              const isAuthor = user?.uid === msg.createdBy;
              
              const handleDeleteAnnouncement = async () => {
                Alert.alert('Supprimer l\'annonce', 'Êtes-vous sûr de vouloir supprimer cette annonce ?', [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await deleteMessage(msg.id);
                        Alert.alert('✓ Annonce supprimée');
                      } catch (err) {
                        Alert.alert('Erreur', 'Erreur lors de la suppression');
                      }
                    },
                  },
                ]);
              };
              
              return (
                <View key={msg.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.author}>{displayName}</Text>
                        {(role === 'owner' || role === 'educator') && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{role === 'owner' ? 'Propriétaire' : 'Éducateur'}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.cardMeta}>{formatTime(msg.createdAt)}</Text>
                    </View>
                    {isAuthor && (
                      <TouchableOpacity onPress={handleDeleteAnnouncement} style={styles.deleteBtn}>
                        <Ionicons name="trash-outline" size={18} color={palette.terracotta} />
                      </TouchableOpacity>
                    )}
                  </View>
                  {title && <Text style={styles.cardTitle}>{title}</Text>}
                  <Text style={styles.cardContent}>{description}</Text>
                </View>
              );
            })
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
            <ScrollView style={{ maxHeight: 500 }} showsVerticalScrollIndicator={false}>
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={styles.label}>Titre de l'annonce</Text>
                  <TextInput
                    value={draft.title}
                    onChangeText={(text) => setDraft({ ...draft, title: text })}
                    placeholder="Entrez le titre..."
                    style={styles.input}
                    placeholderTextColor={palette.gray}
                    editable={!isPublishing}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Contenu de l'annonce</Text>
                  <TextInput
                    value={draft.content}
                    onChangeText={(text) => setDraft({ ...draft, content: text })}
                    placeholder="Décrivez votre annonce..."
                    style={[styles.input, { height: 180, textAlignVertical: 'top' }]}
                    multiline
                    placeholderTextColor={palette.gray}
                    editable={!isPublishing}
                  />
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity 
              style={[styles.publishBtn, (!draft.title.trim() || !draft.content.trim() || isPublishing) && { opacity: 0.6 }]} 
              onPress={handlePublish} 
              activeOpacity={0.9}
              disabled={!draft.title.trim() || !draft.content.trim() || isPublishing}
            >
              <MaterialCommunityIcons name="bell-outline" size={18} color="#fff" />
              <Text style={styles.publishText}>Publier l'annonce</Text>
            </TouchableOpacity>
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
  author: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 14,
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
    backgroundColor: '#FEF0E8',
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 11,
    color: palette.terracotta,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242, 139, 111, 0.1)',
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
