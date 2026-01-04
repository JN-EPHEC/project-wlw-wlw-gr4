import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';

export interface ActiveBoost {
  id: string;
  planId: string;
  planName: string;
  price: number;
  startDate: Date;
  endDate: Date;
  durationDays: number;
}

const PLAN_NAMES: Record<string, string> = {
  'boost-basic': 'Boost Basique',
  'boost-premium': 'Boost Premium',
  'boost-pro': 'Boost Pro',
};

export function useClubActiveBoost(clubId: string | undefined) {
  const [activeBoost, setActiveBoost] = useState<ActiveBoost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActiveBoost();
  }, [clubId]);

  const loadActiveBoost = async () => {
    if (!clubId) {
      setLoading(false);
      setActiveBoost(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const subsCollection = collection(db, 'clubSubscriptions');
      const q = query(
        subsCollection,
        where('clubId', '==', clubId),
        where('type', '==', 'boost'),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setActiveBoost(null);
        return;
      }

      // Parcourir les documents et trouver le boost actif avec la startDate la plus récente
      let currentActiveBoost: ActiveBoost | null = null;

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const endDate = data.endDate instanceof Timestamp 
          ? data.endDate.toDate() 
          : new Date(data.endDate);

        // Vérifier que la date de fin est dans le futur
        if (endDate > now) {
          const startDate = data.startDate instanceof Timestamp
            ? data.startDate.toDate()
            : new Date(data.startDate);

          const boost: ActiveBoost = {
            id: doc.id,
            planId: data.planId,
            planName: PLAN_NAMES[data.planId] || data.planId,
            price: data.price,
            startDate,
            endDate,
            durationDays: data.durationDays,
          };

          // Garder le boost avec la startDate la plus récente
          if (!currentActiveBoost || boost.startDate > currentActiveBoost.startDate) {
            currentActiveBoost = boost;
          }
        }
      }

      setActiveBoost(currentActiveBoost);
    } catch (err) {
      console.error('Erreur loadActiveBoost:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du boost actif');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return {
    activeBoost,
    loading,
    error,
    formatDate,
    refetch: loadActiveBoost,
  };
}
