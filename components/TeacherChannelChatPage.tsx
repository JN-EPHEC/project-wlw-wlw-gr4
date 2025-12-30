import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { RootRouteName, TeacherRoute, TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  primaryDark: '#E1725A',
  accent: '#2F9C8D',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E6E2DD',
  surface: '#FFFFFF',
  background: '#F7F4F0',
};

const messages = [
  { id: 1, author: 'Client', text: 'Bonjour, quelles dispos pour Nova la semaine prochaine ?', time: '09:12', mine: false },
  { id: 2, author: 'Vous', text: 'Hello, j ai des slots mardi et jeudi matin.', time: '09:14', mine: true },
  { id: 3, author: 'Client', text: 'Jeudi matin parfait, 10h possible ?', time: '09:15', mine: false },
  { id: 4, author: 'Vous', text: 'Oui, je bloque jeudi 10h au parc Monceau.', time: '09:16', mine: true },
  { id: 5, author: 'Systeme', text: 'Rendez-vous cree - en attente de confirmation client', time: '09:16', mine: false, system: true },
];

export default function TeacherChannelChatPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const route = useRoute<RouteProp<TeacherStackParamList, 'teacher-channel-chat'>>();
  const { clubId, channelId } = route.params;

  const handleNavigate = (target: TeacherRoute | RootRouteName) => {
    if (target === 'notifications') {
      navigation.navigate('notifications', { previousTarget: 'teacher-home' });
      return;
    }
    navigation.navigate(target as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[palette.primary, palette.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('teacher-club-community', { clubId, channelId })}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={18} color={palette.surface} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Canal Clients</Text>
            <Text style={styles.subtitle}>{channelId}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleNavigate('notifications')}
            >
              <Ionicons name="notifications-outline" size={18} color={palette.surface} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleNavigate('teacher-account')}
            >
              <Ionicons name="person-circle-outline" size={18} color={palette.surface} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 160, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isMine = msg.mine;
          const isSystem = msg.system;
          return (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                isMine && styles.bubbleMine,
                isSystem && styles.bubbleSystem,
              ]}
            >
              {!isMine && !isSystem && <Text style={styles.author}>{msg.author}</Text>}
              <Text style={[styles.text, isMine && styles.textMine]}>{msg.text}</Text>
              <Text style={[styles.time, isMine && styles.textMine]}>{msg.time}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="add" size={20} color={palette.primary} />
        </TouchableOpacity>
        <TextInput
          placeholder="Repondre au client"
          placeholderTextColor={palette.gray}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <TeacherBottomNav current="teacher-community" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  hero: {
    paddingTop: 6,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 4,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: palette.surface, fontSize: 16, fontWeight: '700' },
  subtitle: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13 },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: palette.surface,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 3,
    borderLeftColor: palette.primary,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFF3EC',
    borderColor: '#FBD0BD',
    borderLeftWidth: 0,
  },
  bubbleSystem: {
    alignSelf: 'center',
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
  },
  author: { color: palette.gray, fontSize: 12, marginBottom: 4 },
  text: { color: palette.text, fontSize: 14 },
  textMine: { color: palette.primaryDark, fontWeight: '700' },
  time: { color: palette.gray, fontSize: 12, marginTop: 6 },
  inputBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 72,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: { flex: 1, paddingVertical: 8, color: palette.text },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
