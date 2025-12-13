import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Timestamp } from 'firebase/firestore';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';
import { useFetchEducatorBookings } from '@/hooks/useFetchEducatorBookings';
import { BookingDisplay } from '@/types/Booking';

const palette = {
  primary: '#F28B6F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  accent: '#41B6A6',
};

type TabKey = 'today' | 'week';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'week', label: 'Semaine' },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 13 },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: { fontSize: 18, fontWeight: '700', color: palette.text },
  statLabel: { color: palette.gray, fontSize: 12, textAlign: 'center' },
  tabs: { flexDirection: 'row', padding: 10, gap: 8 },
  tab: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  tabActive: {
    backgroundColor: '#FFF3EC',
    borderColor: palette.primary,
  },
  tabText: { color: palette.gray, fontWeight: '600' },
  tabTextActive: { color: palette.primary },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
  },
  timeBadge: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFF3EC',
    alignSelf: 'flex-start',
  },
  timeText: { color: palette.primary, fontWeight: '700' },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryText: { color: palette.text, fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});

export default function TeacherAppointmentsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  
  // Get educatorId from user profile - the profile contains the educator ID reference
  const { profile } = useAuth();
  const educatorProfile = (profile as any)?.profile || {};
  const educatorId = educatorProfile?.educatorId || (profile as any)?.educatorId || '';
  const { bookings, loading, error } = useFetchEducatorBookings(educatorId);

  // Separate bookings into today and week
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const weekEnd = new Date(todayEnd);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const todayBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const sessionDate = booking.sessionDate instanceof Timestamp
        ? booking.sessionDate.toDate()
        : new Date(booking.sessionDate);
      return sessionDate >= todayStart && sessionDate < todayEnd;
    });
  }, [bookings]);

  const weekBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const sessionDate = booking.sessionDate instanceof Timestamp
        ? booking.sessionDate.toDate()
        : new Date(booking.sessionDate);
      return sessionDate >= todayEnd && sessionDate < weekEnd;
    });
  }, [bookings]);

  const counts = useMemo(
    () => ({
      today: todayBookings.length,
      week: weekBookings.length,
    }),
    [todayBookings, weekBookings],
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmé', bg: '#DCFCE7', text: '#166534' };
      case 'pending':
        return { label: 'À valider', bg: '#FFF7ED', text: '#9A3412' };
      default:
        return { label: 'En attente', bg: '#E0E7FF', text: '#3730A3' };
    }
  };

  const formatDate = (date: any): string => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
      });
    }
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (date: any): string => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDurationInHours = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const renderBooking = (booking: BookingDisplay) => {
    const badge = statusBadge(booking.status);
    return (
      <TouchableOpacity key={booking.id} style={styles.card} onPress={() => navigation.navigate('teacher-appointments')}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{formatTime(booking.sessionDate)}</Text>
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <View>
            <Text style={styles.cardTitle}>{booking.title}</Text>
            <Text style={styles.cardMeta}>{booking.trainingType}</Text>
            {booking.description && <Text style={styles.cardMeta}>{booking.description}</Text>}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
            </View>
            {booking.maxParticipants > 1 && (
              <Text style={styles.cardMeta}>{booking.currentParticipants}/{booking.maxParticipants} participants</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <><SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Planning</Text>
            <Text style={styles.subtitle}>Centralisez vos sessions et demandes</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickRow}>
          <View style={styles.statCard}>
            <Ionicons name="today-outline" size={18} color={palette.primary} />
            <Text style={styles.statValue}>{counts.today}</Text>
            <Text style={styles.statLabel}>Aujourd'hui</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-week-outline" size={18} color="#16A34A" />
            <Text style={styles.statValue}>{counts.week}</Text>
            <Text style={styles.statLabel}>Semaine</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : error ? (
          <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 16 }}>
            <Text style={{ color: '#DC2626', fontSize: 14 }}>Erreur: {error}</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {activeTab === 'today' ? (
              todayBookings.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                  <Text style={{ color: palette.gray, fontSize: 14 }}>Aucun rendez-vous aujourd'hui</Text>
                </View>
              ) : (
                todayBookings.map((booking) => renderBooking(booking))
              )
            ) : weekBookings.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                <Text style={{ color: palette.gray, fontSize: 14 }}>Aucun rendez-vous cette semaine</Text>
              </View>
            ) : (
              weekBookings.map((booking) => renderBooking(booking))
            )}
          </View>
        )}
      </ScrollView>
          <TeacherBottomNav current="teacher-appointments" />
          </SafeAreaView>
          </>
        );
    }
