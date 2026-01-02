import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface EducatorClub {
  clubId: string;
  clubName: string;
  logoUrl?: string;
  members: number;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface UseEducatorClubsResult {
  clubs: EducatorClub[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer tous les clubs d'un éducateur
 * @param educatorId - L'ID de l'éducateur
 * @returns Liste des clubs de l'éducateur avec le nombre de messages non lus
 */
export const useEducatorClubs = (educatorId: string | null): UseEducatorClubsResult => {
  const [clubs, setClubs] = useState<EducatorClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!educatorId) {
      setLoading(false);
      return;
    }

    const fetchEducatorClubs = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [useEducatorClubs] Fetching clubs for educatorId:', educatorId);

        // Query clubEducators collection pour les clubs de cet éducateur
        const clubEducatorsRef = collection(db, 'clubEducators');
        const q = query(clubEducatorsRef, where('educatorId', '==', educatorId), where('isActive', '==', true));

        const snapshot = await getDocs(q);
        console.log('📋 [useEducatorClubs] Found', snapshot.size, 'clubs');

        const clubsData: EducatorClub[] = [];

        // Pour chaque club, récupérer les infos
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const clubId = data.clubId;

          try {
            // Récupérer les données du club
            const clubRef = doc(db, 'club', clubId);
            const clubSnap = await getDoc(clubRef);

            if (clubSnap.exists()) {
              const clubData = clubSnap.data();
              
              // Récupérer le nombre de membres
              const membersRef = collection(db, 'club', clubId, 'members');
              const membersSnap = await getDocs(membersRef);
              const membersCount = membersSnap.size;

              // TODO: Compter les messages non lus depuis la dernière visite
              // Pour maintenant, on met 0
              const unreadCount = 0;

              clubsData.push({
                clubId,
                clubName: clubData?.name || 'Club inconnu',
                logoUrl: clubData?.logoUrl,
                members: membersCount,
                unreadCount,
              });
            }
          } catch (clubErr) {
            console.error('❌ [useEducatorClubs] Error fetching club data for:', clubId, clubErr);
          }
        }

        console.log('✅ [useEducatorClubs] Successfully fetched', clubsData.length, 'clubs');
        setClubs(clubsData);
      } catch (err) {
        console.error('❌ [useEducatorClubs] Error fetching educator clubs:', err);
        setError('Erreur lors de la récupération des clubs');
      } finally {
        setLoading(false);
      }
    };

    fetchEducatorClubs();
  }, [educatorId]);

  return { clubs, loading, error };
};
