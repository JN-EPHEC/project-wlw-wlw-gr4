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

export const useUpdateEducatorProfile = (): UseUpdateEducatorProfileResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (userId: string, data: EducatorProfileUpdate) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📝 [useUpdateEducatorProfile] Updating educator profile:', userId);

      // Préparer les données à sauvegarder avec dot notation
      const updateData: any = {};

      // Copier les champs simples avec la notation profile.xxx
      if (data.firstName !== undefined) updateData['profile.firstName'] = data.firstName.trim();
      if (data.lastName !== undefined) updateData['profile.lastName'] = data.lastName.trim();
      if (data.email !== undefined) updateData['profile.email'] = data.email.trim();
      if (data.phone !== undefined) updateData['profile.phone'] = data.phone.trim();
      if (data.bio !== undefined) updateData['profile.bio'] = data.bio.trim();
      if (data.city !== undefined) updateData['profile.city'] = data.city.trim();
      if (data.postalCode !== undefined) updateData['profile.postalCode'] = data.postalCode.trim();
      if (data.hourlyRate !== undefined) updateData['profile.hourlyRate'] = data.hourlyRate;
      if (data.experienceYears !== undefined) updateData['profile.experienceYears'] = data.experienceYears;
      if (data.specialties !== undefined) updateData['profile.specialties'] = data.specialties;
      if (data.certifications !== undefined) updateData['profile.certifications'] = data.certifications.trim();
      if (data.trainings !== undefined) updateData['profile.trainings'] = data.trainings.trim();
      if (data.methods !== undefined) updateData['profile.methods'] = data.methods;
      if (data.website !== undefined) updateData['profile.website'] = data.website.trim();

      // Gérer l'upload de la photo si fournie
      if (data.photoFile) {
        try {
          console.log('📸 [useUpdateEducatorProfile] Uploading new photo...');
          const response = await fetch(data.photoFile.uri);
          const blob = await response.blob();

          const timestamp = Date.now();
          const random = Math.random().toString(36).slice(2);
          const storagePath = `profile-pictures/${userId}/${timestamp}_${random}.jpg`;

          const storageRef = ref(storage, storagePath);
          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);
          
          updateData['profile.photoUrl'] = downloadUrl;
          console.log('✅ Photo uploaded successfully:', downloadUrl);
        } catch (photoErr) {
          console.error('❌ [useUpdateEducatorProfile] Error uploading photo:', photoErr);
          // Continuer sans la photo - ne pas bloquer la sauvegarde du profil
          console.warn('Photo non uploadée, continuation sans image');
        }
      } else if (data.photoUrl !== undefined) {
        updateData['profile.photoUrl'] = data.photoUrl;
      }

      // Ajouter les métadonnées de mise à jour
      updateData['profile.updatedAt'] = new Date().toISOString();

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
