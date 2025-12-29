import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';

export interface ClubGalleryPhoto {
  id?: string;
  clubId: string;
  photoUrl: string;
  storagePath: string;
  description?: string;
  isCover?: boolean;
  uploadedAt?: Timestamp;
  order?: number;
}

const MAX_PHOTOS = 10;

export const useClubGallery = (clubId: string | null) => {
  const [images, setImages] = useState<ClubGalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = async () => {
    if (!clubId) {
      setImages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const galleryCollection = collection(db, 'clubGallery');
      const q = query(
        galleryCollection,
        where('clubId', '==', clubId)
      );
      const snapshot = await getDocs(q);

      const photosData: ClubGalleryPhoto[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ClubGalleryPhoto, 'id'>),
      }));

      // Trier côté client : cover d'abord, puis par uploadedAt
      const sortedPhotos = photosData.sort((a, b) => {
        if (a.isCover) return -1;
        if (b.isCover) return 1;
        const dateA = a.uploadedAt instanceof Timestamp ? a.uploadedAt.toDate() : new Date(0);
        const dateB = b.uploadedAt instanceof Timestamp ? b.uploadedAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setImages(sortedPhotos);
    } catch (err) {
      console.error('Erreur lors du fetch de la galerie:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [clubId]);

  const uploadImage = async (imageUri: string): Promise<{ photoUrl: string; storagePath: string }> => {
    if (!clubId) throw new Error('clubId manquant');

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2);
      const storagePath = `clubs/${clubId}/gallery/${timestamp}_${random}.jpg`;

      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      return { photoUrl: downloadUrl, storagePath };
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      throw err;
    }
  };

  const addImage = async (imageUri: string, description?: string) => {
    if (!clubId) throw new Error('clubId manquant');

    try {
      // Vérifier le nombre de photos existantes
      const q = query(collection(db, 'clubGallery'), where('clubId', '==', clubId));
      const snapshot = await getDocs(q);
      if (snapshot.size >= MAX_PHOTOS) {
        throw new Error('Maximum 10 photos par galerie');
      }

      const { photoUrl, storagePath } = await uploadImage(imageUri);

      // Ajouter à Firestore
      const docData = {
        clubId,
        photoUrl,
        storagePath,
        description: description || '',
        isCover: false,
        uploadedAt: Timestamp.now(),
        order: snapshot.size,
      };

      const docRef = await addDoc(collection(db, 'clubGallery'), docData);

      const newPhoto: ClubGalleryPhoto = {
        id: docRef.id,
        ...docData,
      };

      setImages((prev) => {
        const updated = [...prev, newPhoto];
        return updated.sort((a, b) => {
          if (a.isCover) return -1;
          if (b.isCover) return 1;
          const dateA = a.uploadedAt instanceof Timestamp ? a.uploadedAt.toDate() : new Date(0);
          const dateB = b.uploadedAt instanceof Timestamp ? b.uploadedAt.toDate() : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'image:', err);
      throw err;
    }
  };

  const updateImage = async (photoId: string, updateData: Partial<ClubGalleryPhoto>) => {
    if (!clubId) throw new Error('clubId manquant');

    try {
      // Si on marque cette photo comme cover, dé-marquer les autres
      if (updateData.isCover) {
        const q = query(
          collection(db, 'clubGallery'),
          where('clubId', '==', clubId),
          where('isCover', '==', true)
        );
        const snapshot = await getDocs(q);
        for (const doc of snapshot.docs) {
          if (doc.id !== photoId) {
            await updateDoc(doc.ref, { isCover: false });
          }
        }
      }

      const photoRef = doc(db, 'clubGallery', photoId);
      await updateDoc(photoRef, updateData);

      setImages((prev) =>
        prev
          .map((photo) =>
            photo.id === photoId
              ? {
                  ...photo,
                  ...updateData,
                }
              : updateData.isCover && photo.id !== photoId
              ? { ...photo, isCover: false }
              : photo
          )
          .sort((a, b) => {
            if (a.isCover) return -1;
            if (b.isCover) return 1;
            const dateA = a.uploadedAt instanceof Timestamp ? a.uploadedAt.toDate() : new Date(0);
            const dateB = b.uploadedAt instanceof Timestamp ? b.uploadedAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          })
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      throw err;
    }
  };

  const deleteImage = async (photoId: string, storagePath: string) => {
    try {
      // Supprimer de Storage
      try {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
      } catch (storageErr) {
        console.warn('Erreur lors de la suppression du fichier Storage:', storageErr);
      }

      // Supprimer de Firestore
      await deleteDoc(doc(db, 'clubGallery', photoId));

      setImages((prev) => prev.filter((photo) => photo.id !== photoId));
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'image:', err);
      throw err;
    }
  };

  const reorderImages = async (reorderedImages: ClubGalleryPhoto[]) => {
    try {
      // Mettre à jour Firestore avec le nouvel ordre
      for (let i = 0; i < reorderedImages.length; i++) {
        const photo = reorderedImages[i];
        if (photo.id) {
          await updateDoc(doc(db, 'clubGallery', photo.id), {
            order: i,
          });
        }
      }

      setImages(reorderedImages);
    } catch (err) {
      console.error('Erreur lors du réordonner:', err);
      throw err;
    }
  };

  return {
    images,
    loading,
    error,
    addImage,
    updateImage,
    deleteImage,
    reorderImages,
    refetch: fetchGallery,
    canAddMorePhotos: images.length < MAX_PHOTOS,
    remainingPhotos: MAX_PHOTOS - images.length,
    totalPhotos: images.length,
  };
};

