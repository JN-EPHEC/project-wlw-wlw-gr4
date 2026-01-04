import { useState } from 'react';
import { getStorage, ref, uploadBytes, getBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface DogDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Timestamp;
  size: number;
}

export const useDogDocuments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const storage = getStorage();

  const uploadDocument = async (
    userId: string,
    fileUri: string,
    fileName: string,
    mimeType: string
  ): Promise<DogDocument | null> => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer le fichier
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Créer un ID unique pour le document
      const docId = `${Date.now()}_${fileName}`;
      // Important: Utiliser userId pour correspondre aux Storage rules
      const storageRef = ref(storage, `dogs/${userId}/documents/${docId}`);

      // Uploader le fichier
      await uploadBytes(storageRef, blob, {
        contentType: mimeType,
      });

      // Obtenir l'URL de téléchargement
      const downloadUrl = await getDownloadURL(storageRef);

      // Créer l'objet document
      const dogDocument: DogDocument = {
        id: docId,
        name: fileName,
        type: mimeType,
        url: downloadUrl,
        uploadedAt: Timestamp.now(),
        size: blob.size,
      };

      console.log('✅ [useDogDocuments] Document uploaded:', fileName);
      return dogDocument;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      console.error('❌ [useDogDocuments] Error:', err);
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (dogId: string, documentId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const storageRef = ref(storage, `dogs/${dogId}/documents/${documentId}`);
      await deleteObject(storageRef);

      console.log('✅ [useDogDocuments] Document deleted:', documentId);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      console.error('❌ [useDogDocuments] Error:', err);
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addDocumentToDog = async (
    dogId: string,
    document: DogDocument
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const dogRef = doc(db, 'Chien', dogId);
      await updateDoc(dogRef, {
        vaccineFile: document,
        updatedAt: Timestamp.now(),
      });

      console.log('✅ [useDogDocuments] Document added to dog');
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      console.error('❌ [useDogDocuments] Error:', err);
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadDocument,
    deleteDocument,
    addDocumentToDog,
    loading,
    error,
  };
};
