import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface UserClubCommunity {
  clubId: string;
  clubName: string;
  logoUrl?: string;
  members: number;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface UseUserClubCommunitiesResult {
  clubs: UserClubCommunity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch clubs where user is a member
 * @param userId - The user ID
 * @returns Object containing clubs array, loading state, and error state
 */
export const useUserClubCommunities = (userId: string): UseUserClubCommunitiesResult => {
  const [clubs, setClubs] = useState<UserClubCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setClubs([]);
      setLoading(false);
      return;
    }

    const fetchUserClubs = async () => {
      try {
        console.log('🔍 [useUserClubCommunities] Fetching clubs for user:', userId);

        // Fetch all clubs
        const clubsRef = collection(db, 'club');
        const clubsSnapshot = await getDocs(clubsRef);

        const userClubs: UserClubCommunity[] = [];

        // Check each club to see if user is a member
        clubsSnapshot.docs.forEach((clubDoc) => {
          const clubData = clubDoc.data();
          const members = clubData.members || [];

          // Check if userId is in the members array
          const isMember = members.some((member: any) => member.userId === userId);

          if (isMember) {
            console.log(`✅ User ${userId} is member of club ${clubDoc.id}`);
            const club = {
              clubId: clubDoc.id,
              clubName: clubData.name || 'Club inconnu',
              logoUrl: clubData.logoUrl || clubData.PhotoUrl,
              members: members.length,
              unreadCount: 0, // TODO: Calculate from unread messages
            };
            console.log(`📌 [useUserClubCommunities] Pushing club:`, JSON.stringify(club));
            userClubs.push(club);
          }
        });

        console.log(`📊 [useUserClubCommunities] Found ${userClubs.length} clubs for user ${userId}`);
        setClubs(userClubs);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('❌ [useUserClubCommunities] Error fetching clubs:', err);
        setError('Erreur lors du chargement des clubs');
        setLoading(false);
      }
    };

    fetchUserClubs();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const clubsRef = collection(db, 'club');
      const clubsSnapshot = await getDocs(clubsRef);

      const userClubs: UserClubCommunity[] = [];

      clubsSnapshot.docs.forEach((clubDoc) => {
        const clubData = clubDoc.data();
        const members = clubData.members || [];

        const isMember = members.some((member: any) => member.userId === userId);

        if (isMember) {
          userClubs.push({
            clubId: clubDoc.id,
            clubName: clubData.name || 'Club inconnu',
            logoUrl: clubData.logoUrl || clubData.PhotoUrl,
            members: members.length,
            unreadCount: 0,
          });
        }
      });

      setClubs(userClubs);
      setError(null);
    } catch (err) {
      console.error('❌ [useUserClubCommunities] Error refetching clubs:', err);
      setError('Erreur lors du rechargement des clubs');
    } finally {
      setLoading(false);
    }
  };

  return { clubs, loading, error, refetch };
};
