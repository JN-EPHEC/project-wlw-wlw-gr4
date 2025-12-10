import { useState } from 'react';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface UseAddCommunityMemberResult {
  addMember: (clubId: string, userId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to add a user as a community member of a club
 * This is typically called after a booking is paid
 * @returns Object containing addMember function and loading/error states
 */
export const useAddCommunityMember = (): UseAddCommunityMemberResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = async (clubId: string, userId: string) => {
    if (!clubId || !userId) {
      setError('Club ID et User ID sont requis');
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 [useAddCommunityMember] Adding user:', userId, 'to club:', clubId);

      // Get the General channel for this club (or create it if it doesn't exist)
      const channelsRef = collection(db, 'channels');
      const q = query(
        channelsRef,
        where('clubId', '==', clubId),
        where('name', '==', 'General')
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Create General channel if it doesn't exist
        console.log('📝 [useAddCommunityMember] Creating General channel for club:', clubId);
        const newChannelRef = doc(channelsRef);
        await setDoc(newChannelRef, {
          name: 'General',
          type: 'chat',
          clubId,
          createdBy: 'system',
          createdAt: Timestamp.now(),
          isPrivate: false,
          members: [userId],
        });
        console.log('✅ [useAddCommunityMember] General channel created');
      } else {
        // Add user to existing General channel
        const generalChannel = snapshot.docs[0];
        const generalChannelRef = doc(db, 'channels', generalChannel.id);

        // Check if user is already a member
        const channelData = generalChannel.data();
        if (channelData.members && channelData.members.includes(userId)) {
          console.log('⏭️  [useAddCommunityMember] User already a member of this channel');
          setLoading(false);
          return;
        }

        // Add user to members array
        await updateDoc(generalChannelRef, {
          members: arrayUnion(userId),
        });
        console.log('✅ [useAddCommunityMember] User added to General channel');
      }

      // Also add to announcements channel if it exists
      const announcementsQ = query(
        channelsRef,
        where('clubId', '==', clubId),
        where('name', '==', 'Announcements')
      );

      const announcementsSnapshot = await getDocs(announcementsQ);
      if (!announcementsSnapshot.empty) {
        const announcementsChannel = announcementsSnapshot.docs[0];
        const announcementsChannelRef = doc(db, 'channels', announcementsChannel.id);
        const announcementsData = announcementsChannel.data();

        if (!announcementsData.members || !announcementsData.members.includes(userId)) {
          await updateDoc(announcementsChannelRef, {
            members: arrayUnion(userId),
          });
          console.log('✅ [useAddCommunityMember] User added to Announcements channel');
        }
      }

      setError(null);
      console.log('✨ [useAddCommunityMember] Successfully added member to community');
    } catch (err) {
      console.error('❌ [useAddCommunityMember] Error adding member:', err);
      setError('Erreur lors de l\'ajout à la communauté');
    } finally {
      setLoading(false);
    }
  };

  return { addMember, loading, error };
};
