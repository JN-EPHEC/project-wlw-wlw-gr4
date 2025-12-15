import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface EducatorInfo {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  averageRating?: number;
}

interface UseFetchEducatorByIdResult {
  educator: EducatorInfo | null;
  loading: boolean;
  error: string | null;
}

export const useFetchEducatorById = (educatorId?: string): UseFetchEducatorByIdResult => {
  const [educator, setEducator] = useState<EducatorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!educatorId) {
      setLoading(false);
      return;
    }

    const fetchEducator = async () => {
      try {
        setLoading(true);
        const educatorRef = doc(db, 'educators', educatorId);
        const snap = await getDoc(educatorRef);

        if (snap.exists()) {
          setEducator({
            id: snap.id,
            ...snap.data(),
          } as EducatorInfo);
          setError(null);
        } else {
          setError('Éducateur non trouvé');
        }
      } catch (err) {
        console.error('❌ [useFetchEducatorById] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchEducator();
  }, [educatorId]);

  return { educator, loading, error };
};
