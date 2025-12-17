import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '@/navigation/types';
import { notifyReviewReceived } from '@/utils/notificationHelpers';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const bookingMock = {
  club: { name: 'Canin Club Paris', logo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=200&q=80' },
  trainer: { name: 'Sophie Martin', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', speciality: 'Éducation comportementale' },
  date: '25 Octobre 2024',
  service: 'Séance individuelle (1h)',
};

const clubTags = ['Installations propres', 'Bien situé', 'Bon équipement', 'Bonne ambiance', 'Parking facile', 'Accueil chaleureux'];
const trainerTags = ['Professionnel', 'Pédagogue', 'Patient', 'Ponctuel', 'À l’écoute', 'Passionné'];
type Props = NativeStackScreenProps<RootStackParamList, 'rating'>;

export default function RatingScreen({ navigation, route }: Props) {
  const { bookingId, previousTarget } = route.params;
  const [step, setStep] = useState<'club' | 'trainer' | 'done'>('club');
  const [clubRating, setClubRating] = useState(0);
  const [trainerRating, setTrainerRating] = useState(0);
  const [clubComment, setClubComment] = useState('');
  const [trainerComment, setTrainerComment] = useState('');
  const [clubSelectedTags, setClubSelectedTags] = useState<string[]>([]);
  const [trainerSelectedTags, setTrainerSelectedTags] = useState<string[]>([]);
  const handleBack = () => {
    if (previousTarget) {
      navigation.navigate({ name: previousTarget as keyof RootStackParamList } as any);
    } else {
      navigation.navigate('account');
    }
  };
  const toggleTag = (tag: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFn((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  if (step === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.heroSmall}>
          <Ionicons name="checkmark-circle" size={46} color="#16A34A" />
          <Text style={styles.heroTitle}>Merci pour votre avis !</Text>
          <Text style={styles.heroSub}>Votre retour aide la communauté Smart Dogs.</Text>
        </View>
        <View style={{ padding: 16 }}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => handleBack()}>
            <Text style={styles.primaryBtnText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const onSubmit = async () => {
    if (step === 'club') {
      setStep('trainer');
    } else {
      // Send notification when review is submitted
      try {
        const clubId = bookingMock.club.name; // In real app, would get actual clubId
        const clubName = bookingMock.club.name;
        await notifyReviewReceived(clubId, clubName, trainerRating, clubRating);
      } catch (notifErr) {
        console.warn('Erreur création notification:', notifErr);
      }
      setStep('done');
    }
  };

  const ratingBlock = (title: string, rating: number, setRating: (v: number) => void, tags: string[], selected: string[], setSelected: any, comment: string, setComment: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity key={s} onPress={() => setRating(s)}>
            <MaterialCommunityIcons
              name={s <= rating ? 'star' : 'star-outline'}
              size={30}
              color={s <= rating ? '#E9B782' : '#D1D5DB'}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Points forts</Text>
      <View style={styles.tagsGrid}>
        {tags.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tag, selected.includes(t) && styles.tagActive]}
            onPress={() => toggleTag(t, setSelected)}
          >
            <Text style={selected.includes(t) ? styles.tagTextActive : styles.tagText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Commentaire</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Votre ressenti en quelques mots..."
        placeholderTextColor="#9CA3AF"
        style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
        multiline
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Votre avis</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.sessionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={{ uri: bookingMock.club.logo }} style={styles.logo} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{bookingMock.club.name}</Text>
              <Text style={styles.sub}>{bookingMock.date}</Text>
              <Text style={styles.sub}>{bookingMock.service}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={{ uri: bookingMock.trainer.photo }} style={styles.trainerPhoto} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{bookingMock.trainer.name}</Text>
              <Text style={styles.sub}>{bookingMock.trainer.speciality}</Text>
            </View>
          </View>
        </View>

        {step === 'club'
          ? ratingBlock('Notez le club', clubRating, setClubRating, clubTags, clubSelectedTags, setClubSelectedTags, clubComment, setClubComment)
          : ratingBlock("Notez l'éducateur", trainerRating, setTrainerRating, trainerTags, trainerSelectedTags, setTrainerSelectedTags, trainerComment, setTrainerComment)}

        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <View style={styles.progressRow}>
            <View style={[styles.progressDot, step === 'club' && styles.progressDotActive]} />
            <View style={[styles.progressLine, step === 'trainer' && { backgroundColor: palette.primary }]} />
            <View style={[styles.progressDot, step === 'trainer' && styles.progressDotActive]} />
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit}>
            <Text style={styles.primaryBtnText}>{step === 'club' ? 'Continuer' : 'Envoyer mon avis'}</Text>
          </TouchableOpacity>
        </View>
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
  back: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
    margin: 16,
    marginBottom: 8,
  },
  logo: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#E5E7EB' },
  trainerPhoto: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#E5E7EB' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  title: { color: palette.text, fontSize: 16, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 13 },
  starsRow: { flexDirection: 'row', gap: 6 },
  label: { color: palette.gray, fontSize: 13, marginTop: 6 },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagActive: { borderColor: palette.primary, backgroundColor: '#E0F2F1' },
  tagText: { color: palette.text, fontWeight: '600', fontSize: 12 },
  tagTextActive: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
    backgroundColor: '#F9FAFB',
  },
  divider: { height: 1, backgroundColor: palette.border },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E5E7EB' },
  progressDotActive: { backgroundColor: palette.primary },
  progressLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB' },
  primaryBtn: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  heroSmall: {
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
    flex: 1,
  },
  heroTitle: { color: palette.text, fontSize: 20, fontWeight: '700' },
  heroSub: { color: palette.gray, fontSize: 13 },
});
