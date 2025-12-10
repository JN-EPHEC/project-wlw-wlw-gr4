import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';

const palette = {
  primary: '#E9B782',
  primaryDark: '#d9a772',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubHome'>;

export default function ClubHomeScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const clubProfile = (profile as any)?.profile || {};
  const clubName = clubProfile?.clubName || 'Mon Club';
  
  const initials = useMemo(() => {
    const name = clubName || 'MC';
    const words = name.split(' ');
    return words.map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  }, [clubName]);

  const goTo = <T extends keyof ClubStackParamList>(screen: T, params?: ClubStackParamList[T]) => {
    if (params === undefined) {
      navigation.navigate(screen as any);
    } else {
      navigation.navigate(screen as any, params);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View>
                <Text style={styles.headerHint}>{clubName}</Text>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={styles.verified}>
                    <Ionicons name="checkmark-circle" size={14} color="#fff" />
                    <Text style={styles.verifiedText}>Verifié</Text>
                  </View>
                  <Text style={styles.headerSub}>Vue d'ensemble</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.notif}>
              <Ionicons name="notifications-outline" size={20} color={palette.primaryDark} />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>0</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {/* Statistiques simplifiées pour V1 */}
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={18} color={palette.primary} />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Membres</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar-outline" size={18} color={palette.primary} />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Auj.</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={18} color={palette.primary} />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Semaine</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="alert-circle-outline" size={18} color={palette.primary} />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Attente</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 16, gap: 18 }}>
          <View>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#41B6A6' }]}
                onPress={() => goTo('clubAppointments')}
              >
                <Ionicons name="calendar" size={22} color="#fff" />
                <Text style={styles.actionText}>Nouveau RDV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#F28B6F' }]}
                onPress={() => goTo('clubCommunity')}
              >
                <Ionicons name="chatbubbles" size={22} color="#fff" />
                <Text style={styles.actionText}>Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#E9B782' }]}
                onPress={() => goTo('clubTeachers')}
              >
                <Ionicons name="people" size={22} color="#fff" />
                <Text style={styles.actionText}>Professeurs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#4B5563' }]}
                onPress={() => goTo('clubProfile')}
              >
                <Ionicons name="business" size={22} color="#fff" />
                <Text style={styles.actionText}>Mon Club</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionWide, { backgroundColor: '#8B5CF6' }]}
                onPress={() => goTo('clubPayments')}
              >
                <Ionicons name="card" size={22} color="#fff" />
                <Text style={styles.actionText}>Paiements</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <ClubBottomNav current="clubHome" />
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  notif: {
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    width: '48%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  actionWide: {
    width: '100%',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
