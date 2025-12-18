import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, QueryConstraint } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';

export interface GalleryPhoto {
  id: string;
  clubId: string;
  url: string;
  title?: string;
  description?: string;
  uploadedAt?: any;
  [key: string]: any;
}

interface UseFetchClubGalleryResult {
  photos: GalleryPhoto[];
  loading: boolean;
  error: string | null;
}

// Helper pour convertir un chemin Storage en URL téléchargeable
const getPhotoUrl = async (photoPath: string | any): Promise<string> => {
  // Si c'est déjà une URL complète, retourner tel quel
  if (typeof photoPath === 'string' && (photoPath.startsWith('http://') || photoPath.startsWith('https://'))) {
    return photoPath;
  }

  // Si c'est un chemin Storage (commence par gs:// ou est un simple chemin)
  try {
    if (typeof photoPath === 'string') {
      const photoRef = ref(storage, photoPath);
      return await getDownloadURL(photoRef);
    }
  } catch (err) {
    console.warn('⚠️ Impossible de générer l\'URL pour:', photoPath, err);
  }

  // Fallback: retourner le chemin tel quel
  return photoPath?.toString() || '';
};

export const useFetchClubGallery = (clubId: string): UseFetchClubGalleryResult => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useFetchClubGallery] Fetching gallery for clubId:', clubId);
        
        // Essayer de récupérer depuis une subcollection 'gallery'
        const q = query(
          collection(db, `club/${clubId}/gallery`)
        );
        const snapshot = await getDocs(q);

        const fetchedPhotos: GalleryPhoto[] = [];
        
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const photoUrl = await getPhotoUrl(data.url || data.photoPath || data.storagePath);
          
          fetchedPhotos.push({
            id: doc.id,
            clubId,
            url: photoUrl,
            title: data.title,
            description: data.description,
            uploadedAt: data.uploadedAt,
            ...data,
          } as GalleryPhoto);
        }

        console.log('✅ [useFetchClubGallery] Found', fetchedPhotos.length, 'photos');
        setPhotos(fetchedPhotos);
        setError(null);
      } catch (err) {
        // Fallback: si la subcollection n'existe pas, essayer une collection 'clubPhotos'
        try {
          const q = query(
            collection(db, 'clubPhotos'),
            where('clubId', '==', clubId) as QueryConstraint
          );
          const snapshot = await getDocs(q);

          const fetchedPhotos: GalleryPhoto[] = [];
          
          for (const doc of snapshot.docs) {
            const data = doc.data();
            const photoUrl = await getPhotoUrl(data.url || data.photoPath || data.storagePath);
            
            fetchedPhotos.push({
              id: doc.id,
              clubId,
              url: photoUrl,
              title: data.title,
              description: data.description,
              uploadedAt: data.uploadedAt,
              ...data,
            } as GalleryPhoto);
          }

          console.log('✅ [useFetchClubGallery] Found', fetchedPhotos.length, 'photos in clubPhotos collection');
          setPhotos(fetchedPhotos);
          setError(null);
        } catch (fallbackErr) {
          console.error('❌ [useFetchClubGallery] Error:', fallbackErr);
          setError(fallbackErr instanceof Error ? fallbackErr.message : 'Erreur');
          setPhotos([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [clubId]);

  return { photos, loading, error };
};
