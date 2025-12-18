import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface RatingStats {
  averageRating: number;
  totalReviews: number;
}

interface UseClubRatingStatsResult {
  stats: RatingStats;
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer les statistiques de notation d'un club
 * Calcule la note moyenne et le nombre total d'avis
 */
export const useClubRatingStats = (clubId: string): UseClubRatingStatsResult => {
  const [stats, setStats] = useState<RatingStats>({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatingStats = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useClubRatingStats] Fetching rating stats for clubId:', clubId);

        // Récupérer tous les avis du club
        const q = query(
          collection(db, 'reviews'),
          where('clubId', '==', clubId)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.log('✅ [useClubRatingStats] No reviews found for club');
          setStats({ averageRating: 0, totalReviews: 0 });
          setError(null);
          return;
        }

        // Calculer la note moyenne
        let totalRating = 0;
        snapshot.forEach((doc) => {
          const rating = doc.data().rating || 0;
          totalRating += rating;
        });

        const averageRating = totalRating / snapshot.size;
        const totalReviews = snapshot.size;

        console.log(`✅ [useClubRatingStats] Found ${totalReviews} reviews with average rating: ${averageRating.toFixed(1)}`);
        
        setStats({
          averageRating,
          totalReviews,
        });
        setError(null);
      } catch (err) {
        console.error('❌ [useClubRatingStats] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
        setStats({ averageRating: 0, totalReviews: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchRatingStats();
  }, [clubId]);

  return { stats, loading, error };
};
