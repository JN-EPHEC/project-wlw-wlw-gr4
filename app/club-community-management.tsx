import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubCommunity'>;

export default function ClubCommunityManagementScreen({ navigation }: Props) {

  const stats = {
    announcements: 5,
    unreadAnnouncements: 2,
    upcomingEvents: 4,
    channels: 6,
    members: 127,
    unreadMessages: 30,
  };

  const handleNavigate = (screen: keyof ClubStackParamList, params?: object) =>
    navigation.navigate({ name: screen, params: params as any });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => handleNavigate('clubHome')}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Ma Communaut‚</Text>
              <Text style={styles.headerSub}>G‚rez votre communaut‚</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickRow}>
          <View style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <Ionicons name="people-outline" size={16} color={palette.primary} />
              <Text style={styles.quickValue}>{stats.members}</Text>
            </View>
            <Text style={styles.quickLabel}>Membres</Text>
          </View>
          <View style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <MaterialCommunityIcons name="pound" size={16} color={palette.primary} />
              <Text style={styles.quickValue}>{stats.channels}</Text>
            </View>
            <Text style={styles.quickLabel}>Salons</Text>
          </View>
          <View style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <Ionicons name="chatbubbles-outline" size={16} color={palette.primary} />
              <Text style={styles.quickValue}>{stats.unreadMessages}</Text>
            </View>
            <Text style={styles.quickLabel}>Non lus</Text>
          </View>
        </View>

        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.card, styles.cardTerracotta]}
            activeOpacity={0.9}
            onPress={() => handleNavigate('clubAnnouncements')}
          >
            <View style={styles.cardIconTerracotta}>
              <MaterialCommunityIcons name="bell-outline" size={28} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Annonces</Text>
                {stats.unreadAnnouncements > 0 ? (
                  <View style={[styles.badge, { backgroundColor: '#F28B6F' }]}>
                    <Text style={[styles.badgeText, { color: '#fff' }]}>
                      {stats.unreadAnnouncements} nouvelles
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cardMeta}>Gérez les annonces officielles du club</Text>
              <Text style={[styles.cardMeta, { color: '#F97316' }]}>
                {stats.announcements} annonces publiées
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardTurquoise]}
            activeOpacity={0.9}
            onPress={() => handleNavigate('clubEventsManagement')}
          >
            <View style={styles.cardIconTurquoise}>
              <MaterialCommunityIcons name="calendar-month-outline" size={28} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Événements</Text>
                <View style={[styles.badge, { backgroundColor: '#41B6A6' }]}>
                  <Text style={[styles.badgeText, { color: '#fff' }]}>{stats.upcomingEvents} à venir</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>Créez et gérez vos événements</Text>
              <Text style={[styles.cardMeta, { color: '#0F766E' }]}>Balade en forêt - Sam 28 Oct</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>

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
                {stats.unreadMessages > 0 ? (
                  <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
                    <Text style={[styles.badgeText, { color: '#fff' }]}>{stats.unreadMessages}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cardMeta}>Discutez avec vos membres</Text>
              <Text style={styles.cardMeta}>{stats.channels} salons actifs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>

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
                  <Text style={[styles.badgeText, { color: '#fff' }]}>{stats.members}</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>Gérez les membres de votre communauté</Text>
              <Text style={[styles.cardMeta, { color: '#6D28D9' }]}>Modération et permissions</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, styles.cardTurquoise]}
            activeOpacity={0.9}
            onPress={() => handleNavigate('clubAppointments')}
          >
            <View style={styles.cardIconTurquoise}>
              <Ionicons name="calendar-outline" size={26} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Rendez-vous</Text>
                <View style={[styles.badge, { backgroundColor: '#41B6A6' }]}>
                  <Text style={[styles.badgeText, { color: '#fff' }]}>{stats.upcomingEvents}</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>Consultez les demandes et plannings</Text>
              <Text style={[styles.cardMeta, { color: '#0F766E' }]}>Demandes a domicile incluses</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardTerracotta]}
            activeOpacity={0.9}
            onPress={() => handleNavigate('clubLeaderboard')}
          >
            <View style={styles.cardIconTerracotta}>
              <MaterialCommunityIcons name="trophy-outline" size={28} color="#fff" />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Classement</Text>
              </View>
              <Text style={styles.cardMeta}>Voir votre position inter-clubs</Text>
              <Text style={[styles.cardMeta, { color: '#C2410C' }]}>Booster ma visibilite</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.gray} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSub: {
    color: '#F1F5F9',
    marginTop: 2,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  quickItem: {
    alignItems: 'center',
    gap: 4,
  },
  quickIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickValue: {
    color: palette.text,
    fontWeight: '700',
  },
  quickLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  container: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  },
  cardTerracotta: {
    borderColor: '#F28B6F66',
    backgroundColor: '#FFF1EB',
  },
  cardTurquoise: {
    borderColor: '#41B6A666',
    backgroundColor: '#ECFEFF',
  },
  cardPurple: {
    borderColor: '#C4B5FD',
    backgroundColor: '#F5F3FF',
  },
  cardIconTerracotta: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F28B6F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconTurquoise: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#41B6A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconGray: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconPurple: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  cardMeta: {
    color: palette.gray,
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
