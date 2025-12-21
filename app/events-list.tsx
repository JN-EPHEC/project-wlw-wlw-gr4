import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';
import { useClubEvents } from '@/hooks/useClubEvents';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
};

type Props = NativeStackScreenProps<UserStackParamList, 'events'>;

export default function EventsListScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const clubIdStr = clubId;
  
  console.log('🔍 [events-list] clubId received:', clubId, 'clubIdStr:', clubIdStr);
  
  // Fetch events from Firestore
  const { events, loading, error } = useClubEvents(clubIdStr);

  console.log('📊 [events-list] events loaded:', events.length, 'loading:', loading, 'error:', error);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Événements</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Événements</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: '#DC2626', fontSize: 12 }}>Erreur: {error}</Text>
          </View>
        )}
        
        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={palette.gray} />
            <Text style={styles.emptyText}>Pas d'événements pour le moment</Text>
            <Text style={{ color: palette.gray, marginTop: 4, fontSize: 12 }}>
              clubId: {clubIdStr}
            </Text>
          </View>
        ) : (
          events.map((event) => {
            // Format date
            const startDate = event.startDate?.toDate?.() || new Date(event.startDate);
            const dayStr = startDate.toLocaleDateString('fr-FR', { weekday: 'short' });
            const dateStr = startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            const timeStr = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            // Calculate available slots
            const availableSlots = event.dogSlots - (event.participants?.reduce((sum, p) => sum + (p.numDogs || 0), 0) || 0);
            const isFull = availableSlots <= 0;

            return (
              <View key={event.id} style={styles.card}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  {/* Date sidebar */}
                  <View style={styles.dateBox}>
                    <Text style={styles.dateDay}>{dayStr}.</Text>
                    <Text style={styles.dateNum}>{startDate.getDate()}</Text>
                    <Text style={styles.dateMonth}>{startDate.toLocaleDateString('fr-FR', { month: 'short' }).toLowerCase()}</Text>
                  </View>

                  {/* Content */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <Text style={[styles.title, { flex: 1 }]} numberOfLines={2}>{event.title}</Text>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{event.type || 'Événement'}</Text>
                      </View>
                    </View>

                    <Text style={styles.description} numberOfLines={2}>{event.description}</Text>

                    {/* Metadata */}
                    <View style={{ gap: 8, marginTop: 12 }}>
                      <View style={styles.metaRow}>
                        <Ionicons name="time-outline" size={14} color={palette.gray} />
                        <Text style={styles.metaText}>{timeStr}</Text>
                      </View>

                      <View style={styles.metaRow}>
                        <Ionicons name="location-outline" size={14} color={palette.gray} />
                        <Text style={[styles.metaText, { flex: 1 }]} numberOfLines={1}>
                          {event.location || 'Lieu non spécifié'}
                        </Text>
                      </View>

                      <View style={styles.metaRow}>
                        <MaterialCommunityIcons name="paw" size={14} color={palette.gray} />
                        <Text style={styles.metaText}>{availableSlots}/{event.dogSlots} chiens</Text>
                      </View>

                      {event.spectatorSlots > 0 && (
                        <View style={styles.metaRow}>
                          <Ionicons name="people-outline" size={14} color={palette.gray} />
                          <Text style={styles.metaText}>{event.spectatorSlots} spectateurs max</Text>
                        </View>
                      )}
                    </View>

                    {/* Book Button */}
                    <TouchableOpacity 
                      style={[styles.bookButton, isFull && { opacity: 0.5 }]}
                      disabled={isFull}
                      onPress={() => navigation.navigate('eventBooking' as any, { eventId: event.id })}
                    >
                      <Text style={styles.bookButtonText}>
                        {isFull ? 'Complet' : 'Réserver maintenant'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  
  // Card styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateBox: {
    backgroundColor: '#E0F7F4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  dateDay: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  dateNum: {
    color: palette.primary,
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 2,
  },
  dateMonth: {
    color: palette.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    color: palette.gray,
    fontSize: 13,
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: palette.gray,
    fontSize: 13,
  },
  bookButton: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: palette.gray,
    marginTop: 12,
    fontSize: 14,
  },
});
