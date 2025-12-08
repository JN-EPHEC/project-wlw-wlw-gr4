import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { UserStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Message = {
  id: number;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isEducator: boolean;
  userRole?: string;
  reactions?: { [emoji: string]: number };
};

const announcementMessages: Message[] = [
  {
    id: 1,
    user: 'Sophie Martin',
    userRole: 'Éducatrice',
    avatar: 'SM',
    message:
      'Nouvelle session de groupe ce samedi !\n\nSession spéciale pour tous les niveaux. Inscriptions ouvertes jusqu’à vendredi soir.\n\nHoraire : 14h-16h\nTarif : 25€',
    time: 'Il y a 2h',
    isEducator: true,
    reactions: { '👍': 12, '🔥': 8 },
  },
  {
    id: 2,
    user: 'Lucas Dubois',
    userRole: 'Éducateur',
    avatar: 'LD',
    message: 'Rappel : le club sera fermé lundi prochain pour maintenance.\n\nMerci de votre compréhension !',
    time: 'Hier',
    isEducator: true,
    reactions: { '👍': 23 },
  },
];

const regularMessages: Message[] = [
  {
    id: 1,
    user: 'Sophie Martin',
    userRole: 'Éducatrice',
    avatar: 'SM',
    message: 'Bonjour à tous ! Rappel important pour la séance de demain.',
    time: '10:30',
    isEducator: true,
  },
  {
    id: 2,
    user: 'Marc Dubois',
    avatar: 'MD',
    message: 'Merci Sophie ! À quelle heure exactement ?',
    time: '10:32',
    isEducator: false,
  },
  {
    id: 3,
    user: 'Sophie Martin',
    userRole: 'Éducatrice',
    avatar: 'SM',
    message: 'À 14h comme d’habitude. N’oubliez pas d’apporter des friandises !',
    time: '10:35',
    isEducator: true,
  },
];

type Props = NativeStackScreenProps<UserStackParamList, 'chatRoom'>;

export default function ChatRoomScreen({ navigation, route }: Props) {
  const { clubId, channelId, channelName } = route.params;
  const [newMessage, setNewMessage] = useState('');
  const isAnnouncement = channelId === 'announcements';
  const messages = isAnnouncement ? announcementMessages : regularMessages;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('clubCommunity', { clubId })} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{channelName ?? (isAnnouncement ? 'Annonces' : 'Salon general')}</Text>
          <Text style={styles.headerSub}>{messages.length} messages</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialCommunityIcons name="dots-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.message, msg.isEducator && styles.messageEducator]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{msg.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.author}>{msg.user}</Text>
                {msg.isEducator ? <View style={styles.badge}><Text style={styles.badgeText}>Éducateur</Text></View> : null}
              </View>
              <Text style={styles.meta}>{msg.time}</Text>
              <Text style={styles.body}>{msg.message}</Text>
              {msg.reactions ? (
                <View style={styles.reactions}>
                  {Object.entries(msg.reactions).map(([emoji, count]) => (
                    <View key={emoji} style={styles.reactionChip}>
                      <Text style={styles.reactionText}>{emoji} {count}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>

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
          placeholder="Écrire un message..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => setNewMessage('')}>
          <Ionicons name="send" size={18} color="#fff" />
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
  reactions: { flexDirection: 'row', gap: 6, marginTop: 6 },
  reactionChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reactionText: { color: palette.text, fontWeight: '600', fontSize: 12 },
  inputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  iconBtnAlt: { padding: 8, borderRadius: 10, backgroundColor: '#fff' },
  sendBtn: {
    backgroundColor: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
