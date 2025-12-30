import React, { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '@/navigation/types';

const palette = {
  primary: '#35A89C',
  primaryDark: '#2B8A7F',
  accent: '#E39A5C',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E6E2DD',
  surface: '#FFFFFF',
  background: '#F7F4F0',
};

const teacherMocks: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Sophie Martin',
    specialty: 'Dressage & Obéissance',
    experience: '12 ans',
    rating: 4.9,
    reviews: 156,
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
    bio: "Passionnée d'éducation positive, j'accompagne les binômes maître-chien vers une relation harmonieuse.",
    certifications: ['BPJEPS Éducateur Canin', 'CCAD', 'Clicker Training avancé', 'Comportement Canin'],
    specializations: ['Éducation positive', 'Obéissance', 'Rappel et marche en laisse', 'Sociabilisation chiot'],
    excellence: 'Spécialiste des chiens réactifs et anxieux (500+ binômes suivis).',
    workPhotos: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    ],
  },
};

type Props = NativeStackScreenProps<RootStackParamList, 'teacherDetail'>;

export default function TeacherDetailScreen({ navigation, route }: Props) {
  const { teacherId, clubId, previousTarget } = route.params;
  const teacher = useMemo(
    () => teacherMocks[String(teacherId)] || teacherMocks['1'],
    [teacherId],
  );
  const targetClubId = clubId ?? teacherId;
  const handleBack = () => {
    if (previousTarget) {
      if (previousTarget === 'clubDetail' && clubId) {
        navigation.navigate('clubDetail', { clubId });
        return;
      }
      navigation.navigate(previousTarget as any, clubId ? ({ clubId } as any) : undefined);
      return;
    }
    if (clubId) {
      navigation.navigate('clubDetail', { clubId });
      return;
    }
    navigation.navigate('clubs');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: teacher.profileImage }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.6)']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.back} onPress={() => handleBack()}>
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.heroTitle}>{teacher.name}</Text>
              <MaterialCommunityIcons name="check-decagram" size={18} color="#fff" />
            </View>
            <Text style={styles.heroMeta}>{teacher.specialty}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="star" size={14} color={palette.accent} />
              <Text style={styles.heroMeta}>{teacher.rating} ({teacher.reviews})</Text>
              <Ionicons name="time-outline" size={14} color="#fff" />
              <Text style={styles.heroMeta}>{teacher.experience}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Présentation</Text>
          <Text style={styles.sub}>{teacher.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Spécialités</Text>
          <View style={styles.chips}>
            {teacher.specializations.map((s: string) => (
              <View key={s} style={styles.chip}>
                <Text style={styles.chipText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Certifications</Text>
          {teacher.certifications.map((c: string, idx: number) => (
            <View key={idx} style={styles.listRow}>
              <MaterialCommunityIcons name="certificate-outline" size={18} color={palette.primary} />
              <Text style={styles.sub}>{c}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Points forts</Text>
          <View style={styles.card}>
            <MaterialCommunityIcons name="trophy-outline" size={20} color={palette.accent} />
            <Text style={styles.sub}>{teacher.excellence}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Galerie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {teacher.workPhotos.map((p: string, idx: number) => (
              <Image key={idx} source={{ uri: p }} style={styles.photo} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('homeTrainingBooking', { clubId: targetClubId })}>
            <Text style={styles.secondaryText}>Séance à domicile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('booking', { clubId: targetClubId })}>
            <Text style={styles.primaryBtnText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  hero: {
    height: 240,
    position: 'relative',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroImage: { width: '100%', height: '100%' },
  back: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 999,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  heroContent: { position: 'absolute', left: 16, right: 16, bottom: 14, gap: 6 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  heroMeta: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13 },
  section: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  title: { color: palette.text, fontSize: 17, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#F0FBF9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: palette.primaryDark, fontWeight: '700', fontSize: 12 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  card: {
    backgroundColor: '#FFF9F3',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F4D9C2',
    flexDirection: 'row',
    gap: 8,
  },
  photo: { width: 200, height: 130, borderRadius: 14, backgroundColor: '#E5E7EB' },
  bottomActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
  },
  secondaryText: { color: palette.primaryDark, fontWeight: '700', fontSize: 13 },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
