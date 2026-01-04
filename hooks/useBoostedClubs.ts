import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface BoostedClub {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  distance: string;
  city: string;
  speciality: string;
  image: string;
}

export function useBoostedClubs() {
  const [clubs, setClubs] = useState<BoostedClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBoostedClubs();
  }, []);

  const loadBoostedClubs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les abonnements boost actifs
      const subsCollection = collection(db, 'clubSubscriptions');
      const q = query(
        subsCollection,
        where('type', '==', 'boost'),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);

      const boostedClubsData: BoostedClub[] = [];

      // Pour chaque abonnement boost, récupérer les infos du club
      for (const subDoc of snapshot.docs) {
        const subData = subDoc.data();
        const clubId = subData.clubId;

        if (clubId) {
          const clubDocRef = doc(db, 'club', clubId);
          const clubSnap = await getDoc(clubDocRef);

          if (clubSnap.exists()) {
            const clubData = clubSnap.data();
            boostedClubsData.push({
              id: clubId,
              name: clubData.name || 'Club sans nom',
              rating: typeof clubData.averageRating === 'number' ? clubData.averageRating : (typeof clubData.rating === 'number' ? clubData.rating : 0),
              verified: clubData.verified || false,
              distance: clubData.distance || 'N/A',
              city: clubData.city || clubData.location || 'Ville inconnue',
              speciality: clubData.speciality || clubData.type || 'Entraînement',
              image: clubData.PhotoUrl || clubData.logoUrl || clubData.image || clubData.photoUrl || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
            });
          }
        }
      }

      setClubs(boostedClubsData);
    } catch (err) {
      console.error('Erreur loadBoostedClubs:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des clubs boostés');
    } finally {
      setLoading(false);
    }
  };

  return {
    clubs,
    loading,
    error,
    loadBoostedClubs,
  };
}
