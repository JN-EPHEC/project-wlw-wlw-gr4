import React, { useMemo, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Timestamp } from 'firebase/firestore';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import BookingDetailModal from '@/components/BookingDetailModal';
import AddCourseModal from '@/components/AddCourseModal';
import { useAuth } from '@/context/AuthContext';
import { TeacherStackParamList } from '@/navigation/types';
import { useEnrichedEducatorBookings } from '@/hooks/useEnrichedEducatorBookings';
import { BookingDisplay } from '@/types/Booking';

const palette = {
  primary: '#E39A5C',
  primaryDark: '#D48242',
  accent: '#2F9C8D',
  text: '#1F2937',
  textSecondary: '#6B7280',
  background: '#F7F4F0',
  surface: '#FFFFFF',
  border: '#E6E2DD',
  success: '#16A34A',
  warning: '#F59E0B',
};

type TabKey = 'today' | 'upcoming' | 'past';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'upcoming', label: 'À venir' },
  { key: 'past', label: 'Rendez-vous passés' },
];

export default function TeacherAppointmentsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  const [selectedBooking, setSelectedBooking] = useState<BookingDisplay | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addCourseModalVisible, setAddCourseModalVisible] = useState(false);
  
  const { profile } = useAuth();
  const educatorProfile = (profile as any)?.profile || {};
  const educatorId = educatorProfile?.educatorId || (profile as any)?.educatorId || '';
  const { bookings, loading, error } = useEnrichedEducatorBookings(educatorId);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const todayBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const sessionDate = booking.sessionDate instanceof Timestamp
        ? booking.sessionDate.toDate()
        : new Date(booking.sessionDate);
      return sessionDate >= todayStart && sessionDate < todayEnd;
    });
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const sessionDate = booking.sessionDate instanceof Timestamp
        ? booking.sessionDate.toDate()
        : new Date(booking.sessionDate);
      return sessionDate >= todayEnd;
    });
  }, [bookings]);

  const pastBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const sessionDate = booking.sessionDate instanceof Timestamp
        ? booking.sessionDate.toDate()
        : new Date(booking.sessionDate);
      return sessionDate < todayStart;
    }).sort((a, b) => {
      const dateA = a.sessionDate instanceof Timestamp ? a.sessionDate.toDate() : new Date(a.sessionDate);
      const dateB = b.sessionDate instanceof Timestamp ? b.sessionDate.toDate() : new Date(b.sessionDate);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  }, [bookings]);

  const counts = useMemo(
    () => ({
      today: todayBookings.length,
      upcoming: upcomingBookings.length,
      past: pastBookings.length,
    }),
    [todayBookings, upcomingBookings, pastBookings],
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmé', color: palette.success, icon: 'checkmark-circle' as const };
      case 'pending':
        return { label: 'À valider', color: palette.warning, icon: 'hourglass-outline' as const };
      default:
        return { label: 'En attente', color: palette.textSecondary, icon: 'ellipse' as const };
    }
  };

  const formatTime = (date: any): string => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderBooking = (booking: BookingDisplay) => {
    const { label, color, icon } = statusBadge(booking.status);
    return (
      <TouchableOpacity 
        key={booking.id} 
        style={styles.card} 
        onPress={() => {
          setSelectedBooking(booking);
          setModalVisible(true);
        }}
      >
        <View style={styles.cardTimeContainer}>
          <Text style={styles.cardTime}>{formatTime(booking.sessionDate)}</Text>
          <Text style={styles.cardDuration}>{booking.duration}m</Text>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>{booking.title}</Text>
          <Text style={styles.cardSubtitle}>{booking.trainingType}</Text>
          <View style={styles.cardMetaRow}>
            <Ionicons name="location-outline" size={14} color={palette.textSecondary} />
            <Text style={styles.cardMetaText}>{booking.fieldName || 'N/A'}</Text>
          </View>
           <View style={styles.cardMetaRow}>
            <Ionicons name={icon} size={14} color={color} />
            <Text style={[styles.cardMetaText, { color }]}>{label}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={palette.border} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[palette.primary, palette.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={palette.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Planning</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setAddCourseModalVisible(true)}
          >
            <Ionicons name="add" size={22} color={palette.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { borderRightWidth: 1, borderColor: palette.border }]}>
            <Text style={styles.summaryValue}>{counts.today}</Text>
            <Text style={styles.summaryLabel}>RDV Aujourd'hui</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{counts.upcoming}</Text>
            <Text style={styles.summaryLabel}>À venir</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
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
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Erreur: {error}</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {activeTab === 'today' ? (
              todayBookings.length === 0 ? (
                <View style={styles.centered}>
                  <Text style={styles.emptyText}>Aucun rendez-vous aujourd'hui.</Text>
                </View>
              ) : (
                todayBookings.map((booking) => renderBooking(booking))
              )
            ) : activeTab === 'upcoming' ? (
              upcomingBookings.length === 0 ? (
                <View style={styles.centered}>
                  <Text style={styles.emptyText}>Aucun rendez-vous à venir.</Text>
                </View>
              ) : (
                upcomingBookings.map((booking) => renderBooking(booking))
              )
            ) : (
              pastBookings.length === 0 ? (
                <View style={styles.centered}>
                  <Text style={styles.emptyText}>Aucun rendez-vous passé.</Text>
                </View>
              ) : (
                pastBookings.map((booking) => renderBooking(booking))
              )
            )}
          </View>
        )}
      </ScrollView>
      <TeacherBottomNav current="teacher-appointments" />
      
      <BookingDetailModal
        visible={modalVisible}
        booking={selectedBooking}
        onClose={() => {
          setModalVisible(false);
          setSelectedBooking(null);
        }}
        onDelete={() => {
          // Refresh the list when a booking is deleted
          setModalVisible(false);
          setSelectedBooking(null);
        }}
        onModify={(booking) => {
          // TODO: Implement booking modification
          console.log('Modify booking:', booking);
        }}
      />

      <AddCourseModal
        visible={addCourseModalVisible}
        onClose={() => setAddCourseModalVisible(false)}
        educatorId={educatorId}
        clubId={educatorProfile?.clubId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  hero: {
    paddingTop: 6,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.surface,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 130,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -18,
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.primaryDark,
  },
  summaryLabel: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginHorizontal: 16,
    padding: 6,
    borderRadius: 999,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  tabTextActive: {
    color: palette.surface,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardTimeContainer: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFF3EC',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  cardTime: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.primaryDark,
  },
  cardDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.textSecondary,
    marginTop: 2,
  },
  cardDetails: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: palette.textSecondary,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardMetaText: {
    fontSize: 13,
    color: palette.textSecondary,
    fontWeight: '500',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center'
  },
  emptyText: {
    color: palette.textSecondary,
    fontSize: 16,
  },
});
