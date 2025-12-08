import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const bookingMock = {
  id: 1,
  club: { name: 'Canin Club Paris', logo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=200&q=80' },
  trainer: { name: 'Sophie Martin', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', speciality: 'Éducation comportementale' },
  date: '25 Octobre 2024',
  time: '14:00 - 15:00',
  service: 'Séance individuelle (1h)',
  dog: 'Max',
};

type Props = NativeStackScreenProps<RootStackParamList, 'ratingInvitation'>;

export default function RatingInvitationScreen({ navigation, route }: Props) {
  const { bookingId, previousTarget } = route.params;
  const handleDismiss = () => {
    if (previousTarget) {
      navigation.navigate({ name: previousTarget, params: {} } as any);
    } else {
      navigation.navigate('account');
    }
  };

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
              <Text style={styles.sub}>Avec {bookingMock.dog}</Text>
            </View>
          </View>

          <View style={styles.listRow}>
            <MaterialCommunityIcons name="calendar" size={18} color={palette.primary} />
            <Text style={styles.sub}>{bookingMock.date}</Text>
          </View>
          <View style={styles.listRow}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{bookingMock.time}</Text>
          </View>
          <View style={styles.listRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{bookingMock.club.name}</Text>
          </View>
          <View style={styles.listRow}>
            <MaterialCommunityIcons name="paw" size={18} color={palette.primary} />
            <Text style={styles.sub}>{bookingMock.service}</Text>
          </View>
        </View>

        <View style={styles.trainerCard}>
          <Image source={{ uri: bookingMock.trainer.photo }} style={styles.trainerPhoto} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{bookingMock.trainer.name}</Text>
            <Text style={styles.sub}>{bookingMock.trainer.speciality}</Text>
          </View>
          <View style={styles.linkBtn}>
            <Text style={styles.linkBtnText}>Profil</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineBtn} onPress={handleDismiss}>
            <Text style={styles.outlineText}>Plus tard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('rating', { bookingId, previousTarget: previousTarget ?? 'account' })}>
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
