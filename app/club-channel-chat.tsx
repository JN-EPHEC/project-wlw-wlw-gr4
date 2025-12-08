import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  terracotta: '#F28B6F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type ChatMessage = {
  id: number;
  user: string;
  userRole: string;
  message: string;
  time: string;
  isClubStaff: boolean;
};

const seedMessages: ChatMessage[] = [
  {
    id: 1,
    user: 'Éducateur',
    userRole: 'Éducateur',
    message:
      "Bonjour à tous ! N'oubliez pas la session de groupe ce samedi à 14h.",
    time: '10:30',
    isClubStaff: true,
  },
  {
    id: 2,
    user: 'Membre',
    userRole: 'Membre',
    message: 'Bonjour ! Est-ce qu’il faut apporter quelque chose ?',
    time: '10:32',
    isClubStaff: false,
  },
  {
    id: 3,
    user: 'Éducateur',
    userRole: 'Éducateur',
    message: 'Apportez des friandises et de l’eau pour votre chien. On fournit le matériel !',
    time: '10:35',
    isClubStaff: true,
  },
  {
    id: 4,
    user: 'Membre',
    userRole: 'Membre',
    message: 'Super ! Nous serons là.',
    time: '10:40',
    isClubStaff: false,
  },
  {
    id: 5,
    user: 'Membre',
    userRole: 'Membre',
    message:
      "Question : c'est adapté pour un chien réactif ? Mon chien a encore du mal avec les autres chiens...",
    time: '11:15',
    isClubStaff: false,
  },
  {
    id: 6,
    user: 'Éducateur',
    userRole: 'Éducateur',
    message:
      'Oui ! On travaillera justement sur la socialisation. Je serai là pour vous accompagner.',
    time: '11:20',
    isClubStaff: true,
  },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubChannelChat'>;

export default function ClubChannelChatScreen({ navigation, route }: Props) {
  const channelId = route.params.channelId;
  const channelName = route.params.channelName;
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [value, setValue] = useState('');

  const isAnnouncementChannel = useMemo(() => channelId === 'announcements', [channelId]);

  const handleSend = () => {
    if (!value.trim()) return;
    const next: ChatMessage = {
      id: messages.length + 1,
      user: 'Vous',
      userRole: 'Staff',
      message: value.trim(),
      time: 'Maintenant',
      isClubStaff: true,
    };
    setMessages([...messages, next]);
    setValue('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View
        style={[
          styles.header,
          isAnnouncementChannel ? { backgroundColor: palette.terracotta } : { backgroundColor: '#4B5563' },
        ]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubChannels')}>
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
          <Text style={styles.headerSub}>127 membres</Text>
        </View>
      </View>

      <ScrollView
        style={styles.messages}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageRow}>
            <View style={[styles.avatar, msg.isClubStaff && styles.avatarStaff]}>
              <Text style={styles.avatarText}>{msg.user.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <Text style={styles.user}>{msg.user}</Text>
                {msg.isClubStaff ? (
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{msg.userRole}</Text>
                  </View>
                ) : null}
                <Text style={styles.time}>{msg.time}</Text>
              </View>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>{msg.message}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

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
            placeholder={isAnnouncementChannel ? 'Écrivez une annonce...' : 'Écrivez un message...'}
            placeholderTextColor={palette.gray}
            style={styles.input}
          />
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="happy-outline" size={20} color={palette.gray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sendBtn,
              isAnnouncementChannel ? { backgroundColor: palette.terracotta } : { backgroundColor: palette.primary },
            ]}
            onPress={handleSend}
            activeOpacity={0.9}
          >
            <Ionicons name="send" size={18} color="#fff" />
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
