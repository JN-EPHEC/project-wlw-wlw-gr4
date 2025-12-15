import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  onSnapshot,
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
 * Récupère les membres depuis club.members (approuvés seulement)
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

      // Real-time listener for club document members array
      const clubRef = doc(db, 'club', clubId);
      
      const unsubscribe = onSnapshot(
        clubRef,
        async (snapshot) => {
          if (!snapshot.exists()) {
            console.warn('⚠️ [useCommunityMembers] Club document not found');
            setMembers([]);
            setLoading(false);
            return;
          }

          console.log('📡 [useCommunityMembers] Club snapshot received');
          const clubData = snapshot.data();
          const membersArray = clubData.members || [];
          
          console.log(`📊 [useCommunityMembers] Found ${membersArray.length} members`);

          // Fetch full user data for each member
          const membersList: CommunityMember[] = [];
          
          for (const member of membersArray) {
            try {
              const userDocRef = doc(db, 'users', member.userId);
              const userSnap = await getDoc(userDocRef);
              
              if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log('👤 [useCommunityMembers] User data for', member.userId, ':', userData);
                // Combiner firstName et lastName (depuis profile ou root)
                const firstName = userData.profile?.firstName || userData.firstName;
                const lastName = userData.profile?.lastName || userData.lastName;
                const fullName = firstName && lastName 
                  ? `${firstName} ${lastName}`
                  : firstName || lastName || userData.profile?.name || userData.displayName || userData.name || member.name || 'Utilisateur';
                console.log('📝 Full name computed:', fullName);
                  
                membersList.push({
                  id: member.userId,
                  userId: member.userId,
                  name: fullName,
                  displayName: fullName,
                  email: userData.email || member.email || '',
                  avatar: userData.avatar || member.avatar || '',
                  joinedAt: member.joinedAt?.toMillis?.() || member.joinedAt || Date.now(),
                  role: member.role || 'member',
                });
              } else {
                // User doc doesn't exist, use data from member object
                membersList.push({
                  id: member.userId,
                  userId: member.userId,
                  name: member.name || 'Utilisateur',
                  displayName: member.name || 'Utilisateur',
                  email: member.email || '',
                  avatar: member.avatar || '',
                  joinedAt: member.joinedAt?.toMillis?.() || member.joinedAt || Date.now(),
                  role: member.role || 'member',
                });
              }
            } catch (err) {
              console.error('Error fetching user data for', member.userId, err);
              // Still add the member with available data
              membersList.push({
                id: member.userId,
                userId: member.userId,
                name: member.name || 'Utilisateur',
                displayName: member.name || 'Utilisateur',
                email: member.email || '',
                avatar: member.avatar || '',
                joinedAt: member.joinedAt?.toMillis?.() || Date.now(),
                role: member.role || 'member',
              });
            }
          }

          setMembers(membersList);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('❌ [useCommunityMembers] Error listening to club:', err);
          setError('Erreur lors du chargement des membres');
          setLoading(false);
        }
      );

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
      const clubRef = doc(db, 'club', clubId);
      const snapshot = await getDoc(clubRef);

      if (!snapshot.exists()) {
        console.warn('⚠️ [useCommunityMembers] Club document not found');
        setMembers([]);
        setLoading(false);
        return;
      }

      const clubData = snapshot.data();
      const membersArray = clubData.members || [];

      // Fetch full user data for each member
      const membersList: CommunityMember[] = [];
      
      for (const member of membersArray) {
        try {
          const userDocRef = doc(db, 'users', member.userId);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Combiner firstName et lastName (depuis profile ou root)
            const firstName = userData.profile?.firstName || userData.firstName;
            const lastName = userData.profile?.lastName || userData.lastName;
            const fullName = firstName && lastName 
              ? `${firstName} ${lastName}`
              : firstName || lastName || userData.profile?.name || userData.displayName || userData.name || member.name || 'Utilisateur';
              
            membersList.push({
              id: member.userId,
              userId: member.userId,
              name: fullName,
              displayName: fullName,
              email: userData.email || member.email || '',
              avatar: userData.avatar || member.avatar || '',
              joinedAt: member.joinedAt?.toMillis?.() || member.joinedAt || Date.now(),
              role: member.role || 'member',
            });
          } else {
            membersList.push({
              id: member.userId,
              userId: member.userId,
              name: member.name || 'Utilisateur',
              displayName: member.name || 'Utilisateur',
              email: member.email || '',
              avatar: member.avatar || '',
              joinedAt: member.joinedAt?.toMillis?.() || member.joinedAt || Date.now(),
              role: member.role || 'member',
            });
          }
        } catch (err) {
          console.error('Error fetching user data for', member.userId, err);
          membersList.push({
            id: member.userId,
            userId: member.userId,
            name: member.name || 'Utilisateur',
            displayName: member.name || 'Utilisateur',
            email: member.email || '',
            avatar: member.avatar || '',
            joinedAt: member.joinedAt?.toMillis?.() || Date.now(),
            role: member.role || 'member',
          });
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
