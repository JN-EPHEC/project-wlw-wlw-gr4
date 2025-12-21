import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useAllClubReviews, useClubAverageRating } from '@/hooks/useClubReviews';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  gold: '#FBBF24',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubReviews'>;

export default function ClubReviewsScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const clubId = (profile?.clubId as string) || '';
  const { reviews, loading: reviewsLoading } = useAllClubReviews(clubId);
  const { average, count, loading: averageLoading } = useClubAverageRating(clubId);

  const stats = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        breakdown[review.rating as keyof typeof breakdown]++;
      }
    });
    return breakdown;
  }, [reviews]);

  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={14}
            color={star <= rating ? palette.gold : palette.gray}
          />
        ))}
      </View>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 30) return `Il y a ${diffDays}j`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)}mois`;
    return `Il y a ${Math.floor(diffDays / 365)}ans`;
  };

  if (reviewsLoading || averageLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Avis reçus</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avis reçus</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Section Stats */}
        <View style={styles.statsCard}>
          <View style={styles.averageBox}>
            <Text style={styles.averageNumber}>{average.toFixed(1)}</Text>
            <View style={styles.starsContainer}>{renderStars(Math.round(average))}</View>
            <Text style={styles.reviewCount}>{count} avis</Text>
          </View>

          <View style={styles.breakdownBox}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <View key={rating} style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>{rating}★</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${count > 0 ? (stats[rating as keyof typeof stats] / count) * 100 : 0}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.ratingCount}>{stats[rating as keyof typeof stats]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section Avis */}
        {reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={48} color={palette.gray} />
            <Text style={styles.emptyText}>Aucun avis pour le moment</Text>
          </View>
        ) : (
          <View style={styles.reviewsList}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View>
                    <Text style={styles.reviewerName}>{review.ownerName || 'Utilisateur'}</Text>
                    <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                  </View>
                  <View>{renderStars(review.rating)}</View>
                </View>

                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
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
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  statsCard: { backgroundColor: palette.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: palette.border },
  averageBox: { alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: palette.border },
  averageNumber: { fontSize: 48, fontWeight: '700', color: palette.primary },
  starsContainer: { marginVertical: 8 },
  reviewCount: { color: palette.gray, fontSize: 12 },
  breakdownBox: { gap: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ratingLabel: { width: 30, color: palette.text, fontWeight: '600', fontSize: 12 },
  progressBar: { flex: 1, height: 6, backgroundColor: palette.lightGray, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: palette.gold, borderRadius: 3 },
  ratingCount: { width: 30, textAlign: 'right', color: palette.gray, fontSize: 12 },
  reviewsList: { gap: 12 },
  reviewCard: { backgroundColor: palette.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: palette.border },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  reviewerName: { color: palette.text, fontWeight: '600', fontSize: 14 },
  reviewDate: { color: palette.gray, fontSize: 11, marginTop: 2 },
  reviewComment: { color: palette.text, fontSize: 13, lineHeight: 18 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { color: palette.gray, fontSize: 14, marginTop: 12 },
});
