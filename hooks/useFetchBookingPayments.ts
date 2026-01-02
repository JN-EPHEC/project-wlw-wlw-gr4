import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Payment } from '@/types/Payment';

interface UseFetchBookingPaymentsResult {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  totalPaid: number;
  pendingAmount: number;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer tous les paiements d'un booking spécifique
 * Utile pour voir qui a payé dans un cours collectif
 * 
 * @param bookingId - ID du booking
 * @returns Paiements du booking avec summaries
 */
export const useFetchBookingPayments = (bookingId: string | null): UseFetchBookingPaymentsResult => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    if (!bookingId) {
      console.log('useFetchBookingPayments: bookingId is null, skipping fetch');
      setPayments([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useFetchBookingPayments] Fetching payments for bookingId:', bookingId);
      setLoading(true);
      setError(null);

      // Requête: Tous les paiements pour ce booking
      const paymentsCollection = collection(db, 'payments');
      const q = query(
        paymentsCollection,
        where('targetId', '==', bookingId)
      );

      const snapshot = await getDocs(q);
      console.log(`✅ [useFetchBookingPayments] Found ${snapshot.size} payments`);

      const paymentsData: Payment[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Payment;
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate() : data.completedAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        };
      });

      setPayments(paymentsData);

      // Calculer les montants
      const paid = paymentsData
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

      const pending = paymentsData
        .filter((p) => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);

      setTotalPaid(paid);
      setPendingAmount(pending);

      console.log(`📊 [useFetchBookingPayments] Paid: ${paid}, Pending: ${pending}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [useFetchBookingPayments] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [bookingId]);

  return { payments, totalPaid, pendingAmount, loading, error, refetch: fetchPayments };
};
