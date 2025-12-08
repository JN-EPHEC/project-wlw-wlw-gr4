import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { UserStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const stats = {
  averageRating: 4.7,
  totalReviews: 124,
  breakdown: { 5: 89, 4: 25, 3: 7, 2: 2, 1: 1 },
};

const reviews = [
  {
    id: 1,
    user: { name: 'Marc Dubois', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', dog: 'Luna' },
    rating: 5,
    date: '15 Octobre 2024',
    comment:
      "Excellente expérience ! Sophie est très pédagogue et a su mettre Luna en confiance dès le premier cours. Installations impeccables et accueil chaleureux.",
    tags: ['Professionnel', 'Pédagogue', 'Installations propres'],
    helpful: 12,
  },
  {
    id: 2,
    user: { name: 'Julie Martin', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', dog: 'Max' },
    rating: 5,
    date: '10 Octobre 2024',
    comment:
      'Je recommande vivement ! Les progrès de Max ont été spectaculaires en seulement 3 séances. Équipe à l’écoute et conseils très pratiques.',
    tags: ['À l’écoute', 'Passionné', 'Bon équipement'],
    helpful: 8,
  },
  {
    id: 3,
    user: { name: 'Thomas Laurent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', dog: 'Rocky' },
    rating: 4,
    date: '5 Octobre 2024',
    comment: 'Très bon club. Seul bémol : parking compliqué aux heures de pointe.',
    tags: ['Patient', 'Bien situé'],
    helpful: 5,
  },
];

type Props = NativeStackScreenProps<UserStackParamList, 'reviews'>;

export default function ReviewsScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filtered = filterRating ? reviews.filter((r) => r.rating === filterRating) : reviews;
  const handleBack = () => {
    if (clubId) {
      navigation.navigate('clubDetail', { clubId });
    } else {
      navigation.navigate('home');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Avis</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.ratingValue}>{stats.averageRating}</Text>
          <Text style={styles.ratingLabel}>sur 5</Text>
          <Text style={styles.meta}>{stats.totalReviews} avis</Text>
          <View style={{ width: '100%', gap: 6 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.breakdown[star as 5 | 4 | 3 | 2 | 1];
              const total = stats.totalReviews;
              const width = (count / total) * 100;
              return (
                <TouchableOpacity key={star} style={styles.breakdownRow} onPress={() => setFilterRating(star)}>
                  <Text style={styles.breakdownLabel}>{star}★</Text>
                  <View style={styles.breakdownTrack}>
                    <View style={[styles.breakdownFill, { width: `${width}%` }]} />
                  </View>
                  <Text style={styles.breakdownCount}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {filtered.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image source={{ uri: r.user.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{r.user.name}</Text>
                <Text style={styles.meta}>{r.date} · {r.user.dog}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                <Text style={styles.ratingBadgeText}>{r.rating}</Text>
              </View>
            </View>
            <Text style={styles.comment}>{r.comment}</Text>
            <View style={styles.tagRow}>
              {r.tags.map((t) => (
                <View key={t} style={styles.tag}>
                  <Text style={styles.tagText}>#{t}</Text>
                </View>
              ))}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.action}>
                <Ionicons name="thumbs-up-outline" size={16} color={palette.gray} />
                <Text style={styles.actionText}>{r.helpful}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.action}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={palette.gray} />
                <Text style={styles.actionText}>Répondre</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 6,
    margin: 16,
    marginBottom: 8,
  },
  ratingValue: { color: palette.text, fontSize: 28, fontWeight: '700' },
  ratingLabel: { color: palette.gray, fontSize: 13 },
  meta: { color: palette.gray, fontSize: 12 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  breakdownLabel: { color: palette.text, fontWeight: '600', width: 36 },
  breakdownTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    overflow: 'hidden',
  },
  breakdownFill: { height: '100%', backgroundColor: palette.primary },
  breakdownCount: { color: palette.text, fontWeight: '600', width: 30, textAlign: 'right' },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  userName: { color: palette.text, fontWeight: '700', fontSize: 15 },
  ratingBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingBadgeText: { color: '#C2410C', fontWeight: '700', fontSize: 12 },
  comment: { color: palette.text, fontSize: 14, lineHeight: 20 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: palette.gray, fontSize: 12 },
});
