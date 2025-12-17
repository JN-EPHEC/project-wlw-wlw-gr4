import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useCreateNotification } from '@/hooks/useCreateNotification';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const clubTags = ['Installations propres', 'Bien situé', 'Bon équipement', 'Bonne ambiance', 'Parking facile', 'Accueil chaleureux'];
const educatorTags = ['Professionnel', 'Pédagogue', 'Patient', 'Ponctuel', 'À l\'écoute', 'Passionné'];

type Props = NativeStackScreenProps<RootStackParamList, 'rating'>;

export default function RatingScreen({ navigation, route }: Props) {
  // Extraction sécurisée des params
  const params = route?.params as any;
  const bookingId = params?.bookingId || '';
  const clubId = params?.clubId || '';
  const educatorId = params?.educatorId || '';
  const previousTarget = params?.previousTarget || 'account';

  const { profile } = useAuth();
  const ownerId = (profile as any)?.uid || '';
  const ownerName = (profile as any)?.name || 'Utilisateur';

  const [step, setStep] = useState<'club' | 'educator' | 'done'>('club' as 'club' | 'educator' | 'done');
  const [clubRating, setClubRating] = useState(0);
  const [educatorRating, setEducatorRating] = useState(0);
  const [clubComment, setClubComment] = useState('');
  const [educatorComment, setEducatorComment] = useState('');
  const [clubSelectedTags, setClubSelectedTags] = useState<string[]>([]);
  const [educatorSelectedTags, setEducatorSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { createClubReview, createEducatorReview, loading: reviewLoading } = useCreateReview();
  const { createNotification } = useCreateNotification();

  const handleBack = () => {
    if (previousTarget && String(previousTarget) !== 'account') {
      navigation.navigate(String(previousTarget) as any);
    } else {
      navigation.goBack();
    }
  };

  const toggleTag = (tag: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFn((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const onSubmit = async () => {
    if (step === 'club') {
      if (clubRating === 0) {
        Alert.alert('Erreur', 'Veuillez donner une note au club');
        return;
      }
      setStep('educator' as any);
      return;
    }

    if (step === 'educator') {
      if (educatorRating === 0) {
        Alert.alert('Erreur', 'Veuillez donner une note à l\'éducateur');
        return;
      }

      setSubmitting(true);

      try {
        // Créer l'avis pour le club
        await createClubReview({
          clubId,
          bookingId,
          educatorId,
          ownerId,
          ownerName,
          rating: clubRating,
          comment: clubComment,
          tags: clubSelectedTags,
        });

        // Créer l'avis pour l'éducateur
        await createEducatorReview({
          clubId,
          bookingId,
          educatorId,
          ownerId,
          ownerName,
          rating: educatorRating,
          comment: educatorComment,
          tags: educatorSelectedTags,
        });

        // Supprimer l'invitation d'avis
        try {
          const invitationId = `${bookingId}_${ownerId}`;
          await deleteDoc(doc(db, 'ratingInvitations', invitationId));
          console.log('✅ Invitation supprimée');
        } catch (err) {
          console.warn('⚠️ Erreur suppression invitation:', err);
        }

        // Envoyer une notification au club pour lui dire qu'il a reçu un avis
        try {
          await createNotification({
            userId: String(clubId),
            type: 'review_received',
            title: 'Nouvel avis reçu !',
            message: `Vous avez reçu un nouvel avis : ${clubRating}★`,
            senderId: String(ownerId),
            senderName: String(ownerName),
            data: {
              clubId: String(clubId),
              bookingId: String(bookingId),
            },
          });
        } catch (notifErr) {
          console.warn('⚠️ Notification error (non-blocking):', notifErr);
        }

        setStep('done' as any);
        setSubmitting(false);
      } catch (err) {
        console.error('Erreur création avis:', err);
        Alert.alert('Erreur', 'Impossible de soumettre votre avis');
        setSubmitting(false);
      }
    }
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

  const ratingBlock = (
    title: string,
    rating: number,
    setRating: (v: number) => void,
    tags: string[],
    selected: string[],
    setSelected: any,
    comment: string,
    setComment: any
  ) => (
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
            <Text style={[styles.tagText, selected.includes(t) && styles.tagTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Commentaire</Text>
      <TextInput
        style={styles.input}
        placeholder="Votre ressenti en quelques mots..."
        placeholderTextColor={palette.gray}
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Votre avis</Text>
          <View style={{ width: 24 }} />
        </View>

        {(step as any) !== 'done' ? (
          <>
            {/* Progress */}
            <View style={styles.progressRow}>
              <View style={[styles.progressDot, step !== 'club' && styles.progressDotActive]} />
              <View style={[styles.progressLine, step !== 'club' && styles.progressLineActive]} />
              <View style={[styles.progressDot, step === 'educator' && styles.progressDotActive]} />
              <View style={[styles.progressLine, step === 'educator' && styles.progressLineActive]} />
              <View style={styles.progressDot} />
            </View>

            {step === 'club'
              ? ratingBlock('Notez le club', clubRating, setClubRating, clubTags, clubSelectedTags, setClubSelectedTags, clubComment, setClubComment)
              : ratingBlock('Notez l\'éducateur', educatorRating, setEducatorRating, educatorTags, educatorSelectedTags, setEducatorSelectedTags, educatorComment, setEducatorComment)}
          </>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 8 }}>
          {step === 'educator' && (
            <TouchableOpacity
              style={[styles.outlineBtn]}
              onPress={() => setStep('club')}
              disabled={submitting || reviewLoading}
            >
              <Text style={styles.outlineText}>Retour</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.primaryBtn, { flex: step === 'club' ? 1 : 1 }]}
            onPress={onSubmit}
            disabled={submitting || reviewLoading}
          >
            {submitting || reviewLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>{step === 'club' ? 'Suivant' : 'Envoyer mon avis'}</Text>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: palette.border, gap: 12, margin: 16, marginBottom: 8 },
  title: { color: palette.text, fontSize: 16, fontWeight: '700' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  label: { color: palette.text, fontSize: 13, fontWeight: '700', marginTop: 4 },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: palette.border, backgroundColor: '#F9FAFB' },
  tagActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  tagText: { color: palette.text, fontSize: 12, fontWeight: '600' },
  tagTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
    backgroundColor: '#F9FAFB',
    textAlignVertical: 'top',
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12, paddingHorizontal: 16, marginTop: 12 },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E5E7EB' },
  progressDotActive: { backgroundColor: palette.primary },
  progressLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB' },
  progressLineActive: { backgroundColor: palette.primary },
  primaryBtn: { flex: 1, backgroundColor: palette.primary, paddingVertical: 14, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  outlineBtn: { flex: 1, borderWidth: 1, borderColor: palette.border, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  outlineText: { color: palette.text, fontWeight: '700', fontSize: 15 },
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
