import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import { UserStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useCommunityMessages } from '@/hooks/useCommunityMessages';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useClubPermissions } from '@/hooks/useClubPermissions';
import { useMessagesWithUserInfo } from '@/hooks/useMessagesWithUserInfo';
import { notifyNewMessage } from '@/utils/notificationHelpers';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'chatRoom'>;

export default function ChatRoomScreen({ navigation, route }: Props) {
  const { clubId, channelId, channelName } = route.params;
  const { user, profile } = useAuth();
  const [newMessage, setNewMessage] = useState('');

  // Get messages and send functionality
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendMessage,
    isSending,
  } = useCommunityMessages(channelId, user?.uid || '', 30);

  // Enrichir les messages avec les infos utilisateur
  const { messagesWithInfo } = useMessagesWithUserInfo(messages);

  // Get community members
  const { members, loading: membersLoading } = useCommunityMembers(clubId);

  // Get permissions
  const { permissions, loading: permissionsLoading } = useClubPermissions(
    clubId,
    user?.uid || '',
    (profile as any)?.role || 'user',
    []
  );

  const isAnnouncement = useMemo(
    () => channelName?.toLowerCase().includes('annonce'),
    [channelName]
  );

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    if (isAnnouncement && !permissions.canPostInAnnouncements) {
      alert("Vous n'avez pas la permission de publier une annonce");
      return;
    }

    await sendMessage(newMessage.trim());
    
    // Send notification to other members about new message
    try {
      const members = await useCommunityMembers(); // Get club members from hook
      // Filter out sender and notify others
      const otherMembers = members?.filter((m: any) => m.userId !== user?.uid);
      if (otherMembers && otherMembers.length > 0) {
        for (const member of otherMembers) {
          await notifyNewMessage(
            member.userId,
            clubId,
            profile?.name || 'Un utilisateur',
            channelName || 'le canal'
          );
        }
      }
    } catch (notifErr) {
      console.warn('Erreur création notification:', notifErr);
    }
    
    setNewMessage('');
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {channelName ?? (isAnnouncement ? 'Annonces' : 'Salon général')}
          </Text>
          <Text style={styles.headerSub}>{messagesWithInfo.length} messages</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialCommunityIcons name="dots-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {messagesLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {messages.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <MaterialCommunityIcons name="chat-outline" size={48} color={palette.gray} />
              <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14 }}>
                Aucun message pour le moment
              </Text>
            </View>
          ) : (
            messagesWithInfo.map((msg) => {
              const member = members.find((m) => m.id === msg.createdBy);
              const role = member?.role || 'member';
              
              // Déterminer le label du rôle
              let roleBadge = '';
              if (role === 'owner' || role === 'club') {
                roleBadge = 'Propriétaire';
              } else if (role === 'educator') {
                roleBadge = 'Éducateur';
              } else if (role === 'member') {
                roleBadge = 'Membre';
              }
              
              const shouldShowBadge = !!roleBadge && role !== 'member';
              
              return (
                <View key={msg.id} style={[styles.message]}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{msg.userFirstName?.substring(0, 1).toUpperCase() || msg.createdBy.substring(0, 1).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.author}>{msg.userName}</Text>
                      {shouldShowBadge ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{roleBadge}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.meta}>{formatTime(msg.createdAt)}</Text>
                    <Text style={styles.body}>{msg.text}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.iconBtnAlt}>
          <Ionicons name="happy-outline" size={20} color={palette.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtnAlt}>
          <Ionicons name="attach-outline" size={20} color={palette.gray} />
        </TouchableOpacity>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={
            isAnnouncement
              ? permissions.canPostInAnnouncements
                ? 'Écrivez une annonce...'
                : 'Vous ne pouvez pas poster ici'
              : 'Écrire un message...'
          }
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          editable={!isSending}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, isSending && { opacity: 0.6 }]}
          onPress={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
  content: { padding: 16, gap: 12, paddingBottom: 80 },
  message: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  messageEducator: { borderColor: palette.primary },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.primary, fontWeight: '700' },
  author: { color: palette.text, fontWeight: '700', fontSize: 15 },
  badge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: palette.primary, fontWeight: '700', fontSize: 11 },
  meta: { color: palette.gray, fontSize: 12 },
  body: { color: palette.text, fontSize: 14, marginTop: 4 },
  inputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderColor: palette.border,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
    maxHeight: 100,
  },
  iconBtnAlt: { padding: 8, borderRadius: 10, backgroundColor: '#fff' },
  sendBtn: {
    backgroundColor: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
