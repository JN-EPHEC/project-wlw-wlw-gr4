import React, { useMemo, useState, useEffect } from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useCommunityMessages } from '@/hooks/useCommunityMessages';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useMessagesWithUserInfo } from '@/hooks/useMessagesWithUserInfo';
import { useClubPermissions } from '@/hooks/useClubPermissions';
import { notifyNewMessage } from '@/utils/notificationHelpers';

const palette = {
  primary: '#41B6A6',
  terracotta: '#F28B6F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type ChatMessage = {
  id: string;
  createdBy: string;
  text: string;
  createdAt: number;
  isClubStaff: boolean;
  userName?: string;
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubChannelChat'>;

export default function ClubChannelChatScreen({ navigation, route }: Props) {
  const { clubId, channelId, channelName } = route.params;
  const { user, profile } = useAuth();
  const [value, setValue] = useState('');

  console.log('🚀 [ClubChannelChat] Component MOUNTED - channelId:', channelId, 'channelName:', channelName);
  console.log('🚀 [ClubChannelChat] clubId RECEIVED:', clubId, 'Type:', typeof clubId);

  // Get messages and send functionality
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendMessage,
    isSending,
  } = useCommunityMessages(channelId, user?.uid || '', 30);

  console.log('💬 [ClubChannelChat] Received', messages.length, 'messages from hook');

  // Enrichir les messages avec les infos utilisateur depuis Firestore
  const { messagesWithInfo } = useMessagesWithUserInfo(messages);

  console.log('✅ [ClubChannelChat] Enriched messages:', messagesWithInfo.length, 'with user info');

  // Get community members to check permissions (clubId peut être undefined, utiliser || '')
  const { members, loading: membersLoading } = useCommunityMembers(clubId || '');

  // Get club permissions for current user
  const { permissions, loading: permissionsLoading } = useClubPermissions(
    clubId || '',
    user?.uid || '',
    (profile as any)?.role || 'user',
    []
  );

  const isAnnouncementChannel = useMemo(
    () => channelName?.toLowerCase().includes('annonce'),
    [channelName]
  );

  // Format messages pour l'affichage - utiliser messagesWithInfo qui a déjà les noms
  const displayMessages: ChatMessage[] = messagesWithInfo.map((msg) => {
    const fullName = msg.userFirstName || msg.userLastName 
      ? `${msg.userFirstName || ''} ${msg.userLastName || ''}`.trim()
      : msg.userName || 'Utilisateur';
    
    console.log('📝 [ClubChannelChat] Message from userId:', msg.createdBy, '=> Name:', fullName);
    
    return {
      id: msg.id,
      createdBy: msg.createdBy,
      text: msg.text,
      createdAt: msg.createdAt,
      isClubStaff: members.some((m) => m.id === msg.createdBy),
      userName: fullName,
    };
  });

  const handleSend = async () => {
    if (!value.trim()) return;

    // Check permissions for announcements
    if (isAnnouncementChannel && !permissions.canPostInAnnouncements) {
      alert("Vous n'avez pas la permission de publier une annonce");
      return;
    }

    await sendMessage(value.trim());
    
    // ✅ Créer notification CLUB pour le nouveau message
    if (clubId) {
      try {
        await notifyNewMessage(
          clubId,  // recipientId = CLUB ID
          channelId,  // messageId = CHANNEL ID
          (profile as any)?.displayName || 'Un utilisateur',  // senderName
          value.trim().substring(0, 50),  // messagePreview
          user?.uid || '',  // senderId
          channelId  // chatRoomId
        );
      } catch (notifErr) {
        console.warn('Avertissement: notification message club non créée:', notifErr);
      }
    }

    // ✅ Créer notification OWNER (user) pour le nouveau message
    if (user?.uid) {
      try {
        await notifyNewMessage(
          user.uid,  // recipientId = OWNER/USER ID
          channelId,  // messageId = CHANNEL ID
          channelName || 'le canal',  // senderName (channel name)
          value.trim().substring(0, 50),  // messagePreview
          user.uid,  // senderId
          channelId  // chatRoomId
        );
      } catch (notifErr) {
        console.warn('Avertissement: notification message owner non créée:', notifErr);
      }
    }
    
    setValue('');
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
      <View
        style={[
          styles.header,
          isAnnouncementChannel
            ? { backgroundColor: palette.terracotta }
            : { backgroundColor: '#4B5563' },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {isAnnouncementChannel ? (
              <MaterialCommunityIcons name="bell-outline" size={18} color="#fff" />
            ) : (
              <MaterialCommunityIcons name="pound" size={18} color="#fff" />
            )}
            <Text style={styles.headerTitle}>{channelName}</Text>
          </View>
          <Text style={styles.headerSub}>{members.length} membres</Text>
        </View>
      </View>

      {messagesLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.messages}
          contentContainerStyle={{ padding: 16, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {displayMessages.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <MaterialCommunityIcons name="chat-outline" size={48} color={palette.gray} />
              <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14 }}>
                Aucun message pour le moment
              </Text>
            </View>
          ) : (
            displayMessages.map((msg) => {
              const userInitials = msg.userName
                ? msg.userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : 'U';
              
              return (
                <View key={msg.id} style={styles.messageRow}>
                  <View style={[styles.avatar, msg.isClubStaff && styles.avatarStaff]}>
                    <Text style={styles.avatarText}>{userInitials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Text style={styles.user}>{msg.userName}</Text>
                      {msg.isClubStaff ? (
                        <View style={styles.roleBadge}>
                          <Text style={styles.roleText}>Équipe</Text>
                        </View>
                      ) : null}
                      <Text style={styles.time}>{formatTime(msg.createdAt)}</Text>
                    </View>
                    <View style={styles.bubble}>
                      <Text style={styles.bubbleText}>{msg.text}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      <View style={styles.inputBar}>
        {isAnnouncementChannel ? (
          <View style={styles.notice}>
            <MaterialCommunityIcons name="bell-outline" size={16} color={palette.terracotta} />
            <Text style={styles.noticeText}>
              Vous publiez une annonce officielle - Tous les membres seront notifiés
            </Text>
          </View>
        ) : null}
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="attach" size={20} color={palette.gray} />
          </TouchableOpacity>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={
              isAnnouncementChannel
                ? permissions.canPostInAnnouncements
                  ? 'Écrivez une annonce...'
                  : 'Vous ne pouvez pas poster ici'
                : 'Écrivez un message...'
            }
            placeholderTextColor={palette.gray}
            style={styles.input}
            editable={!isSending}
          />
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="happy-outline" size={20} color={palette.gray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sendBtn,
              isAnnouncementChannel
                ? { backgroundColor: palette.terracotta }
                : { backgroundColor: palette.primary },
              isSending && { opacity: 0.6 },
            ]}
            onPress={handleSend}
            activeOpacity={0.9}
            disabled={isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: '#E5E7EB', fontSize: 12 },
  messages: { flex: 1 },
  messageRow: { flexDirection: 'row', gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarStaff: {
    backgroundColor: '#FDF5E6',
  },
  avatarText: { color: palette.text, fontWeight: '700' },
  user: { color: palette.text, fontWeight: '700' },
  roleBadge: {
    backgroundColor: palette.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  time: { color: palette.gray, fontSize: 12 },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleText: { color: palette.text },
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FDF5E6',
    borderLeftWidth: 3,
    borderLeftColor: palette.terracotta,
    marginBottom: 8,
  },
  noticeText: { color: palette.text, fontSize: 12, flex: 1 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
