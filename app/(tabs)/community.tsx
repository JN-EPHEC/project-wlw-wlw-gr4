import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';
import UserBottomNav from '@/components/UserBottomNav';
import { useAuth } from '@/context/AuthContext';
import { useUserClubCommunities } from '@/hooks/useUserClubCommunities';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type CommunityNavigationProp = NativeStackNavigationProp<UserStackParamList, 'community'>;

export default function CommunityScreen() {
  const navigation = useNavigation<CommunityNavigationProp>();
  const { user } = useAuth();

  // Fetch user's club communities
  const { clubs, loading, error } = useUserClubCommunities(user?.uid || '');

  const totalUnread = clubs.reduce((sum, c) => sum + c.unreadCount, 0);

  // Placeholder image for clubs without logo
  const getClubImage = (logoUrl?: string) => {
    return logoUrl || 'https://images.unsplash.com/photo-1713160848421-bd49a21b09ae?auto=format&fit=crop&w=800&q=80';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Communauté</Text>
          <Text style={styles.headerSub}>Vos clubs et groupes</Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 14 }}>
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
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Événements</Text>
            </View>
          </View>

          {clubs.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="chat-outline" size={48} color={palette.gray} />
              <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14 }}>
                Aucun club pour le moment
              </Text>
              <Text style={{ color: palette.gray, marginTop: 4, fontSize: 12 }}>
                Rejoignez un club pour accéder à la communauté
              </Text>
            </View>
          ) : (
            clubs.map((club) => (
              <TouchableOpacity
                key={club.clubId}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => {
                  console.log('🔗 [community] Navigating to clubCommunity with clubId:', club.clubId, 'type:', typeof club.clubId);
                  navigation.navigate('clubCommunity', { clubId: club.clubId });
                }}
              >
                <Image source={{ uri: getClubImage(club.logoUrl) }} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.title}>{club.clubName}</Text>
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={18}
                      color={palette.primary}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 }}>
                    <Ionicons name="people-outline" size={14} color={palette.gray} />
                    <Text style={styles.sub}>{club.members} membres</Text>
                    {club.lastMessageTime && (
                      <>
                        <Ionicons name="time-outline" size={14} color={palette.gray} />
                        <Text style={styles.sub}>{club.lastMessageTime}</Text>
                      </>
                    )}
                  </View>
                  {club.lastMessage && <Text style={styles.lastMessage}>{club.lastMessage}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end', gap: 8 }}>
                  {club.unreadCount > 0 ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{club.unreadCount}</Text>
                    </View>
                  ) : null}
                  <Ionicons name="chevron-forward" size={18} color={palette.gray} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <UserBottomNav current="community" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  content: { paddingBottom: 120 },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 8,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  headerSub: { color: '#fff', fontSize: 16 },
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
