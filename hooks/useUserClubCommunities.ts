import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
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
 * Hook to fetch clubs where user is a community member
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

    try {
      console.log('🔍 [useUserClubCommunities] Fetching clubs for user:', userId);

      // Query all channels where user is a member
      const channelsRef = collection(db, 'channels');
      const q = query(channelsRef, where('members', 'array-contains', userId));

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          console.log('📡 [useUserClubCommunities] Snapshot received with', snapshot.size, 'channels');
          const clubsMap: Map<string, UserClubCommunity> = new Map();

          // Group channels by clubId to get unique clubs
          snapshot.docs.forEach((doc) => {
            const channelData = doc.data();
            const clubId = channelData.clubId;

            if (clubId && !clubsMap.has(clubId)) {
              clubsMap.set(clubId, {
                clubId,
                clubName: channelData.clubName || 'Club sans nom',
                logoUrl: channelData.clubLogoUrl,
                members: channelData.members?.length || 0,
                unreadCount: 0,
                lastMessage: undefined,
                lastMessageTime: undefined,
              });
            }
          });

          // Fetch club details to get logo and name
          if (clubsMap.size > 0) {
            const clubsRef = collection(db, 'clubs');
            const clubIds = Array.from(clubsMap.keys());

            for (const clubId of clubIds) {
              try {
                const clubDoc = await getDocs(
                  query(clubsRef, where('__name__', '==', clubId))
                );
                if (!clubDoc.empty) {
                  const clubData = clubDoc.docs[0].data();
                  const club = clubsMap.get(clubId);
                  if (club) {
                    club.clubName = clubData.name || club.clubName;
                    club.logoUrl = clubData.logoUrl || clubData.PhotoUrl;
                  }
                }
              } catch (err) {
                console.log(`⚠️ [useUserClubCommunities] Could not fetch club ${clubId}`);
              }
            }
          }

          setClubs(Array.from(clubsMap.values()));
          setError(null);
        },
        (err) => {
          console.error('❌ [useUserClubCommunities] Error listening to clubs:', err);
          setError('Erreur lors du chargement des clubs');
        }
      );

      setLoading(false);
      return () => unsubscribe();
    } catch (err) {
      console.error('❌ [useUserClubCommunities] Error setting up listener:', err);
      setError('Erreur lors du chargement des clubs');
      setLoading(false);
    }
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const channelsRef = collection(db, 'channels');
      const q = query(channelsRef, where('members', 'array-contains', userId));

      const snapshot = await getDocs(q);
      const clubsMap: Map<string, UserClubCommunity> = new Map();

      snapshot.docs.forEach((doc) => {
        const channelData = doc.data();
        const clubId = channelData.clubId;

        if (clubId && !clubsMap.has(clubId)) {
          clubsMap.set(clubId, {
            clubId,
            clubName: channelData.clubName || 'Club sans nom',
            logoUrl: channelData.clubLogoUrl,
            members: channelData.members?.length || 0,
            unreadCount: 0,
          });
        }
      });

      setClubs(Array.from(clubsMap.values()));
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
