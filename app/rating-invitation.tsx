import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

import { RootStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { BookingDisplay } from '@/types/Booking';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<RootStackParamList, 'ratingInvitation'>;

export default function RatingInvitationScreen({ navigation, route }: Props) {
  const { bookingId, previousTarget } = route.params;
  const [booking, setBooking] = useState<BookingDisplay | null>(null);
  const [educator, setEducator] = useState<any>(null);
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger le booking
      const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
      if (!bookingDoc.exists()) {
        setError('Réservation non trouvée');
        setLoading(false);
        return;
      }

      const bookingData = bookingDoc.data() as BookingDisplay;
      bookingData.id = bookingDoc.id;
      setBooking(bookingData);

      // Charger le club
      if (bookingData.clubId) {
        const clubDoc = await getDoc(doc(db, 'clubs', bookingData.clubId));
        if (clubDoc.exists()) {
          setClub({ id: clubDoc.id, ...clubDoc.data() });
        }
      }

      // Charger l'éducateur
      if (bookingData.educatorId) {
        const educatorDoc = await getDoc(doc(db, 'educators', bookingData.educatorId));
        if (educatorDoc.exists()) {
          setEducator({ id: educatorDoc.id, ...educatorDoc.data() });
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Erreur chargement données:', err);
      setError('Erreur chargement des données');
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    if (previousTarget) {
      navigation.navigate({ name: previousTarget, params: {} } as any);
    } else {
      navigation.navigate('account');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking || error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: palette.text, fontSize: 16 }}>{error || 'Erreur chargement'}</Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 20, width: 200 }]}
            onPress={handleDismiss}
          >
            <Text style={styles.primaryBtnText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.starWrap}>
            <MaterialCommunityIcons name="star-outline" size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Séance terminée !</Text>
          <Text style={styles.heroSub}>Comment s'est passée votre expérience ?</Text>
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check-circle" size={22} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Séance complétée</Text>
              <Text style={styles.sub}>{booking.title}</Text>
            </View>
          </View>

          <View style={styles.listRow}>
            <MaterialCommunityIcons name="calendar" size={18} color={palette.primary} />
            <Text style={styles.sub}>{formatDate(booking.sessionDate)}</Text>
          </View>
          <View style={styles.listRow}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{formatTime(booking.sessionDate)}</Text>
          </View>
          {club && (
            <View style={styles.listRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={palette.primary} />
              <Text style={styles.sub}>{club.name}</Text>
            </View>
          )}
          <View style={styles.listRow}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{booking.duration}min</Text>
          </View>
        </View>

        {educator && (
          <View style={styles.trainerCard}>
            {educator.profilePicture && (
              <Image source={{ uri: educator.profilePicture }} style={styles.trainerPhoto} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{educator.name}</Text>
              <Text style={styles.sub}>{educator.specialization || 'Éducateur'}</Text>
            </View>
            <TouchableOpacity style={styles.linkBtn}>
              <Text style={styles.linkBtnText}>Profil</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineBtn} onPress={handleDismiss}>
            <Text style={styles.outlineText}>Plus tard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate('rating', {
                bookingId,
                clubId: booking.clubId,
                educatorId: booking.educatorId,
                previousTarget: previousTarget ?? 'account',
              })
            }
          >
            <Text style={styles.primaryBtnText}>Noter maintenant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  hero: {
    backgroundColor: palette.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  starWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
    margin: 16,
  },
  successIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: palette.text, fontSize: 16, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 13 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trainerCard: {
    marginHorizontal: 16,
    marginTop: -4,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trainerPhoto: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#E5E7EB' },
  linkBtn: {
    borderWidth: 1,
    borderColor: palette.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  linkBtnText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 8 },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  outlineText: { color: palette.text, fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
