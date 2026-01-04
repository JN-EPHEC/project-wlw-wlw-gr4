import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface UseClubImageResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour récupérer l'image de profil d'un club par son ID
 * @param clubId - L'ID du club
 * @returns L'URL de l'image du club, l'état de chargement et les erreurs
 */
export const useClubImage = (clubId: string | null): UseClubImageResult => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }

    const fetchClubImage = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🖼️ [useClubImage] Fetching image for clubId:', clubId);

        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);

        if (!clubSnap.exists()) {
          console.log('❌ [useClubImage] Club not found');
          setError('Club non trouvé');
          setImageUrl(null);
          return;
        }

        const data = clubSnap.data();
        const url = data?.PhotoUrl || data?.logoUrl || data?.profileImage || null;

        console.log('✅ [useClubImage] Found image:', url ? 'yes' : 'no');
        setImageUrl(url);
      } catch (err) {
        console.error('❌ [useClubImage] Error fetching club image:', err);
        setError('Erreur lors de la récupération de l\'image du club');
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClubImage();
  }, [clubId]);

  return { imageUrl, loading, error };
};
