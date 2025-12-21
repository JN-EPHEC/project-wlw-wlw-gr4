import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';

import { UserStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'educatorDetail'>;

interface EducatorData {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  averageRating: number;
  reviewsCount: number;
  hourlyRate: number;
  experienceYears: number;
  email: string;
  phone: string;
  bio?: string;
  methods?: string[];
  certifications?: string[];
  trainings?: string[];
  distance?: number;
  verified?: boolean;
  [key: string]: any;
}

export default function EducatorDetailScreen({ navigation, route }: Props) {
  const { educatorId } = route.params;
  const [educator, setEducator] = useState<EducatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducator = async () => {
      try {
        setLoading(true);
        console.log('🔍 [educator-detail] Fetching educator with ID:', educatorId);
        // educatorId vient directement de Firebase (string)
        const educatorRef = doc(db, 'educators', educatorId);
        const educatorSnap = await getDoc(educatorRef);

        if (educatorSnap.exists()) {
          console.log('✅ [educator-detail] Educator found:', educatorSnap.data());
          setEducator({ id: educatorSnap.id, ...educatorSnap.data() } as EducatorData);
          setError(null);
        } else {
          console.log('❌ [educator-detail] Educator NOT found with ID:', educatorId);
          setError('Éducateur non trouvé');
        }
      } catch (err) {
        console.error('❌ [educator-detail] Error fetching educator:', err);
        setError('Erreur lors du chargement de l\'éducateur');
      } finally {
        setLoading(false);
      }
    };

    fetchEducator();
  }, [educatorId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !educator) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ color: '#DC2626', fontSize: 16, textAlign: 'center' }}>
            {error || 'Éducateur non trouvé'}
          </Text>
          <TouchableOpacity 
            style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: palette.primary, borderRadius: 8 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = `${educator.firstName || ''} ${educator.lastName || ''}`.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image 
            source={{ uri: educator.photoUrl || 'https://via.placeholder.com/400x300?text=Educator' }} 
            style={styles.heroImage} 
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Text style={styles.title}>{fullName}</Text>
            {educator.verified && <MaterialCommunityIcons name="check-decagram" size={18} color={palette.primary} />}
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <View style={styles.rating}>
              <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
              <Text style={styles.ratingText}>{educator.averageRating?.toFixed(1) || 'N/A'}</Text>
            </View>
            <Text style={styles.sub}>{educator.reviewsCount || 0} avis</Text>
            {educator.distance && <Text style={styles.sub}>{educator.distance.toFixed(1)} km</Text>}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{educator.hourlyRate || 0}€</Text>
              <Text style={styles.statLabel}>Par heure</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{educator.experienceYears || 0}</Text>
              <Text style={styles.statLabel}>Ans d'exp.</Text>
            </View>
          </View>
        </View>

        {educator.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.sub}>{educator.bio}</Text>
          </View>
        )}

        {educator.methods && educator.methods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Méthodes d'enseignement</Text>
            <View style={styles.chips}>
              {educator.methods.map((m: string) => (
                <View key={m} style={styles.chip}>
                  <Text style={styles.chipText}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {educator.certifications && educator.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.chips}>
              {educator.certifications.map((c: string) => (
                <View key={c} style={styles.chip}>
                  <Text style={styles.chipText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {educator.trainings && educator.trainings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formations & Spécialisations</Text>
            {educator.trainings.map((training: string, idx: number) => (
              <View key={idx} style={styles.trainingItem}>
                <Ionicons name="checkmark-circle" size={18} color={palette.primary} />
                <Text style={styles.sub}>{training}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          {educator.email && (
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={18} color={palette.primary} />
              <Text style={styles.sub}>{educator.email}</Text>
            </View>
          )}
          {educator.phone && (
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={18} color={palette.primary} />
              <Text style={styles.sub}>{educator.phone}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('rating', { bookingId: 0 })}>
            <Text style={styles.secondaryText}>Demander un avis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('booking', { educatorId })}>
            <Text style={styles.primaryBtnText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  hero: { height: 220, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  back: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  headerContent: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#F5F7FA' },
  title: { color: palette.text, fontSize: 22, fontWeight: '700' },
  sectionTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 14 },
  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  rating: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: { color: palette.primary, fontWeight: '700', fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: palette.primary, fontWeight: '600', fontSize: 12 },
  statsContainer: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: { color: palette.primary, fontSize: 18, fontWeight: '700' },
  statLabel: { color: palette.gray, fontSize: 12, marginTop: 4 },
  trainingItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: { color: palette.primary, fontWeight: '700', fontSize: 14 },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
