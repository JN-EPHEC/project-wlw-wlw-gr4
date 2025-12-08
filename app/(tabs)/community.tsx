import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';
import UserBottomNav from '@/components/UserBottomNav';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const clubs = [
  {
    id: 1,
    name: 'Canin Club Paris',
    image: 'https://images.unsplash.com/photo-1713160848421-bd49a21b09ae?auto=format&fit=crop&w=800&q=80',
    verified: true,
    members: 234,
    unread: 5,
    lastMessage: 'Sophie a partagé une annonce',
    time: 'Il y a 2h',
  },
  {
    id: 2,
    name: 'Agility Pro',
    image: 'https://images.unsplash.com/photo-1631516378357-f87aa5d25769?auto=format&fit=crop&w=800&q=80',
    verified: true,
    members: 156,
    unread: 0,
    lastMessage: 'Lucas: Le cours de demain est confirmé',
    time: 'Hier',
  },
  {
    id: 3,
    name: 'DogSchool Expert',
    image: 'https://images.unsplash.com/photo-1508675801634-7d6a0e5e6cfa?auto=format&fit=crop&w=800&q=80',
    verified: true,
    members: 189,
    unread: 2,
    lastMessage: 'Emma a répondu dans #annonces',
    time: 'Il y a 5h',
  },
];

type CommunityNavigationProp = NativeStackNavigationProp<UserStackParamList, 'community'>;

export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNavigationProp>();
  const totalUnread = clubs.reduce((sum, c) => sum + c.unread, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Communauté</Text>
          <Text style={styles.headerSub}>Vos clubs et groupes</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Ionicons name="people-outline" size={18} color={palette.primary} />
            <Text style={styles.statValue}>{clubs.length}</Text>
            <Text style={styles.statLabel}>Clubs</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.stat}>
            <Ionicons name="chatbubbles-outline" size={18} color={palette.primary} />
            <Text style={styles.statValue}>{totalUnread}</Text>
            <Text style={styles.statLabel}>Non lus</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.stat}>
            <Ionicons name="notifications-outline" size={18} color={palette.primary} />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Événements</Text>
          </View>
        </View>

        {clubs.map((club) => (
          <TouchableOpacity
            key={club.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('clubCommunity', { clubId: club.id })}
          >
            <Image source={{ uri: club.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.title}>{club.name}</Text>
                {club.verified ? <MaterialCommunityIcons name="check-decagram" size={18} color={palette.primary} /> : null}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 }}>
                <Ionicons name="people-outline" size={14} color={palette.gray} />
                <Text style={styles.sub}>{club.members} membres</Text>
                <Ionicons name="time-outline" size={14} color={palette.gray} />
                <Text style={styles.sub}>{club.time}</Text>
              </View>
              <Text style={styles.lastMessage}>{club.lastMessage}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              {club.unread > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{club.unread}</Text>
                </View>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color={palette.gray} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <UserBottomNav current="community" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, gap: 14, paddingBottom: 120 },
  header: { backgroundColor: palette.primary, borderRadius: 18, padding: 16, gap: 4 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: { alignItems: 'center', gap: 4, flex: 1 },
  statValue: { color: palette.text, fontWeight: '700', fontSize: 16 },
  statLabel: { color: palette.gray, fontSize: 12 },
  dividerVertical: { width: 1, height: 36, backgroundColor: palette.border },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  image: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#E5E7EB' },
  title: { color: palette.text, fontWeight: '700', fontSize: 16 },
  sub: { color: palette.gray, fontSize: 12 },
  lastMessage: { color: palette.text, fontSize: 13, marginTop: 2 },
  unreadBadge: {
    backgroundColor: '#F97316',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadText: { color: '#fff', fontWeight: '700', fontSize: 11 },
});
