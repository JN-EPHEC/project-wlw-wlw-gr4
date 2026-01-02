import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

import { TeacherStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
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
  danger: '#DC2626',
};

type Props = NativeStackScreenProps<TeacherStackParamList, 'teacher-appointment-detail'>;

export default function TeacherAppointmentDetailScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<BookingDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        console.log('🔍 [teacher-appointment-detail] Fetching booking:', bookingId);

        const bookingDoc = await getDoc(doc(db, 'Bookings', bookingId));
        if (!bookingDoc.exists()) {
          setError('Rendez-vous non trouvé');
          return;
        }

        const data = bookingDoc.data() as BookingDisplay;

        // Fetch field data if available
        let fieldName = 'N/A';
        let fieldAddress = '';
        if (data.fieldId) {
          try {
            const fieldDoc = await getDoc(doc(db, 'fields', data.fieldId));
            if (fieldDoc.exists()) {
              fieldName = fieldDoc.data().name || 'N/A';
              fieldAddress = fieldDoc.data().address || '';
            }
          } catch (err) {
            console.warn('⚠️ [teacher-appointment-detail] Could not fetch field:', data.fieldId);
          }
        }

        setBooking({
          ...data,
          id: bookingId,
          fieldName,
          fieldAddress,
        });
        setError(null);
      } catch (err) {
        console.error('❌ [teacher-appointment-detail] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const formatDate = (date: any): string => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: any): string => {
    const d = date instanceof Timestamp ? date.toDate() : new Date(date);
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmé', color: palette.success, icon: 'checkmark-circle' as const };
      case 'pending':
        return { label: 'À valider', color: palette.warning, icon: 'hourglass-outline' as const };
      case 'completed':
        return { label: 'Terminé', color: palette.textSecondary, icon: 'checkmark-done-circle' as const };
      default:
        return { label: 'En attente', color: palette.textSecondary, icon: 'ellipse' as const };
    }
  };

  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonTop}>
          <Ionicons name="arrow-back" size={22} color={palette.text} />
        </TouchableOpacity>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Rendez-vous non trouvé'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { label: statusLabel, color: statusColor, icon: statusIcon } = getStatusBadge(booking.status);

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
          <Text style={styles.headerTitle}>Détails du rendez-vous</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* COURS INFO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cours</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{booking.title}</Text>
            <Text style={styles.cardSubtitle}>{booking.trainingType}</Text>
            {booking.description && (
              <Text style={styles.cardDescription}>{booking.description}</Text>
            )}
          </View>
        </View>

        {/* DATE & TIME */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Date et heure</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={palette.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formatDate(booking.sessionDate)}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Ionicons name="time-outline" size={20} color={palette.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Heure</Text>
                <Text style={styles.infoValue}>{formatTime(booking.sessionDate)}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="hourglass-outline" size={20} color={palette.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Durée</Text>
                <Text style={styles.infoValue}>{booking.duration} minutes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lieu</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={palette.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Terrain</Text>
                <Text style={styles.infoValue}>{booking.fieldName || 'N/A'}</Text>
              </View>
            </View>
            {booking.fieldAddress && (
              <View style={styles.infoRow}>
                <Ionicons name="map-outline" size={20} color={palette.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Adresse</Text>
                  <Text style={styles.infoValue}>{booking.fieldAddress}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* PARTICIPANTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <Text style={styles.sectionBadge}>
              {booking.currentParticipants}/{booking.maxParticipants}
            </Text>
          </View>
          {booking.participantInfo && booking.participantInfo.length > 0 ? (
            <View style={styles.participantsList}>
              {booking.participantInfo.map((participant, index) => (
                <View
                  key={participant.userId}
                  style={[styles.participantCard, index !== (booking.participantInfo?.length || 0) - 1 && styles.participantCardBorder]}
                >
                  <View style={styles.participantHeader}>
                    <Text style={styles.participantName}>{participant.name}</Text>
                    <Text style={styles.participantDog}>{participant.dog}</Text>
                  </View>
                  <View style={styles.participantContactRow}>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => handleEmail(participant.email)}
                    >
                      <Ionicons name="mail-outline" size={16} color={palette.primary} />
                      <Text style={styles.contactButtonText}>{participant.email}</Text>
                    </TouchableOpacity>
                  </View>
                  {participant.phone && (
                    <View style={styles.participantContactRow}>
                      <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => handleCall(participant.phone)}
                      >
                        <Ionicons name="call-outline" size={16} color={palette.primary} />
                        <Text style={styles.contactButtonText}>{participant.phone}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Aucun participant</Text>
          )}
        </View>

        {/* PRICING */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tarification</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prix unitaire</Text>
              <Text style={styles.infoValue}>
                {booking.price} {booking.currency}
              </Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Prix total</Text>
              <Text style={styles.infoValue}>
                {booking.totalPrice} {booking.currency}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Statut de paiement</Text>
              <Text style={[styles.infoValue, { color: booking.paid ? palette.success : palette.warning }]}>
                {booking.paid ? 'Payé' : 'Non payé'}
              </Text>
            </View>
          </View>
        </View>

        {/* STATUS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Statut</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderColor: statusColor }]}>
            <Ionicons name={statusIcon} size={20} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
      </ScrollView>
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
  backButtonTop: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.surface,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  sectionBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.primary,
    backgroundColor: palette.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginTop: 4,
  },
  participantsList: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  participantCard: {
    padding: 14,
  },
  participantCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  participantHeader: {
    marginBottom: 10,
  },
  participantName: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  participantDog: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  participantContactRow: {
    marginTop: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: palette.primary + '15',
    borderRadius: 10,
  },
  contactButtonText: {
    fontSize: 12,
    color: palette.primary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 2,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: palette.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: palette.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
