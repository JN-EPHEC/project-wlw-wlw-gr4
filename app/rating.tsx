import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useCreateNotification } from '@/hooks/useCreateNotification';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    gold: '#FBBF24',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
};

const clubTags = ['Installations propres', 'Bien situé', 'Bon équipement', 'Bonne ambiance', 'Parking facile'];
const educatorTags = ['Pédagogue', 'Patient', 'Ponctuel', 'À l\'écoute', 'Passionné'];

type Props = NativeStackScreenProps<RootStackParamList, 'rating'>;

export default function RatingScreen({ navigation, route }: Props) {
  const params = route?.params as any;
  const { user, profile } = useAuth();
  const { createClubReview, createEducatorReview, loading: reviewLoading } = useCreateReview();
  
  const [step, setStep] = useState<'club' | 'educator' | 'done'>('club');
  const [ratings, setRatings] = useState({ club: 0, educator: 0 });
  const [comments, setComments] = useState({ club: '', educator: '' });
  const [tags, setTags] = useState<{club: string[], educator: string[]}>({ club: [], educator: [] });
  const [submitting, setSubmitting] = useState(false);

  const handleNext = async () => {
    if (step === 'club') {
      if (ratings.club === 0) return Alert.alert('Erreur', 'Veuillez donner une note au club.');
      setStep('educator');
    } else if (step === 'educator') {
      if (ratings.educator === 0) return Alert.alert('Erreur', 'Veuillez donner une note à l\'éducateur.');
      setSubmitting(true);
      try {
        await createClubReview({ clubId: params.clubId, bookingId: params.bookingId, ownerId: user!.uid, ownerName: (profile as any)?.name, rating: ratings.club, comment: comments.club, tags: tags.club });
        await createEducatorReview({ clubId: params.clubId, bookingId: params.bookingId, educatorId: params.educatorId, ownerId: user!.uid, ownerName: (profile as any)?.name, rating: ratings.educator, comment: comments.educator, tags: tags.educator });
        await deleteDoc(doc(db, 'ratingInvitations', `${params.bookingId}_${user!.uid}`));
        setStep('done');
      } catch (err) { Alert.alert('Erreur', 'Impossible de soumettre votre avis.'); }
      finally { setSubmitting(false); }
    }
  };
  
  if (step === 'done') {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
        <Text style={styles.successTitle}>Merci !</Text>
        <Text style={styles.successSubtitle}>Votre avis aide notre communauté à grandir.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}><Text style={styles.buttonText}>Terminer</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => step === 'club' ? navigation.goBack() : setStep('club')}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Votre avis</Text>
        </View>
        <View style={styles.progress}>
            <View style={[styles.progressStep, styles.progressStepActive]}><Text style={styles.progressText}>Club</Text></View>
            <View style={[styles.progressStep, step === 'educator' && styles.progressStepActive]}><Text style={styles.progressText}>Éducateur</Text></View>
        </View>
      <ScrollView contentContainerStyle={styles.container}>
        {step === 'club' ? 
            <RatingBlock title="Notez le club" rating={ratings.club} setRating={r => setRatings({...ratings, club:r})} tags={clubTags} selectedTags={tags.club} onToggleTag={t => setTags({...tags, club: tags.club.includes(t) ? tags.club.filter(x => x!==t) : [...tags.club, t]})} comment={comments.club} setComment={c => setComments({...comments, club:c})} /> :
            <RatingBlock title="Notez l\'éducateur" rating={ratings.educator} setRating={r => setRatings({...ratings, educator:r})} tags={educatorTags} selectedTags={tags.educator} onToggleTag={t => setTags({...tags, educator: tags.educator.includes(t) ? tags.educator.filter(x => x!==t) : [...tags.educator, t]})} comment={comments.educator} setComment={c => setComments({...comments, educator:c})} />}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, (submitting || reviewLoading) && {opacity: 0.7}]} onPress={handleNext} disabled={submitting || reviewLoading}>
            {submitting || reviewLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{step === 'club' ? 'Suivant' : 'Envoyer'}</Text>}</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const RatingBlock = ({ title, rating, setRating, tags, selectedTags, onToggleTag, comment, setComment }: any) => (
    <View style={styles.card}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.starsRow}>{ [1,2,3,4,5].map(s => <TouchableOpacity key={s} onPress={() => setRating(s)}><MaterialCommunityIcons name={s <= rating ? 'star' : 'star-outline'} size={36} color={colors.gold} /></TouchableOpacity>) }</View>
        <Text style={styles.inputLabel}>Points forts</Text>
        <View style={styles.tagsGrid}>{ tags.map((t: string) => <TouchableOpacity key={t} style={[styles.tag, selectedTags.includes(t) && styles.tagActive]} onPress={() => onToggleTag(t)}><Text style={[styles.tagText, selectedTags.includes(t) && {color: colors.primary}]}>{t}</Text></TouchableOpacity>) }</View>
        <Text style={styles.inputLabel}>Commentaire</Text>
        <TextInput value={comment} onChangeText={setComment} placeholder="Votre ressenti..." style={styles.input} multiline />
    </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: -1, margin: 16, marginBottom: 0 },
  progressStep: { borderBottomWidth: 3, borderColor: '#E5E7EB', flex: 1, padding: 12, alignItems: 'center' },
  progressStepActive: { borderColor: colors.primary },
  progressText: { fontWeight: 'bold', color: colors.textMuted },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  inputLabel: { fontSize: 16, fontWeight: '600', color: colors.textMuted },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  tagActive: { backgroundColor: 'rgba(39, 179, 163, 0.1)' },
  tagText: { fontWeight: '500' },
  input: { backgroundColor: colors.background, borderRadius: 12, padding: 14, fontSize: 15, minHeight: 80, textAlignVertical: 'top' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 16 },
  successSubtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 24 },
});