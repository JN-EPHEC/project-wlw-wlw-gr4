import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface ClubData {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  logoUrl?: string;
  PhotoUrl?: string;
  ownerUserId: string;
  educatorIds?: string[];
  averageRating?: number;
  reviewsCount?: number;
  createdAt?: any;
  isVerified?: boolean;
  [key: string]: any; // Pour permettre d'autres champs
}

interface UseClubDataResult {
  club: ClubData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour fetcher les données d'un club en temps réel
 * @param clubId - L'ID du club à fetcher
 * @returns { club, loading, error }
 */
export function useClubData(clubId: string): UseClubDataResult {
  const [club, setClub] = useState<ClubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      setError('Club ID is required');
      return;
    }

    // Utilise un real-time listener pour les mises à jour instantanées
    const unsubscribe = onSnapshot(
      doc(db, 'clubs', clubId),
      (docSnap) => {
        if (docSnap.exists()) {
          setClub({ id: docSnap.id, ...docSnap.data() } as ClubData);
          setError(null);
        } else {
          setClub(null);
          setError('Club not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching club:', err);
        setError('Failed to load club data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [clubId]);

  return { club, loading, error };
}
