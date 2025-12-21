import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React, { useMemo, useState, useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

import { UserStackParamList } from '@/navigation/types';
import { useAllClubReviews, useClubAverageRating } from '@/hooks/useClubReviews';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  gold: '#FBBF24',
};

type Props = NativeStackScreenProps<UserStackParamList, 'reviews'>;

export default function ReviewsScreen({ navigation, route }: Props) {
  const { clubId = '' } = route.params || {};
  const [filterRating, setFilterRating] = useState<number | null>(null);
  
  // Récupérer les vraies données
  const { reviews, loading: reviewsLoading } = useAllClubReviews(clubId);
  const { average, count, loading: averageLoading } = useClubAverageRating(clubId);

  // Configurer le bouton retour du header
  useLayoutEffect(() => {
    const navigationOptions: NativeStackNavigationOptions = {
      headerTitle: 'Avis',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 12, padding: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#41B6A6" />
        </TouchableOpacity>
      ),
    };
    navigation.setOptions(navigationOptions);
  }, [navigation]);

  // Calculer le breakdown
  const stats = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        breakdown[review.rating as keyof typeof breakdown]++;
      }
    });
    return breakdown;
  }, [reviews]);

  const filtered = filterRating ? reviews.filter((r) => r.rating === filterRating) : reviews;

  const handleBack = () => {
    if (clubId) {
      navigation.navigate('clubDetail', { clubId });
    } else {
      navigation.navigate('home');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={12}
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Avis</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.ratingValue}>{average.toFixed(1)}</Text>
          <Text style={styles.ratingLabel}>sur 5</Text>
          <Text style={styles.meta}>{count} avis</Text>
          <View style={{ width: '100%', gap: 6 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const starCount = stats[star as keyof typeof stats];
              const width = count > 0 ? (starCount / count) * 100 : 0;
              return (
                <TouchableOpacity
                  key={star}
                  style={styles.breakdownRow}
                  onPress={() => setFilterRating(filterRating === star ? null : star)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.breakdownLabel}>{star}★</Text>
                  <View style={styles.breakdownTrack}>
                    <View style={[styles.breakdownFill, { width: `${width}%` }]} />
                  </View>
                  <Text style={styles.breakdownCount}>{starCount}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reviews List */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={48} color={palette.gray} />
            <Text style={styles.emptyText}>
              {filterRating ? 'Aucun avis avec cette note' : 'Aucun avis pour le moment'}
            </Text>
          </View>
        ) : (
          filtered.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <View>
                  <Text style={styles.userName}>{r.ownerName || 'Utilisateur'}</Text>
                  <Text style={styles.meta}>{formatDate(r.createdAt)}</Text>
                </View>
                {renderStars(r.rating)}
              </View>
              <Text style={styles.comment}>{r.comment}</Text>
            </View>
          ))
        )}
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
    backgroundColor: palette.surface,
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
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  userName: { color: palette.text, fontWeight: '700', fontSize: 14 },
  comment: { color: palette.text, fontSize: 13, lineHeight: 18 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { color: palette.gray, fontSize: 14, marginTop: 12 },
});
