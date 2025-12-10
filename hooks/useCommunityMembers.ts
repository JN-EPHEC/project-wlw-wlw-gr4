import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface CommunityMember {
  id: string; // userId
  userId: string;
  name?: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  joinedAt: number;
  role: 'member' | 'educator' | 'owner';
}

interface UseCommunityMembersResult {
  members: CommunityMember[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and listen to community members of a club
 * Récupère les données complètes des utilisateurs (nom, email, etc)
 * @param clubId - The club ID to fetch members for
 * @returns Object containing members array, loading state, and error state
 */
export const useCommunityMembers = (clubId: string): UseCommunityMembersResult => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useCommunityMembers] Setting up listener for clubId:', clubId);

      // Real-time listener for community members
      const channelsRef = collection(db, 'channels');
      // Get all channels for this club
      const q = query(
        channelsRef,
        where('clubId', '==', clubId)
      );

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          console.log('📡 [useCommunityMembers] Channels snapshot received');
          const allMemberIds: Set<string> = new Set();

          // Collect all unique member IDs from all channels
          snapshot.docs.forEach((doc) => {
            const channelData = doc.data();
            if (channelData.members && Array.isArray(channelData.members)) {
              channelData.members.forEach((memberId: string) => {
                allMemberIds.add(memberId);
              });
            }
          });

          // Fetch user details for each member
          const membersList: CommunityMember[] = [];
          for (const memberId of Array.from(allMemberIds)) {
            try {
              const userDocRef = doc(db, 'users', memberId);
              const userSnap = await getDoc(userDocRef);
              
              if (userSnap.exists()) {
                const userData = userSnap.data();
                membersList.push({
                  id: memberId,
                  userId: memberId,
                  name: userData.firstName || userData.name || 'Utilisateur',
                  displayName: userData.displayName || userData.firstName || userData.name,
                  email: userData.email || '',
                  avatar: userData.avatar || '',
                  joinedAt: Date.now(),
                  role: 'member',
                });
              } else {
                // User doc doesn't exist, add placeholder
                membersList.push({
                  id: memberId,
                  userId: memberId,
                  name: 'Utilisateur supprimé',
                  displayName: 'Utilisateur supprimé',
                  email: '',
                  joinedAt: Date.now(),
                  role: 'member',
                });
              }
            } catch (err) {
              console.error('Error fetching user data for', memberId, err);
            }
          }

          setMembers(membersList);
          setError(null);
        },
        (err) => {
          console.error('❌ [useCommunityMembers] Error listening to members:', err);
          setError('Erreur lors du chargement des membres');
        }
      );

      setLoading(false);
      return () => unsubscribe();
    } catch (err) {
      console.error('❌ [useCommunityMembers] Error setting up listener:', err);
      setError('Erreur lors du chargement des membres');
      setLoading(false);
    }
  }, [clubId]);

  const refetch = async () => {
    if (!clubId) return;

    try {
      setLoading(true);
      const channelsRef = collection(db, 'channels');
      const q = query(channelsRef, where('clubId', '==', clubId));

      const snapshot = await getDocs(q);
      const allMemberIds: Set<string> = new Set();

      // Collect all unique member IDs from all channels
      snapshot.docs.forEach((doc) => {
        const channelData = doc.data();
        if (channelData.members && Array.isArray(channelData.members)) {
          channelData.members.forEach((memberId: string) => {
            allMemberIds.add(memberId);
          });
        }
      });

      // Fetch user details for each member
      const membersList: CommunityMember[] = [];
      for (const memberId of Array.from(allMemberIds)) {
        try {
          const userDocRef = doc(db, 'users', memberId);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            membersList.push({
              id: memberId,
              userId: memberId,
              name: userData.firstName || userData.name || 'Utilisateur',
              displayName: userData.displayName || userData.firstName || userData.name,
              email: userData.email || '',
              avatar: userData.avatar || '',
              joinedAt: Date.now(),
              role: 'member',
            });
          } else {
            membersList.push({
              id: memberId,
              userId: memberId,
              name: 'Utilisateur supprimé',
              displayName: 'Utilisateur supprimé',
              email: '',
              joinedAt: Date.now(),
              role: 'member',
            });
          }
        } catch (err) {
          console.error('Error fetching user data for', memberId, err);
        }
      }

      setMembers(membersList);
      setError(null);
    } catch (err) {
      console.error('❌ [useCommunityMembers] Error refetching members:', err);
      setError('Erreur lors du rechargement des membres');
    } finally {
      setLoading(false);
    }
  };

  return { members, loading, error, refetch };
};
