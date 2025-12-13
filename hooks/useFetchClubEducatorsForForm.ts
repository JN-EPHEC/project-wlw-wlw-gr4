import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface EducatorOption {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface UseFetchClubEducatorsForFormResult {
  educators: EducatorOption[];
  loading: boolean;
  error: string | null;
}

export const useFetchClubEducatorsForForm = (clubId: string | null): UseFetchClubEducatorsForFormResult => {
  const [educators, setEducators] = useState<EducatorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducators = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useFetchClubEducatorsForForm] Fetching educators for club:', clubId);

        // Récupérer le club pour obtenir la liste des educatorIds
        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);

        if (!clubSnap.exists()) {
          console.log('❌ Club not found');
          setEducators([]);
          setError(null);
          setLoading(false);
          return;
        }

        const clubData = clubSnap.data();
        const educatorIds = clubData?.educatorIds || [];

        if (educatorIds.length === 0) {
          console.log('⚠️ No educators found for this club');
          setEducators([]);
          setError(null);
          setLoading(false);
          return;
        }

        // Récupérer les données de chaque éducateur
        const promises = educatorIds.map(educatorId =>
          new Promise<EducatorOption | null>(async (resolve) => {
            try {
              const educatorRef = doc(db, 'educators', id);
              const educatorSnap = await getDoc(educatorRef);
              if (educatorSnap.exists()) {
                const data = educatorSnap.data();
                resolve({
                  id: educatorSnap.id,
                  firstName: data.firstName || '',
                  lastName: data.lastName || '',
                  fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                });
              } else {
                resolve(null);
              }
            } catch (err) {
              console.error('❌ Error fetching educator', id, err);
              resolve(null);
            }
          })
        );

        const results = await Promise.all(promises);
        const validEducators = results.filter((e) => e !== null) as EducatorOption[];
        
        console.log('✅ [useFetchClubEducatorsForForm] Found', validEducators.length, 'educators');
        setEducators(validEducators);
        setError(null);
      } catch (err) {
        console.error('❌ [useFetchClubEducatorsForForm] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
        setEducators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, [clubId]);

  return { educators, loading, error };
};
