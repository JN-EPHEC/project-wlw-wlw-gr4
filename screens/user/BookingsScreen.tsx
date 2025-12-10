import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useUserUpcomingBookings } from '@/hooks/useUserUpcomingBookings';

import { UserStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UserStackParamList, 'bookings'>;

export default function BookingsScreen({ navigation }: Props) {
  const { bookings, loading, error } = useUserUpcomingBookings();

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
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.clubName}>{item.clubName}</Text>
                <Text style={styles.trainerName}>{item.trainerName}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  item.status === 'confirmed'
                    ? styles.statusConfirmed
                    : item.status === 'pending'
                      ? styles.statusPending
                      : styles.statusCancelled,
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status === 'confirmed'
                    ? 'Confirmée'
                    : item.status === 'pending'
                      ? 'En attente'
                      : 'Annulée'}
                </Text>
              </View>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.detail}>
                📅 {new Date(item.date).toLocaleDateString('fr-FR')}
              </Text>
              <Text style={styles.detail}>🕐 {item.time}</Text>
              <Text style={styles.detail}>🐕 {item.dogName}</Text>
            </View>
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
  listContent: { padding: 16, gap: 12 },
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  clubName: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  trainerName: { fontSize: 14, color: '#6B7280' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6 },
  statusConfirmed: { backgroundColor: '#D1FAE5' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusCancelled: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardDetails: { gap: 8 },
  detail: { fontSize: 14, color: '#4B5563' },
});
