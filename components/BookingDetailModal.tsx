import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { BookingDisplay } from '@/types/Booking';
import { useFetchDogByOwnerId } from '@/hooks/useFetchDogByOwnerId';

const palette = {
  primary: '#2F9C8D',
  primaryDark: '#277D71',
  text: '#1F2937',
  textSecondary: '#6B7280',
  background: '#F3F6F5',
  surface: '#FFFFFF',
  border: '#E3EBEA',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#F59E0B',
};

interface BookingDetailModalProps {
  visible: boolean;
  booking: BookingDisplay | null;
  onClose: () => void;
  onModify?: (booking: BookingDisplay) => void;
  onDelete?: () => void;
}

export default function BookingDetailModal({
  visible,
  booking,
  onClose,
  onModify,
  onDelete,
}: BookingDetailModalProps) {
  const [deleting, setDeleting] = useState(false);

  // IMPORTANT: Call hooks BEFORE any conditional returns
  // Get dog info from first participant (call hook always, even if booking is null)
  const firstParticipant = booking?.participantInfo?.[0];
  const { dog, loading: dogLoading } = useFetchDogByOwnerId(firstParticipant?.userId || '');

  if (!booking) {
    return null;
  }

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

  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return 'N/A';
    const age = parseInt(birthDate, 10);
    return age > 1 ? `${age} ans` : `${age} an`;
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le rendez-vous',
      'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteDoc(doc(db, 'Bookings', booking.id));
              Alert.alert('Succès', 'Le rendez-vous a été supprimé');
              onClose();
              if (onDelete) {
                onDelete();
              }
            } catch (err) {
              console.error('Erreur lors de la suppression:', err);
              Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={palette.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{booking.title}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Status */}
            <View style={styles.statusRow}>
              <Text style={styles.label}>Statut</Text>
              <View style={[styles.statusBadge, { borderColor: palette.success, backgroundColor: palette.success + '15' }]}>
                <Ionicons name="checkmark-circle" size={16} color={palette.success} />
                <Text style={[styles.statusText, { color: palette.success }]}>Confirmé</Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.section}>
              <View style={styles.dateTimeBox}>
                <Ionicons name="calendar-outline" size={20} color={palette.primary} />
                <View style={styles.dateTimeContent}>
                  <Text style={styles.dateValue}>{formatDate(booking.sessionDate)}</Text>
                  <Text style={styles.timeValue}>
                    {formatTime(booking.sessionDate)} - {booking.duration} min
                  </Text>
                </View>
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <View style={styles.locationBox}>
                <Ionicons name="location-outline" size={20} color={palette.textSecondary} />
                <View style={styles.locationContent}>
                  <Text style={styles.locationLabel}>Lieu</Text>
                  <Text style={styles.locationValue}>{booking.fieldName || 'N/A'}</Text>
                </View>
              </View>
            </View>

            {/* Client Info */}
            {firstParticipant && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informations client</Text>
                <View style={styles.infoBox}>
                  <Ionicons name="person-outline" size={18} color={palette.primary} />
                  <Text style={styles.infoText}>{firstParticipant.name}</Text>
                </View>
                {firstParticipant.phone && (
                  <TouchableOpacity
                    style={styles.infoBox}
                    onPress={() => handleCall(firstParticipant.phone)}
                  >
                    <Ionicons name="call-outline" size={18} color={palette.primary} />
                    <Text style={[styles.infoText, { color: palette.primary }]}>{firstParticipant.phone}</Text>
                  </TouchableOpacity>
                )}
                {firstParticipant.email && (
                  <TouchableOpacity
                    style={styles.infoBox}
                    onPress={() => handleEmail(firstParticipant.email)}
                  >
                    <Ionicons name="mail-outline" size={18} color={palette.primary} />
                    <Text style={[styles.infoText, { color: palette.primary }]}>{firstParticipant.email}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Dog Info */}
            {dogLoading ? (
              <View style={styles.section}>
                <ActivityIndicator size="small" color={palette.primary} />
              </View>
            ) : dog ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informations sur le chien</Text>
                <View style={styles.dogBox}>
                  <Text style={styles.dogEmoji}>🐶</Text>
                  <View style={styles.dogContent}>
                    <Text style={styles.dogName}>{dog.name}</Text>
                    <Text style={styles.dogBreed}>
                      {dog.breed}
                      {dog.birthDate ? ` – ${calculateAge(dog.birthDate)}` : ''}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Notes */}
            {booking.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notesText}>{booking.description}</Text>
              </View>
            )}

            {/* Pricing */}
            <View style={styles.section}>
              <View style={styles.pricingRow}>
                <Ionicons name="cash-outline" size={20} color={palette.primary} />
                <Text style={styles.pricingLabel}>Tarif</Text>
                <Text style={styles.pricingValue}>
                  {booking.price}{booking.currency}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={deleting}
            >
              <Ionicons name="trash-outline" size={18} color={palette.danger} />
              <Text style={styles.deleteButtonText}>
                {deleting ? 'Suppression...' : 'Supprimer'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.modifyButton]}
              onPress={() => {
                if (onModify) onModify(booking);
              }}
            >
              <Ionicons name="pencil-outline" size={18} color={palette.primary} />
              <Text style={styles.modifyButtonText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.closeMainButton]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
  },
  label: {
    fontSize: 13,
    color: palette.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  dateTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E6F4F1',
    padding: 14,
    borderRadius: 14,
  },
  dateTimeContent: {
    flex: 1,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
  },
  timeValue: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 4,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: palette.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: palette.textSecondary,
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 14,
    color: palette.text,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: palette.background,
    borderRadius: 10,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: palette.text,
    fontWeight: '500',
  },
  dogBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFF4E8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F4D9C2',
  },
  dogEmoji: {
    fontSize: 28,
  },
  dogContent: {
    flex: 1,
  },
  dogName: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
  },
  dogBreed: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  notesText: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  pricingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    flex: 1,
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.success,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: palette.surface,
    borderColor: palette.danger,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.danger,
  },
  modifyButton: {
    backgroundColor: palette.surface,
    borderColor: palette.primary,
  },
  modifyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.primary,
  },
  closeMainButton: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
    flex: 1.2,
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.surface,
  },
});
