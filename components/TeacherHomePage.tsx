import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Timestamp } from 'firebase/firestore';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { useAuth } from '@/context/AuthContext';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { useEnrichedEducatorBookings } from '@/hooks/useEnrichedEducatorBookings';
import { TeacherStackParamList } from '@/navigation/types';
import { BookingDisplay } from '@/types/Booking';

const palette = {
  primary: '#2F9C8D',
  primaryDark: '#277D71',
  primarySoft: '#E6F4F1',
  accent: '#F59E0B',
  text: '#111827',
  textSecondary: '#667085',
  background: '#F3F6F5',
  surface: '#FFFFFF',
  border: '#E3EBEA',
  success: '#16A34A',
};

const nextSessions = [
  { id: 1, time: '09:00', title: 'Coaching chiot', dog: 'Nova', location: 'Parc Monceau', type: 'Solo' },
  { id: 2, time: '11:30', title: 'Agility', dog: 'Rex', location: 'Club Vincennes', type: 'Groupe' },
  { id: 3, time: '15:00', title: 'A la maison', dog: 'Luna', location: 'Boulogne', type: 'Domicile' },
];

const followUps = [
  { id: 1, label: 'Notes a completer', count: 3, icon: 'document-text-outline' as const },
  { id: 2, label: 'Messages non lus', count: 6, icon: 'chatbubble-ellipses-outline' as const },
  { id: 3, label: 'Demandes en attente', count: 2, icon: 'alert-circle-outline' as const },
];

const shortcuts = [
  { id: 'teacher-appointments', label: 'Mon planning', icon: 'calendar-outline' as const },
  { id: 'teacher-community', label: 'Ma communauté', icon: 'people-outline' as const },
  { id: 'teacher-clubs', label: 'Gérer mes clubs', icon: 'shield-checkmark-outline' as const },
];

export default function TeacherHomePage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const initials = useMemo(() => 'SM', []);
  const { user, profile } = useAuth();
  const userId = (user as any)?.uid || '';
  const unreadCount = useUnreadNotificationCount(userId);

  // Get educator ID from profile
  const educatorProfile = (profile as any)?.profile || {};
  const educatorId = educatorProfile?.educatorId || (profile as any)?.educatorId || '';
  
  // Fetch bookings from Firebase
  const { bookings, loading } = useEnrichedEducatorBookings(educatorId);

  // Calculate next appointment (first one not started, regardless of date)
  const nextAppointment = useMemo(() => {
    const now = new Date();
    const upcoming = bookings.filter((booking) => {
      const sessionDate = booking.sessionDate instanceof Timestamp
        ? booking.sessionDate.toDate()
        : new Date(booking.sessionDate);
      return sessionDate >= now && ['pending', 'confirmed', 'completed'].includes(booking.status);
    });
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [bookings]);

  // Calculate today's appointments
  const todayAppointments = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    return bookings.filter((booking) => {
      const sessionDate = booking.sessionDate instanceof Timestamp
        ? booking.sessionDate.toDate()
        : new Date(booking.sessionDate);
      return sessionDate >= todayStart && sessionDate < todayEnd && ['pending', 'confirmed', 'completed'].includes(booking.status);
    }).sort((a, b) => {
      const dateA = a.sessionDate instanceof Timestamp ? a.sessionDate.toDate() : new Date(a.sessionDate);
      const dateB = b.sessionDate instanceof Timestamp ? b.sessionDate.toDate() : new Date(b.sessionDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [bookings]);

  const formatTime = (date: any): string => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBookingType = (booking: BookingDisplay): 'Solo' | 'Groupe' | 'Domicile' => {
    if (booking.type === 'home-based') return 'Domicile';
    if (booking.isGroupCourse) return 'Groupe';
    return 'Solo';
  };

  const handleNavigate = (page: keyof TeacherStackParamList) => {
    navigation.navigate(page as any);
  };

  const typeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Solo':
        return { container: styles.badgeSolo, text: styles.badgeSoloText };
      case 'Groupe':
        return { container: styles.badgeGroupe, text: styles.badgeGroupeText };
      default:
        return { container: styles.badgeDomicile, text: styles.badgeDomicileText };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerWelcome}>Bonjour Sophie</Text>
              <Text style={styles.headerTitle}>Tableau de bord Enseignant</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('notifications', { previousTarget: 'teacher-home' })}
            >
              <Ionicons name="notifications-outline" size={24} color={palette.surface} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.statsPanel}>
            <View style={styles.statsGrid}>
              {followUps.map((item) => (
                <View key={item.id} style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Ionicons name={item.icon} size={18} color={palette.surface} />
                  </View>
                  <Text style={styles.statValue}>{item.count}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.container}>
          <View style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <View style={styles.focusIcon}>
                <Ionicons name="calendar-outline" size={18} color={palette.primary} />
              </View>
              <Text style={styles.focusLabel}>Prochain RDV</Text>
            </View>
            {loading ? (
              <ActivityIndicator size="small" color={palette.primary} />
            ) : nextAppointment ? (
              <>
                <Text style={styles.focusTitle}>{nextAppointment.title} - {nextAppointment.participantInfo?.[0]?.dog || 'N/A'}</Text>
                <Text style={styles.focusMeta}>{formatTime(nextAppointment.sessionDate)} - {nextAppointment.fieldName}</Text>
                <TouchableOpacity 
                  style={styles.focusButton} 
                  onPress={() => navigation.navigate('teacher-appointment-detail', { bookingId: nextAppointment.id })}
                >
                  <Text style={styles.focusButtonText}>Voir les détails</Text>
                  <Ionicons name="arrow-forward" size={16} color={palette.surface} />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={[styles.focusTitle, { color: palette.textSecondary }]}>Aucun rendez-vous prévu</Text>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Planning du jour</Text>
              <TouchableOpacity onPress={() => handleNavigate('teacher-appointments')}>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={palette.primary} />
              </View>
            ) : todayAppointments.length === 0 ? (
              <Text style={[styles.sessionMeta, { textAlign: 'center', paddingVertical: 20 }]}>
                Aucun rendez-vous aujourd'hui
              </Text>
            ) : (
              <View style={styles.agenda}>
                {todayAppointments.map((session) => {
                  const bookingType = getBookingType(session);
                  const badgeStyle = typeBadgeStyle(bookingType);
                  return (
                    <TouchableOpacity 
                      key={session.id} 
                      style={styles.sessionCard}
                      onPress={() => navigation.navigate('teacher-appointment-detail', { bookingId: session.id })}
                    >
                      <View style={styles.sessionTimeContainer}>
                        <Text style={styles.sessionTime}>{formatTime(session.sessionDate)}</Text>
                      </View>
                      <View style={styles.sessionDetails}>
                        <View style={styles.sessionHeader}>
                          <Text style={styles.sessionTitle}>{session.title}</Text>
                          <View style={[styles.badgeBase, badgeStyle.container]}>
                            <Text style={[styles.badgeText, badgeStyle.text]}>{bookingType}</Text>
                          </View>
                        </View>
                        <Text style={styles.sessionMeta}>
                          {session.participantInfo?.[0]?.dog || 'N/A'} @ {session.fieldName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accès rapide</Text>
            <View style={styles.shortcutsGrid}>
              {shortcuts.map((action) => (
                <TouchableOpacity key={action.id} style={styles.shortcutCard} onPress={() => handleNavigate(action.id as keyof TeacherStackParamList)}>
                  <View style={styles.shortcutIcon}>
                    <Ionicons name={action.icon} size={20} color={palette.primary} />
                  </View>
                  <Text style={styles.shortcutLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <LinearGradient
            colors={[palette.accent, '#F97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.section, styles.communitySection]}
          >
            <View style={styles.communityIconContainer}>
              <MaterialCommunityIcons name="forum-outline" size={32} color={palette.surface} />
            </View>
            <Text style={styles.communityTitle}>Communauté active</Text>
            <Text style={styles.communitySubtitle}>3 questions attendent votre expertise aujourd'hui.</Text>
            <TouchableOpacity style={styles.communityButton} onPress={() => handleNavigate('teacher-community')}>
              <Text style={styles.communityButtonText}>Répondre aux questions</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerWelcome: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.surface,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  notificationBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: palette.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.primary,
  },
  notificationBadgeText: {
    color: palette.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statsPanel: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  focusCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  focusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  focusLabel: {
    color: palette.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 4,
  },
  focusMeta: {
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: 12,
  },
  focusButton: {
    backgroundColor: palette.primary,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  focusButtonText: {
    color: palette.surface,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.surface,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.primaryDark,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  shortcutCard: {
    width: '48%',
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'flex-start',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  shortcutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    textAlign: 'left',
  },
  agenda: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sessionTimeContainer: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primarySoft,
    borderRadius: 14,
    marginRight: 12,
    minWidth: 64,
  },
  sessionTime: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.primaryDark,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  sessionMeta: {
    fontSize: 13,
    color: palette.textSecondary,
  },
  badgeBase: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeSolo: {
    backgroundColor: '#FEF3C7',
  },
  badgeSoloText: {
    color: '#92400E',
  },
  badgeGroupe: {
    backgroundColor: '#DBEAFE',
  },
  badgeGroupeText: {
    color: '#1E40AF',
  },
  badgeDomicile: {
    backgroundColor: '#D1FAE5',
  },
  badgeDomicileText: {
    color: '#065F46',
  },
  communitySection: {
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  communityIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.surface,
    marginBottom: 4,
  },
  communitySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  communityButton: {
    backgroundColor: palette.surface,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  communityButtonText: {
    color: '#C2410C',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


