import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface ClubEducator {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  hourlyRate?: number;
  experienceYears?: number;
  methods?: string[];
  averageRating?: number;
  reviewsCount?: number;
}

interface UseFetchClubEducatorsResult {
  educators: ClubEducator[];
  loading: boolean;
  error: string | null;
}

export const useFetchClubEducators = (educatorIds?: string[]): UseFetchClubEducatorsResult => {
  const [educators, setEducators] = useState<ClubEducator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducators = async () => {
      if (!educatorIds || educatorIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useFetchClubEducators] Fetching educators:', educatorIds);

        // Fetch par document ID (pas par le champ 'id')
        const promises = educatorIds.map(id =>
          new Promise<ClubEducator | null>(async (resolve) => {
            try {
              // Chercher d'abord par document ID
              const docRef = doc(db, 'educators', id);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                resolve({
                  id: docSnap.id,
                  firstName: docSnap.data().firstName || '',
                  lastName: docSnap.data().lastName || '',
                  photoUrl: docSnap.data().photoUrl,
                  email: docSnap.data().email,
                  phone: docSnap.data().phone,
                  hourlyRate: docSnap.data().hourlyRate,
                  experienceYears: docSnap.data().experienceYears,
                  methods: docSnap.data().methods,
                  averageRating: docSnap.data().averageRating,
                  reviewsCount: docSnap.data().reviewsCount,
                } as ClubEducator);
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
        const validEducators = results.filter((e) => e !== null) as ClubEducator[];
        console.log('✅ [useFetchClubEducators] Found', validEducators.length, 'educators');
        setEducators(validEducators);
        setError(null);
      } catch (err) {
        console.error('❌ [useFetchClubEducators] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, [educatorIds?.join(',')]);

  return { educators, loading, error };
};
