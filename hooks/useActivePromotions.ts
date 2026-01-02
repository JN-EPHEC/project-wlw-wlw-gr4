import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Promotion {
  id: string;
  clubId: string;
  code: string;
  title: string;
  description: string;
  discountPercentage: number;
  isActive: boolean;
  validFrom: Timestamp | Date;
  validUntil: Timestamp | Date;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

interface UseActivePromotionsResult {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer les promotions valides (actives et dans les dates valides)
 * @returns Liste des promotions valides et état
 */
export const useActivePromotions = (): UseActivePromotionsResult => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🎯 [useActivePromotions] Fetching promotions...');

        const promotionsCollection = collection(db, 'promotions');
        const q = query(promotionsCollection, where('isActive', '==', true));

        const snapshot = await getDocs(q);
        const now = new Date();

        const validPromotions: Promotion[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const validFrom = data.validFrom instanceof Timestamp ? data.validFrom.toDate() : new Date(data.validFrom);
          const validUntil = data.validUntil instanceof Timestamp ? data.validUntil.toDate() : new Date(data.validUntil);

          // Vérifier que la promotion est valide en date
          if (now >= validFrom && now <= validUntil) {
            validPromotions.push({
              id: doc.id,
              clubId: data.clubId,
              code: data.code,
              title: data.title,
              description: data.description,
              discountPercentage: data.discountPercentage,
              isActive: data.isActive,
              validFrom,
              validUntil,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            });
          }
        });

        console.log('✅ [useActivePromotions] Found', validPromotions.length, 'valid promotions');
        setPromotions(validPromotions);
      } catch (err) {
        console.error('❌ [useActivePromotions] Error fetching promotions:', err);
        setError('Erreur lors de la récupération des promotions');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return { promotions, loading, error };
};
