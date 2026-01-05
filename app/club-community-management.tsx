import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';
import { useCommunityChannels } from '@/hooks/useCommunityChannels';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useClubEvents } from '@/hooks/useClubEvents';
import { useAuth } from '@/context/AuthContext';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubCommunity'>;

export default function ClubCommunityManagementScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  // On récupère le clubId depuis la route, le profil ou du contexte
  const clubId = (route.params as any)?.clubId || (profile as any)?.clubId || user?.uid || '';
  
  const { channels, loading: channelsLoading } = useCommunityChannels(clubId);
  const { members, loading: membersLoading } = useCommunityMembers(clubId);
  const { events, loading: eventsLoading } = useClubEvents(clubId);

  if (channelsLoading || membersLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const handleNavigate = (screen: keyof ClubStackParamList, params?: object) =>
    navigation.navigate({ name: screen, params: params as any });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Ma communauté</Text>
              <Text style={styles.headerSub}>{channels.length} canaux • {members.length} membres</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickRow}>
          <View style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <Ionicons name="people-outline" size={16} color={palette.primary} />
              <Text style={styles.quickValue}>{members.length}</Text>
            </View>
            <Text style={styles.quickLabel}>Membres</Text>
          </View>
          <View style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <MaterialCommunityIcons name="pound" size={16} color={palette.primary} />
              <Text style={styles.quickValue}>{channels.length}</Text>
            </View>
            <Text style={styles.quickLabel}>Canaux</Text>
          </View>
        </View>

        <View style={styles.container}>
          {/* Annonces */}
          <TouchableOpacity
            style={[styles.card, styles.cardTerracotta]}
            activeOpacity={0.9}
            onPress={() => handleNavigate('clubAnnouncements', { clubId })}
          > 
            <View style={[styles.cardIconGray, { backgroundColor: '#F28B6F' }]}>
              <MaterialCommunityIcons name="bell-outline" size={28} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Annonces</Text>
              </View>
              <Text style={styles.cardMeta}>Gérez les annonces officielles du club</Text>
              <Text style={[styles.cardMeta, { color: '#F97316' }]}>
                {channels.filter((c) => c.type === 'announcements').length} canal(aux)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>

          {/* Salons de discussion */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleNavigate('clubChannels')}
          >
            <View style={styles.cardIconGray}>
              <MaterialCommunityIcons name="pound" size={28} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Salons de discussion</Text>
              </View>
              <Text style={styles.cardMeta}>Discutez avec vos membres</Text>
              <Text style={styles.cardMeta}>
                {channels.filter((c) => c.type === 'chat').length} salon(s) actif(s)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>

          {/* Événements */}
          <TouchableOpacity
            style={[styles.card, styles.cardEvents]}
            activeOpacity={0.9}
            onPress={() => handleNavigate('clubEventsManagement', { clubId })}
          >
            <View style={styles.cardIconEvents}>
              <MaterialCommunityIcons name="calendar" size={28} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Événements</Text>
                <View style={[styles.badge, { backgroundColor: '#41B6A6' }]}>
                  <Text style={[styles.badgeText, { color: '#fff' }]}>{events.length}</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>Créez et gérez vos événements</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>

          {/* Membres */}
          <TouchableOpacity
            style={[styles.card, styles.cardPurple]}
            activeOpacity={0.9}
            onPress={() => handleNavigate('clubMembers')}
          >
            <View style={styles.cardIconPurple}>
              <Ionicons name="people" size={26} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Membres</Text>
                <View style={[styles.badge, { backgroundColor: '#7C3AED' }]}>
                  <Text style={[styles.badgeText, { color: '#fff' }]}>{members.length}</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>Gérez les membres de votre communauté</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ClubBottomNav current="clubCommunity" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  quickItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
  },
  quickIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickValue: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.primary,
  },
  quickLabel: {
    fontSize: 12,
    color: palette.gray,
    fontWeight: '500',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  cardTerracotta: {
    borderLeftWidth: 4,
    borderLeftColor: '#F28B6F',
  },
  cardPurple: {
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  cardEvents: {
    borderLeftWidth: 4,
    borderLeftColor: '#41B6A6',
  },
  cardIconEvents: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#41B6A6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconGray: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconPurple: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  cardMeta: {
    fontSize: 12,
    color: palette.gray,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: palette.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
