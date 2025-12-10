import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface CommunityChannel {
  id: string;
  name: string;
  type: 'chat' | 'announcements';
  createdBy: string;
  createdAt: number;
  isPrivate: boolean;
  members: string[];
  clubId: string;
}

interface UseCommunityChannelsResult {
  channels: CommunityChannel[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and listen to community channels of a club
 * @param clubId - The club ID to fetch channels for
 * @returns Object containing channels array, loading state, and error state
 */
export const useCommunityChannels = (clubId: string): UseCommunityChannelsResult => {
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setChannels([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useCommunityChannels] Setting up listener for clubId:', clubId);

      // Real-time listener for community channels
      const channelsRef = collection(db, 'channels');
      const q = query(
        channelsRef,
        where('clubId', '==', clubId)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('📡 [useCommunityChannels] Snapshot received with', snapshot.size, 'channels');
          const channelsData: CommunityChannel[] = [];

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            channelsData.push({
              id: doc.id,
              name: data.name || 'Sans nom',
              type: data.type || 'chat',
              createdBy: data.createdBy || '',
              createdAt: data.createdAt || Date.now(),
              isPrivate: data.isPrivate || false,
              members: data.members || [],
              clubId: data.clubId || clubId,
            });
          });

          // Sort by type (announcements first) then by created date
          channelsData.sort((a, b) => {
            if (a.type !== b.type) {
              return a.type === 'announcements' ? -1 : 1;
            }
            return b.createdAt - a.createdAt;
          });

          setChannels(channelsData);
          setError(null);
        },
        (err) => {
          console.error('❌ [useCommunityChannels] Error listening to channels:', err);
          setError('Erreur lors du chargement des canaux');
        }
      );

      setLoading(false);
      return () => unsubscribe();
    } catch (err) {
      console.error('❌ [useCommunityChannels] Error setting up listener:', err);
      setError('Erreur lors du chargement des canaux');
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
      const channelsData: CommunityChannel[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        channelsData.push({
          id: doc.id,
          name: data.name || 'Sans nom',
          type: data.type || 'chat',
          createdBy: data.createdBy || '',
          createdAt: data.createdAt || Date.now(),
          isPrivate: data.isPrivate || false,
          members: data.members || [],
          clubId: data.clubId || clubId,
        });
      });

      channelsData.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'announcements' ? -1 : 1;
        }
        return b.createdAt - a.createdAt;
      });

      setChannels(channelsData);
      setError(null);
    } catch (err) {
      console.error('❌ [useCommunityChannels] Error refetching channels:', err);
      setError('Erreur lors du rechargement des canaux');
    } finally {
      setLoading(false);
    }
  };

  return { channels, loading, error, refetch };
};
