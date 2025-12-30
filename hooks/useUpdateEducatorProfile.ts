import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';

export interface EducatorProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  city?: string;
  postalCode?: string;
  hourlyRate?: number;
  experienceYears?: number;
  specialties?: string[];
  certifications?: string;
  trainings?: string;
  methods?: string[];
  website?: string;
  photoFile?: { uri: string; name: string; mimeType: string };
  photoUrl?: string;
}

interface UseUpdateEducatorProfileResult {
  loading: boolean;
  error: string | null;
  updateProfile: (userId: string, data: EducatorProfileUpdate) => Promise<void>;
}

const uploadPhotoToStorage = async (
  file: { uri: string; name: string; mimeType: string },
  folder: string
): Promise<string> => {
  try {
    console.log('📸 Fetching image from URI:', file.uri);
    const response = await fetch(file.uri);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    console.log('📸 Blob size:', blob.size, 'bytes');
    
    if (blob.size === 0) {
      throw new Error('Le fichier image est vide');
    }
    
    const extension = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2);
    const storagePath = `${folder}/${timestamp}_${random}.${extension}`;
    
    console.log('📸 Storage path:', storagePath);
    const storageRef = ref(storage, storagePath);
    
    console.log('📸 Uploading to Firebase Storage...');
    await uploadBytes(storageRef, blob);
    
    console.log('📸 Getting download URL...');
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('✅ Photo uploaded successfully:', downloadUrl);
    
    return downloadUrl;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('❌ Upload error details:', errorMsg, err);
    throw new Error(`Erreur lors du téléchargement de la photo: ${errorMsg}`);
  }
};

export const useUpdateEducatorProfile = (): UseUpdateEducatorProfileResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (userId: string, data: EducatorProfileUpdate) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📝 [useUpdateEducatorProfile] Updating educator profile:', userId);

      // Préparer les données à sauvegarder
      const updateData: any = {};

      // Copier les champs simples
      if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
      if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
      if (data.email !== undefined) updateData.email = data.email.trim();
      if (data.phone !== undefined) updateData.phone = data.phone.trim();
      if (data.bio !== undefined) updateData.bio = data.bio.trim();
      if (data.city !== undefined) updateData.city = data.city.trim();
      if (data.postalCode !== undefined) updateData.postalCode = data.postalCode.trim();
      if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate;
      if (data.experienceYears !== undefined) updateData.experienceYears = data.experienceYears;
      if (data.specialties !== undefined) updateData.specialties = data.specialties;
      if (data.certifications !== undefined) updateData.certifications = data.certifications.trim();
      if (data.trainings !== undefined) updateData.trainings = data.trainings.trim();
      if (data.methods !== undefined) updateData.methods = data.methods;
      if (data.website !== undefined) updateData.website = data.website.trim();

      // Gérer l'upload de la photo si fournie
      if (data.photoFile) {
        try {
          console.log('📸 [useUpdateEducatorProfile] Uploading new photo...');
          const photoUrl = await uploadPhotoToStorage(
            data.photoFile,
            `users/${userId}/profile`
          );
          updateData.photoUrl = photoUrl;
        } catch (photoErr) {
          console.error('❌ [useUpdateEducatorProfile] Error uploading photo:', photoErr);
          throw new Error('Erreur lors du téléchargement de la photo');
        }
      } else if (data.photoUrl !== undefined) {
        updateData.photoUrl = data.photoUrl;
      }

      // Ajouter les métadonnées de mise à jour
      updateData.updatedAt = new Date().toISOString();

      // Mettre à jour dans Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updateData);

      console.log('✅ [useUpdateEducatorProfile] Profile updated successfully');
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil';
      console.error('❌ [useUpdateEducatorProfile] Error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateProfile };
};
