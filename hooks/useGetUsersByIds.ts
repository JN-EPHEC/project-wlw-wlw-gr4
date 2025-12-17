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

interface UseGetUsersByIdsResult {
  users: UserInfo[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer les infos de plusieurs utilisateurs par leurs IDs
 * @param userIds Array d'IDs utilisateurs
 */
export const useGetUsersByIds = (userIds: string[] | undefined): UseGetUsersByIdsResult => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ids = userIds || [];
    console.log('🔍 [useGetUsersByIds] userIds received:', ids);
    
    if (!ids || ids.length === 0) {
      console.log('⚠️ [useGetUsersByIds] No userIds provided');
      setUsers([]);
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [useGetUsersByIds] Fetching info for userIds:', ids);

        const usersData: UserInfo[] = [];

        // Fetch each user by their document ID
        for (const userId of ids) {
          try {
            console.log('📄 [useGetUsersByIds] Fetching user:', userId);
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
              console.log('✅ [useGetUsersByIds] User found:', user.fullName);
            } else {
              console.warn('⚠️ [useGetUsersByIds] User document not found:', userId);
              // Ajouter même si pas trouvé pour conserver l'ordre
              usersData.push({
                id: userId,
                fullName: 'Utilisateur inconnu',
              });
            }
          } catch (err) {
            console.error('❌ [useGetUsersByIds] Error fetching user:', userId, err);
            usersData.push({
              id: userId,
              fullName: 'Erreur chargement',
            });
          }
        }

        console.log('✅ [useGetUsersByIds] Total found:', usersData.length, 'users');
        setUsers(usersData);
      } catch (err) {
        console.error('❌ [useGetUsersByIds] Error fetching user names:', err);
        setError('Erreur lors du chargement des participants');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds?.join(',')]); // Dépendance: join pour comparaison d'array

  return { users, loading, error };
};
