import { useState } from 'react';
import { collection, addDoc, doc, updateDoc, arrayUnion, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

export interface JoinClubInput {
  clubId: string;
  userEmail: string;
  userName: string;
}

interface UseJoinClubResult {
  loading: boolean;
  error: string | null;
  joinClub: (input: JoinClubInput) => Promise<void>;
}

/**
 * Hook pour faire une demande d'adhésion à un club
 * - Crée un pendingMember entry
 * - Ajoute l'utilisateur à club.pendingMembers
 * - Crée une notification pour le club admin
 */
export const useJoinClub = (): UseJoinClubResult => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinClub = async (input: JoinClubInput): Promise<void> => {
    if (!user?.uid) {
      throw new Error('Utilisateur non authentifié');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📝 [useJoinClub] Creating join request for clubId:', input.clubId);

      const now = Timestamp.now();

      // 1. Ajouter à pendingMembers du club
      const clubRef = doc(db, 'club', input.clubId);
      const clubSnap = await getDoc(clubRef);

      if (!clubSnap.exists()) {
        throw new Error('Club non trouvé');
      }

      const pendingMember = {
        userId: user.uid,
        email: input.userEmail,
        name: input.userName,
        requestedAt: now,
        status: 'pending',
      };

      // Ajouter à l'array pendingMembers du club
      await updateDoc(clubRef, {
        pendingMembers: arrayUnion(pendingMember),
        updatedAt: now,
      });

      console.log('✅ [useJoinClub] User added to pendingMembers');

      // 2. Créer une notification pour le club admin (optionnel, mais bon pour UX)
      await addDoc(collection(db, 'notifications'), {
        clubId: input.clubId,
        type: 'pending_member_request',
        title: `Nouvelle demande d'adhésion`,
        message: `${input.userName} demande à rejoindre votre club`,
        userId: user.uid,
        userName: input.userName,
        createdAt: now,
        read: false,
      });

      console.log('✅ [useJoinClub] Notification created for admin');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la demande d\'adhésion';
      console.error('❌ [useJoinClub] Error:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, joinClub };
};
