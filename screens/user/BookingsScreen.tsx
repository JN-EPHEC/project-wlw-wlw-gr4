import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useUserUpcomingBookings } from '@/hooks/useUserUpcomingBookings';
import { useUpdateBooking } from '@/hooks/useUpdateBooking';

import { UserStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UserStackParamList, 'bookings'>;

export default function BookingsScreen({ navigation }: Props) {
  const { bookings, loading, error, loadUserBookings } = useUserUpcomingBookings();
  const { updateBooking, loading: updateLoading } = useUpdateBooking();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      setUpdatingId(bookingId);
      await updateBooking(bookingId, { status: 'confirmed' });
      Alert.alert('Succès', 'Réservation confirmée!');
      setTimeout(() => loadUserBookings(), 500);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de confirmer la réservation');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefuseBooking = async (bookingId: string) => {
    Alert.alert(
      'Confirmer le refus',
      'Êtes-vous sûr de vouloir refuser cette réservation?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Refuser',
          onPress: async () => {
            try {
              setUpdatingId(bookingId);
              await updateBooking(bookingId, { status: 'refused' });
              Alert.alert('Succès', 'Réservation refusée');
              setTimeout(() => loadUserBookings(), 500);
            } catch (err) {
              Alert.alert('Erreur', 'Impossible de refuser la réservation');
            } finally {
              setUpdatingId(null);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour compte</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mes réservations</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#41B6A6" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour compte</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mes réservations</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erreur lors du chargement des réservations</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour compte</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mes réservations</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>Aucune réservation</Text>
          <Text style={styles.emptyText}>Découvrez nos clubs de dressage</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('clubs' as any)}
          >
            <Text style={styles.exploreButtonText}>Explorer les clubs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
          <Text style={styles.backText}>‹ Retour compte</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mes réservations</Text>
      </View>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            {/* Header avec titre et statut */}
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <View style={styles.statusBadge}>
                  <Text style={[
                    styles.statusText,
                    item.status === 'confirmed' && { color: '#059669' },
                    item.status === 'pending' && { color: '#D97706' },
                    item.status === 'cancelled' && { color: '#DC2626' },
                  ]}>
                    {item.status === 'confirmed'
                      ? '✓ Confirmée'
                      : item.status === 'pending'
                        ? '⏳ En attente'
                        : '✕ Annulée'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Club info */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Club:</Text>
              <Text style={styles.infoValue}>{item.club}</Text>
            </View>

            {/* Trainer info */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Éducateur:</Text>
              <Text style={styles.infoValue}>{item.trainer}</Text>
            </View>

            {/* Date, time, dog */}
            <View style={styles.detailsSection}>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>📅</Text>
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>🕐</Text>
                <Text style={styles.detailText}>{item.time}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>🐕</Text>
                <Text style={styles.detailText}>{item.dog}</Text>
              </View>
            </View>

            {/* Action buttons */}
            {item.status === 'pending' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.acceptBtn]}
                  onPress={() => handleAcceptBooking(item.id)}
                  disabled={updatingId === item.id || updateLoading}
                >
                  {updatingId === item.id && updateLoading ? (
                    <ActivityIndicator size="small" color="#059669" />
                  ) : (
                    <Text style={styles.acceptBtnText}>Accepter</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.refuseBtn]}
                  onPress={() => handleRefuseBooking(item.id)}
                  disabled={updatingId === item.id || updateLoading}
                >
                  {updatingId === item.id && updateLoading ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                  ) : (
                    <Text style={styles.refuseBtnText}>Refuser</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {item.status === 'confirmed' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.refuseBtn]}
                  onPress={() => handleRefuseBooking(item.id)}
                  disabled={updatingId === item.id || updateLoading}
                >
                  {updatingId === item.id && updateLoading ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                  ) : (
                    <Text style={styles.refuseBtnText}>Refuser</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 16, gap: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { color: '#41B6A6', fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', marginBottom: 16, textAlign: 'center' },
  exploreButton: {
    backgroundColor: '#41B6A6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: { color: '#FFF', fontWeight: '600', textAlign: 'center' },
  listContent: { padding: 16, gap: 12, paddingBottom: 32 },
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#41B6A6',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  detailsSection: {
    gap: 10,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    backgroundColor: '#D1FAE5',
  },
  acceptBtnText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 13,
  },
  refuseBtn: {
    backgroundColor: '#FEE2E2',
  },
  refuseBtnText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
});
