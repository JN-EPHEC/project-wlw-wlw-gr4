import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface UserInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
}

interface UseGetUserNamesResult {
  users: UserInfo[];
  loading: boolean;
  error: string | null;
}

export const useGetUserNames = (participantData: Array<{userId: string; numDogs: number}> | undefined): UseGetUserNamesResult => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userIds = participantData?.map(p => p.userId) || [];
    console.log('🔍 [useGetUserNames] participantData received:', participantData);
    console.log('🔍 [useGetUserNames] extracted userIds:', userIds);
    
    if (!userIds || userIds.length === 0) {
      console.log('⚠️ [useGetUserNames] No userIds provided');
      setUsers([]);
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [useGetUserNames] Fetching info for userIds:', userIds);

        const usersData: UserInfo[] = [];

        // Fetch each user by their document ID
        for (const userId of userIds) {
          try {
            console.log('📄 [useGetUserNames] Fetching user:', userId);
            const userDocRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              const data = userSnap.data();
              const user: UserInfo = {
                id: userSnap.id,
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                email: data.email || '',
              };
              usersData.push(user);
              console.log('✅ [useGetUserNames] User found:', user.fullName);
            } else {
              console.warn('⚠️ [useGetUserNames] User document not found:', userId);
            }
          } catch (err) {
            console.error('❌ [useGetUserNames] Error fetching user:', userId, err);
          }
        }

        console.log('✅ [useGetUserNames] Total found:', usersData.length, 'users');
        setUsers(usersData);
      } catch (err) {
        console.error('❌ [useGetUserNames] Error fetching user names:', err);
        setError('Erreur lors du chargement des participants');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [participantData]);

  return { users, loading, error };
};
