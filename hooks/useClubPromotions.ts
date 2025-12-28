import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Promotion {
  id: string;
  clubId: string;
  title: string;
  description: string;
  code: string;
  discountPercentage: number; // 0-100
  validFrom: any;
  validUntil: any;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export const useClubPromotions = (clubId: string | null) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotions = async () => {
    if (!clubId) {
      console.log('useClubPromotions: clubId is null, skipping fetch');
      setPromotions([]);
      setLoading(false);
      return;
    }

    try {
      console.log('useClubPromotions: fetching promotions for clubId:', clubId);
      setLoading(true);
      setError(null);
      const promotionsCollection = collection(db, 'promotions');
      const q = query(promotionsCollection, where('clubId', '==', clubId));
      const snapshot = await getDocs(q);
      console.log('useClubPromotions: found', snapshot.docs.length, 'promotions');
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Promotion[];
      
      setPromotions(data);
    } catch (err) {
      console.error('Erreur lors du fetch des promotions:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [clubId]);

  const addPromotion = async (promotionData: Omit<Promotion, 'id' | 'clubId' | 'createdAt' | 'updatedAt'>) => {
    if (!clubId) throw new Error('clubId manquant');

    try {
      const docRef = await addDoc(collection(db, 'promotions'), {
        ...promotionData,
        clubId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await fetchPromotions();
      return docRef.id;
    } catch (err) {
      console.error('Erreur lors de la création de la promotion:', err);
      throw err;
    }
  };

  const updatePromotion = async (promotionId: string, updates: Partial<Promotion>) => {
    try {
      const promotionRef = doc(db, 'promotions', promotionId);
      await updateDoc(promotionRef, {
        ...updates,
        updatedAt: new Date(),
      });
      await fetchPromotions();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la promotion:', err);
      throw err;
    }
  };

  const deletePromotion = async (promotionId: string) => {
    try {
      console.log('useClubPromotions.deletePromotion: starting deletion for id:', promotionId);
      const promotionRef = doc(db, 'promotions', promotionId);
      await deleteDoc(promotionRef);
      console.log('useClubPromotions.deletePromotion: deletion completed, calling fetchPromotions');
      await fetchPromotions();
      console.log('useClubPromotions.deletePromotion: finished');
    } catch (err) {
      console.error('Erreur lors de la suppression de la promotion:', err);
      throw err;
    }
  };

  return {
    promotions,
    loading,
    error,
    addPromotion,
    updatePromotion,
    deletePromotion,
    refetch: fetchPromotions,
  };
};
