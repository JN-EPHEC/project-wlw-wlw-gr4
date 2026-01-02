import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Payment, CreatePaymentInput, PaymentStats, PaymentDisplay } from '@/types/Payment';

interface UseFetchClubPaymentsResult {
  payments: PaymentDisplay[];
  stats: PaymentStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les paiements d'un club
 * Récupère tous les paiements où receiverUserId = clubId
 * 
 * @param clubId - ID du club
 * @returns Paiements du club avec stats
 */
export const useFetchClubPayments = (clubId: string | null): UseFetchClubPaymentsResult => {
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
    if (!clubId) {
      console.log('useFetchClubPayments: clubId is null, skipping listener');
      setPayments([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useFetchClubPayments] Setting up real-time listener for clubId:', clubId);
      console.log('🔍 [useFetchClubPayments] Searching for payments where receiverUserId ==', clubId);
      setLoading(true);
      setError(null);

      // Requête: Tous les paiements où receiverUserId = clubId (LISTENER TEMPS RÉEL)
      const paymentsCollection = collection(db, 'payments');
      const q = query(
        paymentsCollection,
        where('receiverUserId', '==', clubId)
      );

      // Utiliser onSnapshot pour un listener temps réel
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log(`✅ [useFetchClubPayments] Listener triggered! Found ${snapshot.size} payments for clubId: ${clubId}`);

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

        // Trier côté client au lieu de côté serveur (évite le besoin d'index composite)
        paymentsData.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return dateB - dateA; // DESC
        });

        setPayments(paymentsData);

        // Calculer les stats
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
        setLoading(false);
        console.log('📊 [useFetchClubPayments] Stats:', calculatedStats);
      }, (err) => {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ [useFetchClubPayments] Error:', errorMsg);
        setError(errorMsg);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [useFetchClubPayments] Setup error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      return () => {};
    }
  };

  useEffect(() => {
    const unsubscribe = setupListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [clubId]);

  return { payments, stats, loading, error, refetch: setupListener };
};

/**
 * Hook pour créer un paiement
 */
export const useCreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (input: CreatePaymentInput): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('💳 [useCreatePayment] Creating payment:', input);

      const paymentData = {
        payerUserId: input.payerUserId,
        receiverUserId: input.receiverUserId,
        amount: input.amount,
        currency: input.currency,
        description: input.description,

        targetRef: input.targetRef,
        targetType: input.targetType,
        targetId: input.targetId,

        clubId: input.clubId || null,
        educatorId: input.educatorId || null,
        bookingId: input.bookingId || null,

        paymentMethodType: input.paymentMethodType || 'card',
        provider: input.provider || 'manual',

        status: input.status || 'completed',

        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        completedAt: input.status === 'completed' ? Timestamp.now() : null,

        metadata: input.metadata || {},
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentData);
      console.log('✅ [useCreatePayment] Payment created:', docRef.id);

      return docRef.id;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [useCreatePayment] Error:', errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading, error };
};

/**
 * Hook pour updater le statut d'un paiement
 */
export const useUpdatePaymentStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (paymentId: string, status: 'completed' | 'pending' | 'failed' | 'refunded') => {
    try {
      setLoading(true);
      setError(null);

      const paymentRef = doc(db, 'payments', paymentId);
      const updateData: any = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (status === 'completed') {
        updateData.completedAt = Timestamp.now();
      } else if (status === 'refunded') {
        updateData.refundedAt = Timestamp.now();
      }

      await updateDoc(paymentRef, updateData);
      console.log('✅ [useUpdatePaymentStatus] Payment updated:', paymentId);

      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [useUpdatePaymentStatus] Error:', errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
};
