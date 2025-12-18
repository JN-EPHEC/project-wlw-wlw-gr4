import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useAllClubReviews, useClubAverageRating } from '@/hooks/useClubReviews';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    gold: '#FBBF24',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubReviews'>;

export default function ClubReviewsScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const clubId = (profile?.clubId as string) || '';
  const { reviews, loading: reviewsLoading } = useAllClubReviews(clubId);
  const { average, count, loading: averageLoading } = useClubAverageRating(clubId);

  const stats = useMemo(() => {
    const breakdown: {[key: number]: number} = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { if(r.rating >= 1 && r.rating <= 5) breakdown[r.rating]++; });
    return breakdown;
  }, [reviews]);

  if (reviewsLoading || averageLoading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Avis & Notes</Text>
        </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statsCard}>
            <Text style={styles.averageRating}>{average.toFixed(1)}</Text>
            <StarRating rating={average} size={28} />
            <Text style={styles.reviewCount}>{count} avis au total</Text>
        </View>
        
        <View style={styles.breakdownCard}>
            {[5, 4, 3, 2, 1].map(rating => (
                <RatingBreakdownRow key={rating} rating={rating} count={stats[rating]} total={count} />
            ))}
        </View>

        {reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Aucun avis pour le moment</Text>
          </View>
        ) : (
          reviews.map(review => <ReviewCard key={review.id} review={review} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const StarRating = ({ rating, size = 16 }: { rating: number, size?: number }) => (
    <View style={{ flexDirection: 'row', gap: 4 }}>
        {[1,2,3,4,5].map(i => <Ionicons key={i} name={i <= rating ? 'star' : 'star-outline'} size={size} color={colors.gold} />)}
    </View>
);

const RatingBreakdownRow = ({ rating, count, total }: any) => (
    <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>{rating} ★</Text>
        <View style={styles.progressBar}><View style={[styles.progressFill, {width: total > 0 ? `${(count/total)*100}%` : '0%'}]} /></View>
        <Text style={styles.breakdownCount}>{count}</Text>
    </View>
);

const ReviewCard = ({ review }: any) => {
    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate?.() || new Date(timestamp);
        return `Il y a ${Math.floor((new Date().getTime() - date.getTime()) / (1000 * 3600 * 24))}j`;
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.reviewerName}>{review.ownerName || 'Anonyme'}</Text>
                <StarRating rating={review.rating} />
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  statsCard: { backgroundColor: colors.surface, borderRadius: 22, padding: 24, alignItems: 'center', gap: 8, elevation: 2 },
  averageRating: { fontSize: 48, fontWeight: 'bold', color: colors.text },
  reviewCount: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  breakdownCard: { backgroundColor: colors.surface, borderRadius: 22, padding: 20, gap: 12, elevation: 2 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  breakdownLabel: { width: 40, fontSize: 14, fontWeight: '600', color: colors.text },
  progressBar: { flex: 1, height: 8, backgroundColor: colors.background, borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 4 },
  breakdownCount: { width: 30, textAlign: 'right', fontSize: 13, color: colors.textMuted },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  reviewerName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  reviewComment: { fontSize: 15, color: colors.textMuted, lineHeight: 22 },
  reviewDate: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 10, textAlign: 'right' },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
});