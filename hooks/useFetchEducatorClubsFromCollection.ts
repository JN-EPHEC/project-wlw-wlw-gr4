import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Club {
  id: string;
  name: string;
  city?: string;
  address?: string;
  services?: string;
  logoUrl?: string;
  description?: string;
  [key: string]: any;
}

interface UseFetchEducatorClubsResult {
  clubs: Club[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetch all clubs where the educator is affiliated via clubEducators collection
 */
export const useFetchEducatorClubsFromCollection = (
  educatorId: string
): UseFetchEducatorClubsResult => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!educatorId) {
      setLoading(false);
      return;
    }

    const fetchClubs = async () => {
      try {
        setLoading(true);
        console.log('🔍 [useFetchEducatorClubsFromCollection] Fetching clubs for educatorId:', educatorId);

        // Query clubEducators collection for this educator
        const q = query(
          collection(db, 'clubEducators'),
          where('educatorId', '==', educatorId)
        );

        const affiliationsSnapshot = await getDocs(q);
        
        const educatorClubs: Club[] = [];

        // For each affiliation, fetch the club data
        for (const affiliationDoc of affiliationsSnapshot.docs) {
          const affiliation = affiliationDoc.data() as any;
          const clubId = affiliation.clubId;

          if (clubId) {
            try {
              const clubDoc = await getDoc(doc(db, 'club', clubId));
              if (clubDoc.exists()) {
                const clubData = clubDoc.data() as any;
                educatorClubs.push({
                  id: clubDoc.id,
                  name: clubData.name || 'Sans nom',
                  city: clubData.city,
                  address: clubData.address,
                  services: clubData.services,
                  logoUrl: clubData.logoUrl,
                  description: clubData.description,
                  ...clubData,
                });
              }
            } catch (err) {
              console.warn('⚠️ [useFetchEducatorClubsFromCollection] Could not fetch club:', clubId, err);
            }
          }
        }

        console.log('✅ [useFetchEducatorClubsFromCollection] Found', educatorClubs.length, 'clubs');
        setClubs(educatorClubs);
        setError(null);
      } catch (err) {
        console.error('❌ [useFetchEducatorClubsFromCollection] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [educatorId]);

  return { clubs, loading, error };
};
