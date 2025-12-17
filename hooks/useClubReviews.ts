import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Review {
  id: string;
  clubId: string;
  bookingId: string;
  educatorId: string;
  ownerId: string;
  ownerName?: string;
  ownerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Hook pour récupérer les avis d'un club
 * Récupère les top 5 avis les plus récents
 */
export const useClubReviews = (clubId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clubId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'reviews'),
        where('clubId', '==', clubId),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Review[];
          
          setReviews(data);
          setLoading(false);
        },
        (err) => {
          console.error('Erreur chargement avis:', err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Erreur setup listener avis:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [clubId]);

  return { reviews, loading, error };
};

/**
 * Hook pour calculer la moyenne des notes d'un club
 */
export const useClubAverageRating = (clubId: string) => {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'reviews'),
        where('clubId', '==', clubId)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const reviews = snapshot.docs.map((doc) => doc.data() as Review);
          
          if (reviews.length === 0) {
            setAverage(0);
            setCount(0);
          } else {
            const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
            setAverage(sum / reviews.length);
            setCount(reviews.length);
          }
          setLoading(false);
        },
        (err) => {
          console.error('Erreur calcul moyenne:', err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Erreur setup average listener:', err);
      setLoading(false);
    }
  }, [clubId]);

  return { average, count, loading };
};

/**
 * Hook pour récupérer TOUS les avis d'un club (pagination)
 */
export const useAllClubReviews = (clubId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clubId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'reviews'),
        where('clubId', '==', clubId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Review[];
          
          setReviews(data);
          setLoading(false);
        },
        (err) => {
          console.error('Erreur chargement tous avis:', err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Erreur setup all reviews listener:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [clubId]);

  return { reviews, loading, error };
};
