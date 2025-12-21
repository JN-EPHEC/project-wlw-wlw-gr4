import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';

export interface GalleryImage {
  id: string;
  url: string;
  uploadedAt: any;
  order: number;
}

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];

export const useClubGallery = (clubId: string | null) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
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

      const clubRef = doc(db, 'club', clubId);
      const clubDoc = await getDoc(clubRef);

      if (clubDoc.exists()) {
        const galleryData = clubDoc.data()?.galleryImages || [];
        // Trier par order
        const sortedImages = galleryData.sort((a: any, b: any) => a.order - b.order);
        setImages(sortedImages);
      } else {
        setImages([]);
      }
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

  const uploadImage = async (imageUri: string): Promise<string> => {
    if (!clubId) throw new Error('clubId manquant');

    try {
      // Récupérer le fichier
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Vérifier la taille
      if (blob.size > MAX_FILE_SIZE) {
        throw new Error('La photo doit faire moins de 10MB');
      }

      // Vérifier le format
      if (!ALLOWED_FORMATS.includes(blob.type)) {
        throw new Error('Format non supporté. Utilisez JPEG, PNG, HEIC ou WebP');
      }

      // Uploader vers Firebase Storage avec une structure plus simple
      const timestamp = Date.now();
      const filename = `${clubId}_${timestamp}`;
      // Simplifier le path pour éviter les problèmes de permissions
      const storageRef = ref(storage, `galleries/${clubId}/${filename}`);

      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      return downloadUrl;
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      throw err;
    }
  };

  const addImage = async (imageUri: string) => {
    try {
      const downloadUrl = await uploadImage(imageUri);

      // Ajouter à Firestore
      const clubRef = doc(db, 'club', clubId!);
      const newImage: GalleryImage = {
        id: `${Date.now()}`,
        url: downloadUrl,
        uploadedAt: new Date(),
        order: images.length,
      };

      await updateDoc(clubRef, {
        galleryImages: arrayUnion(newImage),
      });

      await fetchGallery();
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'image:', err);
      throw err;
    }
  };

  const deleteImage = async (imageId: string, imageUrl: string) => {
    try {
      // Supprimer de Storage
      try {
        const fileRef = ref(storage, imageUrl);
        await deleteObject(fileRef);
      } catch (storageErr) {
        console.warn('Erreur lors de la suppression du fichier Storage:', storageErr);
        // Continuer même si la suppression storage échoue
      }

      // Supprimer de Firestore
      const clubRef = doc(db, 'club', clubId!);
      const imageToRemove = images.find(img => img.id === imageId);

      if (imageToRemove) {
        await updateDoc(clubRef, {
          galleryImages: arrayRemove(imageToRemove),
        });
      }

      await fetchGallery();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'image:', err);
      throw err;
    }
  };

  const reorderImages = async (reorderedImages: GalleryImage[]) => {
    try {
      // Mettre à jour l'ordre
      const updatedImages = reorderedImages.map((img, index) => ({
        ...img,
        order: index,
      }));

      // Supprimer tous les anciens et ajouter les nouveaux
      const clubRef = doc(db, 'club', clubId!);

      // Supprimer tous
      for (const img of images) {
        await updateDoc(clubRef, {
          galleryImages: arrayRemove(img),
        });
      }

      // Ajouter les nouveaux avec le nouvel ordre
      for (const img of updatedImages) {
        await updateDoc(clubRef, {
          galleryImages: arrayUnion(img),
        });
      }

      await fetchGallery();
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
    deleteImage,
    reorderImages,
    refetch: fetchGallery,
    canAddMorePhotos: images.length < MAX_PHOTOS,
    remainingPhotos: MAX_PHOTOS - images.length,
    totalPhotos: images.length,
  };
};
