import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';

const palette = {
  primary: '#E9B782',
  primaryDark: '#d9a772',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  orange: '#F59E0B',
  orangeLight: '#FEF3C7',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubHome'>;

interface AppointmentData {
  id: string;
  time: string;
  title: string;
  teacher?: string;
  date?: any;
}

interface ActivityData {
  id: string;
  type: 'booking' | 'member' | 'message' | 'announcement';
  title: string;
  subtitle?: string;
  time: string;
  icon?: string;
}

export default function ClubHomeScreen({ navigation }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const clubProfile = (profile as any)?.profile || {};
  const clubName = clubProfile?.clubName || 'Mon Club';
  const logoUrl = clubProfile?.logoUrl || null;
  
  const [todayAppointments, setTodayAppointments] = useState<AppointmentData[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityData[]>([]);
  const [stats, setStats] = useState({
    members: 0,
    today: 0,
    week: 0,
    pending: 0,
    monthlyRevenue: 2850,
  });
  
  const initials = useMemo(() => {
    const name = clubName || 'MC';
    const words = name.split(' ');
    return words.map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  }, [clubName]);

  // Charger les données au focus
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
      loadActivity();
      refreshProfile?.();
    }, [user?.uid])
  );

  const loadAppointments = async () => {
    if (!user?.uid) return;
    try {
      const appointmentsRef = collection(db, 'appointments');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const q = query(
        appointmentsRef,
        where('clubId', '==', user.uid),
        where('date', '>=', today),
        where('date', '<', tomorrow)
      );

      const snapshot = await getDocs(q);
      const appointments: AppointmentData[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          time: data.startTime || '10:00',
          title: data.service || 'Rendez-vous',
          teacher: data.teacherName || 'Non assigné',
          date: data.date,
        });
      });

      // Trier par heure
      appointments.sort((a, b) => a.time.localeCompare(b.time));
      setTodayAppointments(appointments.slice(0, 3));

      // Compter les stats
      setStats((prev) => ({
        ...prev,
        today: appointments.length,
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    }
  };

  const loadActivity = async () => {
    if (!user?.uid) return;
    try {
      // Charger des activités récentes (bookings récents, nouveaux membres, etc.)
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('clubId', '==', user.uid));
      const snapshot = await getDocs(q);

      const activities: ActivityData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt
          ? data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt)
          : new Date();

        const timeAgo = getTimeAgo(createdAt);
        activities.push({
          id: doc.id,
          type: 'booking',
          title: `Nouvelle réservation - ${data.serviceName || 'Service'}`,
          subtitle: `De ${data.clientName || 'Client'}`,
          time: timeAgo,
          icon: 'calendar',
        });
      });

      // Ajouter quelques activités de mock
      activities.push({
        id: 'activity-2',
        type: 'member',
        title: 'Paiement reçu - 45€',
        subtitle: 'De Jean Martin - Luna',
        time: 'Il y a 1h',
        icon: 'checkmark-circle',
      });

      setRecentActivity(activities.slice(0, 4));
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    return `Il y a ${Math.floor(seconds / 86400)}j`;
  };

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
        {/* Header avec infos du club */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.avatar}>
                {logoUrl ? (
                  <Image source={{ uri: logoUrl }} style={styles.logoImage} />
                ) : (
                  <Text style={styles.avatarText}>{initials}</Text>
                )}
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
            <TouchableOpacity style={styles.notif} onPress={() => goTo('notifications', { previousTarget: 'clubHome' })}>
              <Ionicons name="notifications-outline" size={20} color={palette.primaryDark} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={18} color="#fff" />
              <Text style={styles.statValue}>{stats.members}</Text>
              <Text style={styles.statLabel}>Membres</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar-outline" size={18} color="#fff" />
              <Text style={styles.statValue}>{stats.today}</Text>
              <Text style={styles.statLabel}>Auj.</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={18} color="#fff" />
              <Text style={styles.statValue}>{stats.week}</Text>
              <Text style={styles.statLabel}>Semaine</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="alert-circle-outline" size={18} color="#fff" />
              <Text style={styles.statValue}>{stats.pending}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Section Premium */}
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={16} color="#fff" />
                <Text style={styles.premiumBadgeText}>Premium</Text>
              </View>
              <Text style={styles.premiumTitle}>Booster votre visibilité !</Text>
            </View>
            <Text style={styles.premiumDescription}>
              Améliorez la visibilité de vos annonces et attirez plus de clients
            </Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Ionicons name="flash" size={16} color="#fff" />
              <Text style={styles.premiumButtonText}>Découvrir les offres</Text>
            </TouchableOpacity>
          </View>

          {/* Section Revenus */}
          <View>
            <Text style={styles.sectionTitle}>Revenus du mois</Text>
            <View style={styles.revenueCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.revenueAmount}>2850€</Text>
                <View style={styles.progressBadge}>
                  <Ionicons name="trending-up" size={12} color="#10B981" />
                  <Text style={styles.progressText}>+12% vs mois dernier</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.progressLabel}>Objectif mensuel</Text>
            </View>
          </View>

          {/* Section Rendez-vous du jour */}
          {todayAppointments.length > 0 && (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>Rendez-vous du jour</Text>
                <TouchableOpacity onPress={() => goTo('clubAppointments')}>
                  <Text style={styles.seeAllLink}>Voir tout</Text>
                </TouchableOpacity>
              </View>
              <View style={{ gap: 10 }}>
                {todayAppointments.map((apt) => (
                  <View key={apt.id} style={styles.appointmentCard}>
                    <View style={styles.appointmentTime}>
                      <Text style={styles.appointmentTimeText}>{apt.time}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.appointmentTitle}>{apt.title}</Text>
                      {apt.teacher && (
                        <Text style={styles.appointmentSubtitle}>{apt.teacher}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Section Activité récente */}
          {recentActivity.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Activité récente</Text>
              <View style={{ gap: 12 }}>
                {recentActivity.map((activity) => (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={styles.activityIcon}>
                      <Ionicons name={activity.icon as any} size={18} color={palette.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      {activity.subtitle && (
                        <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                      )}
                    </View>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Section Actions rapides */}
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
                onPress={() => goTo('clubProfile')}
              >
                <Ionicons name="business" size={22} color="#fff" />
                <Text style={styles.actionText}>Mon Club</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
                onPress={() => goTo('clubPayments')}
              >
                <Ionicons name="card" size={22} color="#fff" />
                <Text style={styles.actionText}>Paiements</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section Alerte requise */}
          <View style={styles.alertCard}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={styles.alertIcon}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>Attention requise</Text>
                <Text style={styles.alertDescription}>
                  Vous avez 3 paiements en attente de confirmation
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.alertButton}>
              <Text style={styles.alertButtonText}>Voir les paiements</Text>
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
    backgroundColor: palette.lightGray,
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
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
  content: {
    padding: 16,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  premiumCard: {
    backgroundColor: palette.orange,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  premiumHeader: {
    gap: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  premiumDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  premiumButtonText: {
    color: palette.orange,
    fontSize: 14,
    fontWeight: '600',
  },
  revenueCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: palette.accent,
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.text,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: palette.lightGray,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.accent,
  },
  progressLabel: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 8,
  },
  appointmentCard: {
    backgroundColor: palette.surface,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appointmentTime: {
    backgroundColor: palette.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 50,
  },
  appointmentTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.text,
    textAlign: 'center',
  },
  appointmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  appointmentSubtitle: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 2,
  },
  seeAllLink: {
    fontSize: 12,
    color: palette.accent,
    fontWeight: '600',
  },
  activityItem: {
    backgroundColor: palette.surface,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: palette.orangeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  activitySubtitle: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: palette.gray,
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
  alertCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    gap: 12,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7F1D1D',
  },
  alertDescription: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
  },
  alertButton: {
    borderColor: '#DC2626',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  alertButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
});
