import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  primaryDark: '#d9a772',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const todayAppointments = [
  { id: 1, time: '10:00', client: 'Marie Dupont', dog: 'Max', service: 'Agility' },
  { id: 2, time: '14:30', client: 'Jean Martin', dog: 'Luna', service: 'Education' },
  { id: 3, time: '16:00', client: 'Sophie Bernard', dog: 'Rex', service: 'Comportement' },
];

const stats = [
  { label: 'Membres', value: '127', icon: 'people-outline' as const },
  { label: 'Auj.', value: '8', icon: 'calendar-outline' as const },
  { label: 'Semaine', value: '34', icon: 'time-outline' as const },
  { label: 'Attente', value: '3', icon: 'alert-circle-outline' as const },
];

const recentActivity = [
  { type: 'booking', message: 'Nouvelle réservation - Marie Dupont', time: 'Il y a 5 min' },
  { type: 'payment', message: 'Paiement reçu - 45€', time: 'Il y a 1 h' },
  { type: 'member', message: 'Nouveau membre - Thomas Petit', time: 'Il y a 2 h' },
  { type: 'message', message: '3 nouveaux messages dans "Annonces"', time: 'Il y a 3 h' },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubHome'>;

export default function ClubHomeScreen({ navigation }: Props) {
  const initials = useMemo(() => 'CC', []);

  const goTo = <T extends keyof ClubStackParamList>(screen: T, params?: ClubStackParamList[T]) => {
    if (params === undefined) {
      navigation.navigate(screen as any);
    } else {
      navigation.navigate(screen as any, params);
    }
  };

  const activityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return '#BFDBFE';
      case 'payment':
        return '#BBF7D0';
      case 'member':
        return '#EDE9FE';
      default:
        return '#FFE4E6';
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
                <Text style={styles.headerHint}>Club Canin Paris 15</Text>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={styles.verified}>
                    <Ionicons name="checkmark-circle" size={14} color="#fff" />
                    <Text style={styles.verifiedText}>Verifié</Text>
                  </View>
                  <Text style={styles.headerSub}>Vue d’ensemble</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.notif}>
              <Ionicons name="notifications-outline" size={20} color={palette.primaryDark} />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Ionicons name={stat.icon} size={18} color={palette.primary} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ padding: 16, gap: 18 }}>
          <View style={styles.boostCard}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <MaterialCommunityIcons name="lightning-bolt" size={18} color="#fff" />
                <View style={styles.premiumChip}>
                  <Text style={styles.premiumChipText}>Premium</Text>
                </View>
              </View>
              <Text style={styles.boostTitle}>Boostez votre visibilité</Text>
              <Text style={styles.boostSub}>
                Apparaissez en tête des résultats et attirez plus de clients.
              </Text>
            </View>
            <TouchableOpacity style={styles.boostButton} activeOpacity={0.9}>
              <Text style={styles.boostButtonText}>Découvrir les offres</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.revenueCard}>
            <View>
              <Text style={styles.revenueLabel}>Revenus du mois</Text>
              <Text style={styles.revenueValue}>2 850€</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="trending-up" size={16} color="#16A34A" />
                <Text style={styles.revenueDelta}>+12% vs mois dernier</Text>
              </View>
            </View>
            <View style={styles.revenueIcon}>
              <MaterialCommunityIcons name="currency-eur" size={28} color="#16A34A" />
            </View>
          </View>

          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Rendez-vous du jour</Text>
              <TouchableOpacity onPress={() => goTo('clubAppointments')}>
                <Text style={styles.link}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10 }}>
              {todayAppointments.map((appt) => (
                <View key={appt.id} style={styles.card}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={styles.iconBadge}>
                      <Ionicons name="time-outline" size={18} color={palette.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.cardTitle}>{appt.time}</Text>
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{appt.service}</Text>
                        </View>
                      </View>
                      <Text style={styles.cardMeta}>{appt.client} · {appt.dog}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <View style={styles.card}>
              <View style={{ gap: 12 }}>
                {recentActivity.map((item, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.activityRow,
                      idx < recentActivity.length - 1 && { borderBottomWidth: 1, borderBottomColor: palette.border },
                    ]}
                  >
                    <View style={[styles.activityDot, { backgroundColor: activityColor(item.type) }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityText}>{item.message}</Text>
                      <Text style={styles.activityTime}>{item.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

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

          <View style={styles.alertCard}>
            <Ionicons name="alert-circle" size={18} color="#EA580C" />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>Attention requise</Text>
              <Text style={styles.alertText}>Vous avez 3 paiements en attente de confirmation.</Text>
            </View>
            <TouchableOpacity onPress={() => goTo('clubPayments')}>
              <Text style={styles.link}>Voir</Text>
            </TouchableOpacity>
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
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '700',
    color: palette.primaryDark,
  },
  headerHint: {
    color: '#F1F5F9',
    fontSize: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSub: {
    color: '#fff',
    fontSize: 12,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  notif: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontWeight: '700',
    color: palette.text,
  },
  statLabel: {
    color: palette.gray,
    fontSize: 11,
  },
  boostCard: {
    backgroundColor: '#F59E0B',
    borderRadius: 18,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  premiumChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  boostTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  boostSub: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 13,
  },
  boostButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  boostButtonText: {
    color: '#C2410C',
    fontWeight: '700',
  },
  revenueCard: {
    backgroundColor: '#ECFDF3',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
  },
  revenueLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  revenueValue: {
    color: '#166534',
    fontSize: 22,
    fontWeight: '700',
  },
  revenueDelta: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '600',
  },
  revenueIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 10,
  },
  link: {
    color: palette.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  cardMeta: {
    color: palette.gray,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FDF5E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: palette.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  activityDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  activityText: {
    color: palette.text,
    fontSize: 14,
  },
  activityTime: {
    color: palette.gray,
    fontSize: 12,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flexBasis: '48%',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionWide: {
    flexBasis: '100%',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  alertCard: {
    backgroundColor: '#FFEDD5',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#EA580C',
  },
  alertTitle: {
    color: '#9A3412',
    fontWeight: '700',
    marginBottom: 4,
  },
  alertText: {
    color: '#9A3412',
    fontSize: 13,
  },
});