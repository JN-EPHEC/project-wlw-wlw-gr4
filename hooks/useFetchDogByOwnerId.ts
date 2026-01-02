import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface DogInfo {
  id: string;
  name: string;
  breed?: string;
  birthDate?: string; // Age in years, e.g., "2"
  photoUrl?: string;
  additionalPhotos?: string[];
  height?: string;
  weight?: string;
  otherInfo?: string;
  ownerId?: string;
  [key: string]: any;
}

interface UseFetchDogInfoResult {
  dog: DogInfo | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch dog information from 'Chien' collection by owner ID
 */
export const useFetchDogByOwnerId = (ownerId: string): UseFetchDogInfoResult => {
  const [dog, setDog] = useState<DogInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerId) {
      setLoading(false);
      return;
    }

    const fetchDog = async () => {
      try {
        setLoading(true);
        console.log('🔍 [useFetchDogByOwnerId] Fetching dog for ownerId:', ownerId);

        // Query Chien collection for dogs owned by this user
        const q = query(
          collection(db, 'Chien'),
          where('ownerId', '==', ownerId)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // Get the first dog (most cases will have 1 dog per session)
          const dogDoc = snapshot.docs[0];
          const dogData = dogDoc.data() as any;
          
          setDog({
            id: dogDoc.id,
            name: dogData.name || 'N/A',
            breed: dogData.breed,
            birthDate: dogData.birthDate,
            photoUrl: dogData.photoUrl,
            additionalPhotos: dogData.additionalPhotos,
            height: dogData.height,
            weight: dogData.weight,
            otherInfo: dogData.otherInfo,
            ownerId: dogData.ownerId,
            ...dogData,
          });
          console.log('✅ [useFetchDogByOwnerId] Found dog:', dogData.name);
        } else {
          console.log('ℹ️ [useFetchDogByOwnerId] No dog found for ownerId:', ownerId);
          setDog(null);
        }

        setError(null);
      } catch (err) {
        console.error('❌ [useFetchDogByOwnerId] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
        setDog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDog();
  }, [ownerId]);

  return { dog, loading, error };
};
