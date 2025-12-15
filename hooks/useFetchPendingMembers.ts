import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface PendingMember {
  userId: string;
  email: string;
  name: string;
  dogName: string;
  phone: string;
  requestedAt: any; // Timestamp
  status: 'pending';
  bookingId?: string;
}

interface UseFetchPendingMembersResult {
  pendingMembers: PendingMember[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les demandes d'adhésion en attente d'un club
 * @param clubId - The club ID
 * @returns Object containing pending members array, loading state, and error state
 */
export const useFetchPendingMembers = (clubId: string): UseFetchPendingMembersResult => {
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setPendingMembers([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useFetchPendingMembers] Setting up listener for clubId:', clubId);

      // Real-time listener pour le document club
      const clubRef = doc(db, 'club', clubId);
      const unsubscribe = onSnapshot(clubRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const pending = data.pendingMembers || [];
          console.log('📝 [useFetchPendingMembers] Found', pending.length, 'pending members');
          setPendingMembers(pending as PendingMember[]);
          setLoading(false);
        } else {
          console.warn('⚠️ [useFetchPendingMembers] Club document not found:', clubId);
          setPendingMembers([]);
          setLoading(false);
        }
      });

      return () => {
        console.log('🔌 [useFetchPendingMembers] Unsubscribing listener');
        unsubscribe();
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors du fetch';
      console.error('❌ [useFetchPendingMembers] Error:', err);
      setError(errorMsg);
      setLoading(false);
    }
  }, [clubId]);

  const refetch = async () => {
    if (!clubId) return;
    try {
      console.log('🔄 [useFetchPendingMembers] Refetching...');
      const clubRef = doc(db, 'club', clubId);
      const snapshot = await getDoc(clubRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const pending = data.pendingMembers || [];
        setPendingMembers(pending as PendingMember[]);
      }
    } catch (err) {
      console.error('❌ [useFetchPendingMembers] Refetch error:', err);
    }
  };

  return { pendingMembers, loading, error, refetch };
};
