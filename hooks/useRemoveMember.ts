import { useState } from 'react';
import {
  doc,
  updateDoc,
  getDoc,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface RemoveMemberInput {
  clubId: string;
  userId: string;
}

interface UseRemoveMemberResult {
  removeMember: (input: RemoveMemberInput) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to remove a member from a club community
 * @returns Object containing removeMember function and loading/error states
 */
export const useRemoveMember = (): UseRemoveMemberResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMember = async (input: RemoveMemberInput) => {
    if (!input.clubId || !input.userId) {
      setError('Club ID et User ID sont requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [useRemoveMember] Fetching club:', input.clubId);

      const clubRef = doc(db, 'club', input.clubId);
      const clubSnap = await getDoc(clubRef);

      if (!clubSnap.exists()) {
        throw new Error('Club not found');
      }

      console.log('✅ [useRemoveMember] Club found, removing member:', input.userId);

      // Récupérer le membre à supprimer (pour retourner ses infos si besoin)
      const clubData = clubSnap.data();
      const members = clubData.members || [];
      const memberToRemove = members.find((m: any) => m.userId === input.userId);

      if (!memberToRemove) {
        throw new Error('Member not found in club');
      }

      // Supprimer le membre du tableau
      await updateDoc(clubRef, {
        members: arrayRemove(memberToRemove),
        updatedAt: new Date(),
      });

      console.log('✅ [useRemoveMember] Member removed successfully:', input.userId);
      setLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [useRemoveMember] Error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  };

  return { removeMember, loading, error };
};
