import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Club } from '@/hooks/useFetchClubs';

export interface BoostedClubItem extends Club {
  isBoosted: boolean;
}

interface UseBoostedClubsListResult {
  boostedClubs: BoostedClubItem[];
  loading: boolean;
  error: string | null;
}

export const useBoostedClubsList = (): UseBoostedClubsListResult => {
  const [boostedClubs, setBoostedClubs] = useState<BoostedClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoostedClubs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les subscriptions actives avec type "boost"
        const subscriptionsCollection = collection(db, 'clubSubscriptions');
        const q = query(
          subscriptionsCollection,
          where('type', '==', 'boost'),
          where('status', '==', 'active')
        );
        const subscriptionsSnapshot = await getDocs(q);

        // Récupérer les clubIds
        const clubIds = subscriptionsSnapshot.docs.map((doc) => doc.data().clubId);

        // Récupérer les données des clubs
        const clubsCollection = collection(db, 'club');
        const clubsSnapshot = await getDocs(clubsCollection);

        const boostedClubsData: BoostedClubItem[] = clubsSnapshot.docs
          .filter((doc) => clubIds.includes(doc.id))
          .map((doc) => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              ...data,
              isBoosted: true,
              // Ajouter les champs transformés pour compatibilité UI
              image: data.PhotoUrl || data.logoUrl || 'https://via.placeholder.com/300x200?text=Club',
              title: data.name || 'Club sans nom',
              subtitle: data.services || data.clubType || 'Services',
              rating: data.averageRating ?? 0,
              reviews: data.reviewsCount ?? 0,
              verified: data.isVerified ?? false,
              distance: `${data.distanceKm ?? 0} km`,
              price: data.priceLevel === 1 ? '€' : data.priceLevel === 2 ? '€€' : data.priceLevel === 3 ? '€€€' : '€€',
              distanceKm: data.distanceKm ?? 0,
              priceLevel: data.priceLevel ?? 2,
              averageRating: data.averageRating ?? 0,
              services: data.services ?? '',
              name: data.name || 'Club sans nom',
              city: data.city || '',
              description: data.description || '',
              isVerified: data.isVerified ?? false,
            };
          });

        setBoostedClubs(boostedClubsData);
      } catch (err) {
        console.error('Erreur useBoostedClubsList:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des clubs boostés');
      } finally {
        setLoading(false);
      }
    };

    fetchBoostedClubs();
  }, []);

  return {
    boostedClubs,
    loading,
    error,
  };
};
