import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Payment, PaymentStats, PaymentDisplay } from '@/types/Payment';

interface UseFetchEducatorPaymentsResult {
  payments: PaymentDisplay[];
  stats: PaymentStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les paiements d'un éducateur
 * Récupère tous les paiements où receiverUserId = educatorId ET educatorId is set
 * 
 * @param educatorId - ID de l'éducateur
 * @returns Paiements de l'éducateur avec stats
 */
export const useFetchEducatorPayments = (educatorId: string | null): UseFetchEducatorPaymentsResult => {
  const [payments, setPayments] = useState<PaymentDisplay[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
    totalAmount: 0,
    pendingAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setupListener = () => {
    if (!educatorId) {
      console.log('useFetchEducatorPayments: educatorId is null, skipping listener');
      setPayments([]);
      setLoading(false);
      return;
    }

    console.log('🔍 [useFetchEducatorPayments] Setting up real-time listener for educatorId:', educatorId);
    setLoading(true);
    setError(null);

    // Real-time query: All payments where receiverUserId = educatorId
    const paymentsCollection = collection(db, 'payments');
    const q = query(
      paymentsCollection,
      where('receiverUserId', '==', educatorId)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(`✅ [useFetchEducatorPayments] Received ${snapshot.size} payments`);

        // Map les documents en PaymentDisplay
        const paymentsData: PaymentDisplay[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Payment;
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : data.completedAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
          };
        });

        // Sort client-side instead of server-side (avoids composite index requirement)
        paymentsData.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return dateB - dateA; // DESC
        });

        setPayments(paymentsData);

        // Calculate stats
        const calculatedStats: PaymentStats = {
          total: paymentsData.length,
          completed: paymentsData.filter((p) => p.status === 'completed').length,
          pending: paymentsData.filter((p) => p.status === 'pending').length,
          failed: paymentsData.filter((p) => p.status === 'failed').length,
          refunded: paymentsData.filter((p) => p.status === 'refunded').length,
          totalAmount: paymentsData
            .filter((p) => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0),
          pendingAmount: paymentsData
            .filter((p) => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0),
        };

        setStats(calculatedStats);
        console.log('📊 [useFetchEducatorPayments] Stats updated:', calculatedStats);
        setLoading(false);
      },
      (err) => {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ [useFetchEducatorPayments] Listener error:', errorMsg);
        setError(errorMsg);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = setupListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [educatorId]);

  return { payments, stats, loading, error, refetch: setupListener };
};
