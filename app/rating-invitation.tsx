import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

import { RootStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  bg: '#F5F7FA',
};

type Props = NativeStackScreenProps<RootStackParamList, 'ratingInvitation'>;

interface BookingData {
  id: string;
  title: string;
  clubId: string;
  educatorId: string;
  sessionDate: any;
  duration: number;
}

export default function RatingInvitationScreen({ navigation, route }: Props) {
  // Extraction sécurisée des params
  const params = route?.params as any;
  const bookingId = params?.bookingId;
  const previousTarget = params?.previousTarget || 'account';

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [educator, setEducator] = useState<any>(null);
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      loadData();
    } else {
      console.warn('⚠️ No bookingId provided');
      setLoading(false);
    }
  }, [bookingId]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading booking:', bookingId);

      if (!bookingId) {
        console.warn('⚠️ No bookingId');
        setLoading(false);
        return;
      }

      const bookingDoc = await getDoc(doc(db, 'Bookings', String(bookingId)));
      console.log('✅ Booking fetch complete, exists:', bookingDoc.exists());

      if (!bookingDoc.exists()) {
        console.warn('⚠️ Booking doc not found');
        setLoading(false);
        return;
      }

      const rawData = bookingDoc.data();
      console.log('📋 Raw booking data keys:', Object.keys(rawData || {}));

      if (!rawData) {
        console.warn('⚠️ No data in booking doc');
        setLoading(false);
        return;
      }

      // Safely extract booking data
      const booking: BookingData = {
        id: bookingDoc.id || String(bookingId),
        title: String(rawData.title || 'Séance'),
        clubId: String(rawData.clubId || ''),
        educatorId: String(rawData.educatorId || ''),
        sessionDate: rawData.sessionDate || null,
        duration: Number(rawData.duration) || 60,
      };

      console.log('✅ Booking object created:', booking.id, booking.title);
      setBooking(booking);

      // Load club safely
      const clubIdToLoad = booking.clubId?.trim?.();
      if (clubIdToLoad) {
        try {
          const clubDoc = await getDoc(doc(db, 'club', clubIdToLoad));
          if (clubDoc.exists()) {
            setClub(clubDoc.data());
            console.log('✅ Club loaded');
          }
        } catch (clubErr) {
          console.warn('⚠️ Club load error:', clubErr);
        }
      }

      // Load educator safely
      const educatorIdToLoad = booking.educatorId?.trim?.();
      if (educatorIdToLoad) {
        try {
          const eduDoc = await getDoc(doc(db, 'educators', educatorIdToLoad));
          if (eduDoc.exists()) {
            setEducator(eduDoc.data());
            console.log('✅ Educator loaded');
          }
        } catch (eduErr) {
          console.warn('⚠️ Educator load error:', eduErr);
        }
      }

      setLoading(false);
    } catch (err: any) {
      console.error('❌ Error in loadData:', err?.message || String(err));
      console.error('Full error:', err);
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    try {
      const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
    } catch {
      return '';
    }
  };

  const formatTime = (timestamp: any): string => {
    if (!timestamp) return '';
    try {
      const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleGoRating = () => {
    if (booking) {
      navigation.navigate('rating', {
        bookingId: booking.id,
        clubId: booking.clubId,
        educatorId: booking.educatorId,
        previousTarget: previousTarget || 'ratingsInvitationsList',
      } as any);
    }
  };

  const handleDismiss = () => {
    // Default to account if previousTarget is missing or invalid
    const target = previousTarget && typeof previousTarget === 'string' 
      ? previousTarget 
      : 'account';
    try {
      navigation.navigate(target as any, {} as any);
    } catch (err) {
      console.error('Navigation error:', err);
      navigation.navigate('account' as any, {} as any);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContent}>
          <View style={styles.errorCard}>
            <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Données non disponibles</Text>
            <TouchableOpacity style={styles.btn} onPress={handleDismiss}>
              <Text style={styles.btnText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="star" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Séance terminée !</Text>
          <Text style={styles.headerSub}>Comment s'est passée votre expérience ?</Text>
        </View>

        {/* Booking Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#16A34A" />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Séance</Text>
                <Text style={styles.infoValue}>{booking.title}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={20} color={palette.primary} />
              <Text style={styles.infoValue}>{formatDate(booking.sessionDate)}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock" size={20} color={palette.primary} />
              <Text style={styles.infoValue}>{formatTime(booking.sessionDate)}</Text>
            </View>

            {club && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={20} color={palette.primary} />
                <Text style={styles.infoValue}>{club.name || 'Club'}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={palette.primary} />
              <Text style={styles.infoValue}>{booking.duration} min</Text>
            </View>
          </View>
        </View>

        {/* Educator Info */}
        {educator && (
          <View style={styles.section}>
            <View style={styles.educatorCard}>
              {educator.profilePicture ? (
                <Image source={{ uri: educator.profilePicture }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <MaterialCommunityIcons name="account" size={32} color={palette.primary} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.educatorName}>{educator.name || 'Éducateur'}</Text>
                <Text style={styles.educatorRole}>{educator.specialization || 'Spécialiste'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnOutline} onPress={handleDismiss}>
            <Text style={styles.btnOutlineText}>Plus tard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleGoRating}>
            <Text style={styles.btnText}>Noter maintenant</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: {
    backgroundColor: palette.primary,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },

  section: { paddingHorizontal: 16, paddingVertical: 16 },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoLabel: { color: palette.gray, fontSize: 12, fontWeight: '500' },
  infoValue: { color: palette.text, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 4 },

  educatorCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  photo: { width: 56, height: 56, borderRadius: 12 },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  educatorName: { color: palette.text, fontSize: 14, fontWeight: '700' },
  educatorRole: { color: palette.gray, fontSize: 12, marginTop: 2 },

  actions: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 16 },
  btn: {
    flex: 1,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: palette.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnOutlineText: { color: palette.text, fontWeight: '700', fontSize: 15 },

  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    marginHorizontal: 16,
  },
  errorTitle: { color: palette.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
});
