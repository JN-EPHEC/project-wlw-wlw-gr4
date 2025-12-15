import { useState } from 'react';
import { doc, getDoc, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface ApproveOrRejectMemberInput {
  clubId: string;
  userId: string;
  email: string;
  name: string;
  action: 'approve' | 'reject';
}

interface UseApproveOrRejectMemberResult {
  loading: boolean;
  error: string | null;
  approveOrRejectMember: (input: ApproveOrRejectMemberInput) => Promise<void>;
}

/**
 * Hook pour accepter ou refuser une demande d'adhésion
 * - Accepter: retire de pendingMembers, ajoute à members
 * - Refuser: retire de pendingMembers
 * 
 * Utilise writeBatch pour une transaction atomique
 */
export const useApproveOrRejectMember = (): UseApproveOrRejectMemberResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveOrRejectMember = async (input: ApproveOrRejectMemberInput): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const clubRef = doc(db, 'club', input.clubId);
      const now = Timestamp.now();

      // Récupérer le document club actuel
      const clubSnap = await getDoc(clubRef);
      if (!clubSnap.exists()) {
        throw new Error('Club not found');
      }

      const clubData = clubSnap.data();
      const pendingMembers = clubData.pendingMembers || [];
      const members = clubData.members || [];

      // Trouver et retirer le pending member
      const pendingIndex = pendingMembers.findIndex((pm: any) => pm.userId === input.userId);
      if (pendingIndex === -1) {
        throw new Error('Pending member not found');
      }

      const pendingMember = pendingMembers[pendingIndex];
      const newPendingMembers = [
        ...pendingMembers.slice(0, pendingIndex),
        ...pendingMembers.slice(pendingIndex + 1),
      ];

      const batch = writeBatch(db);

      if (input.action === 'approve') {
        console.log('✅ [useApproveOrRejectMember] Approving member:', input.userId);

        // Créer le member approuvé
        const approvedMember = {
          userId: input.userId,
          email: input.email,
          name: input.name,
          joinedAt: now,
          role: 'member', // Par défaut, simple member
        };

        const newMembers = [...members, approvedMember];

        // Update club avec new arrays
        batch.update(clubRef, {
          members: newMembers,
          pendingMembers: newPendingMembers,
          updatedAt: now,
        });

        console.log('✅ [useApproveOrRejectMember] Member approved and moved to members');
      } else if (input.action === 'reject') {
        console.log('🚫 [useApproveOrRejectMember] Rejecting member:', input.userId);

        // Juste retirer de pendingMembers
        batch.update(clubRef, {
          pendingMembers: newPendingMembers,
          updatedAt: now,
        });

        console.log('✅ [useApproveOrRejectMember] Member rejected and removed from pending');
      }

      // Commit la transaction
      await batch.commit();
      console.log('💾 [useApproveOrRejectMember] Transaction committed');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la modification';
      console.error('❌ [useApproveOrRejectMember] Error:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, approveOrRejectMember };
};
