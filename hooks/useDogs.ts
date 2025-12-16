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
import { useAuth } from '@/context/AuthContext';

export interface Dog {
  id?: string;
  name: string;
  breed: string;
  birthDate?: string;
  gender?: string;
  weight?: string;
  height?: string;
  photoUrl?: string;
  otherInfo?: string;
  vaccineFile?: string;
  ownerId: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function useDogs() {
  const { user } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les chiens de l'utilisateur
  const loadDogs = async () => {
    if (!user) {
      setDogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const dogsCollection = collection(db, 'Chien');
      const q = query(dogsCollection, where('ownerId', '==', user.uid));
      const snapshot = await getDocs(q);

      const dogsData: Dog[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Dog, 'id'>),
      }));

      setDogs(dogsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des chiens';
      setError(message);
      console.error('Erreur loadDogs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadDogs();
  }, [user]);

  // Ajouter un nouveau chien
  const addDog = async (dogData: Omit<Dog, 'id' | 'createdAt' | 'updatedAt'>, photoFile?: { uri: string; name: string; mimeType: string }) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      let photoUrl: string | undefined;

      // Upload photo si présente
      if (photoFile) {
        photoUrl = await uploadPhotoToStorage(photoFile, user.uid);
      }

      // Nettoyer les champs undefined avant d'envoyer à Firestore
      const cleanedData = Object.fromEntries(
        Object.entries(dogData).filter(([_, value]) => value !== undefined && value !== '')
      );

      const docData = {
        ...cleanedData,
        ownerId: user.uid,
        ...(photoUrl && { photoUrl }),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'Chien'), docData);
      const newDog: Dog = {
        id: docRef.id,
        ...docData,
      };

      setDogs((prev) => [...prev, newDog]);
      return docRef.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'ajout du chien';
      setError(message);
      throw err;
    }
  };

  // Mettre à jour un chien
  const updateDog = async (
    dogId: string,
    updates: Partial<Dog>,
    photoFile?: { uri: string; name: string; mimeType: string }
  ) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);
      let photoUrl = updates.photoUrl;

      // Upload nouvelle photo si présente
      if (photoFile) {
        photoUrl = await uploadPhotoToStorage(photoFile, user.uid);
      }

      const docRef = doc(db, 'Chien', dogId);
      
      // Nettoyer les champs undefined avant d'envoyer à Firestore
      const cleanedUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined && value !== '')
      );

      const updateData = {
        ...cleanedUpdates,
        ...(photoUrl && { photoUrl }),
        updatedAt: Timestamp.now(),
      };

      delete (updateData as any).id; // Ne pas mettre à jour l'ID
      await updateDoc(docRef, updateData);

      setDogs((prev) =>
        prev.map((dog) =>
          dog.id === dogId
            ? {
                ...dog,
                ...updateData,
                id: dogId,
              }
            : dog
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du chien';
      setError(message);
      throw err;
    }
  };

  // Supprimer un chien
  const deleteDog = async (dogId: string, photoUrl?: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      setError(null);

      // Supprimer la photo si présente
      if (photoUrl) {
        await deletePhotoFromStorage(photoUrl);
      }

      await deleteDoc(doc(db, 'Chien', dogId));
      setDogs((prev) => prev.filter((dog) => dog.id !== dogId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression du chien';
      setError(message);
      throw err;
    }
  };

  // Upload photo vers Firebase Storage
  const uploadPhotoToStorage = async (
    file: { uri: string; name: string; mimeType: string },
    userId: string
  ): Promise<string> => {
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2);
      const extension = file.name.split('.').pop() || 'jpg';
      const storagePath = `dogs/${userId}/${timestamp}_${random}.${extension}`;

      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      return downloadUrl;
    } catch (err) {
      console.error('Erreur lors de l\'upload de la photo:', err);
      throw err;
    }
  };

  // Supprimer photo depuis Firebase Storage
  const deletePhotoFromStorage = async (photoUrl: string) => {
    try {
      const storageRef = ref(storage, photoUrl);
      await deleteObject(storageRef);
    } catch (err) {
      console.warn('Erreur lors de la suppression de la photo:', err);
      // Ne pas throw pour éviter de bloquer la suppression du chien
    }
  };

  return {
    dogs,
    loading,
    error,
    addDog,
    updateDog,
    deleteDog,
    loadDogs,
  };
}
