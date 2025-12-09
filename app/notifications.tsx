import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const initialNotifications = [
  {
    id: 1,
    type: 'rating',
    title: 'Donnez votre avis !',
    message: "Comment s'est passée votre séance au Canin Club Paris ?",
    time: 'Il y a 2 heures',
    isRead: false,
    icon: 'star',
    iconColor: '#E9B782',
    bg: '#FEF3C7',
    bookingId: 501,
  },
  {
    id: 2,
    type: 'club',
    title: 'Réservation confirmée !',
    message: 'Séance du 2 novembre à 14h00 avec Sophie Martin confirmée.',
    time: 'Il y a 3 heures',
    isRead: false,
    icon: 'checkmark-circle',
    iconColor: '#16A34A',
    bg: '#ECFDF3',
    clubId: 101,
    club: { name: 'Canin Club Paris', logo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=200&q=80' },
  },
  {
    id: 3,
    type: 'club',
    title: 'Nouvel événement !',
    message: 'Compétition Agility - Grand Prix 2024 ouverte aux inscriptions.',
    time: 'Hier',
    isRead: false,
    icon: 'trophy',
    iconColor: '#7C3AED',
    bg: '#F3E8FF',
    clubId: 202,
    club: { name: 'Agility Pro', logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80' },
  },
  {
    id: 4,
    type: 'message',
    title: 'Nouveau message !',
    message: 'Sophie vous a écrit dans #conseils.',
    time: 'Il y a 2 jours',
    isRead: true,
    icon: 'chatbubble-ellipses',
    iconColor: '#F28B6F',
    bg: '#FFF7ED',
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'notifications'>;

export default function NotificationsScreen({ navigation, route }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const previousTarget = route.params?.previousTarget;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity
              onPress={() => (previousTarget ? navigation.navigate(previousTarget as any) : navigation.goBack())}
              style={styles.back}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mes notifications</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.headerSub}>
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity style={styles.back} onPress={markAllRead}>
              <Ionicons name="checkmark-done" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {notifications.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[styles.card, { backgroundColor: n.bg }, n.isRead && styles.readCard]}
            activeOpacity={0.9}
            onPress={() => {
              if (n.type === 'rating') {
                navigation.navigate('ratingInvitation', { bookingId: n.bookingId ?? 0, previousTarget: 'notifications' });
              } else if (n.type === 'club') {
                navigation.navigate('clubDetail', { clubId: n.clubId ?? 0 });
              } else {
                navigation.goBack();
              }
            }}
          >
            <View style={[styles.iconWrap, { backgroundColor: n.isRead ? '#E5E7EB' : '#fff' }]}>
              <Ionicons name={n.icon as any} size={18} color={n.iconColor} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.title}>{n.title}</Text>
                {!n.isRead ? <View style={styles.unreadDot} /> : null}
              </View>
              <Text style={styles.message}>{n.message}</Text>
              <Text style={styles.meta}>{n.time}</Text>
              {n.club ? (
                <View style={styles.clubRow}>
                  <Image source={{ uri: n.club.logo }} style={styles.logo} />
                  <Text style={styles.clubName}>{n.club.name}</Text>
                </View>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={16} color={palette.gray} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  readCard: { opacity: 0.7 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: palette.text, fontWeight: '700', fontSize: 15 },
  message: { color: palette.text, fontSize: 13, lineHeight: 18 },
  meta: { color: palette.gray, fontSize: 12 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F97316' },
  clubRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  logo: { width: 28, height: 28, borderRadius: 8 },
  clubName: { color: palette.text, fontWeight: '600', fontSize: 13 },
});
