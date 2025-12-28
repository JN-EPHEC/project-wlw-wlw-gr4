import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Field {
  id: string;
  clubId: string;
  name: string;
  address: string;
  notes: string;
  surfaceType: string; // gazon, béton, stabilisé, etc.
  trainingType: string; // agility, obéissance, pistage, etc.
  isIndoor: boolean;
  location?: any; // geopoint - ignoré pour maintenant
  createdAt?: any;
  updatedAt?: any;
}

export const useClubFields = (clubId: string | null) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = async () => {
    if (!clubId) {
      console.log('useClubFields: clubId is null, skipping fetch');
      setFields([]);
      setLoading(false);
      return;
    }

    try {
      console.log('useClubFields: fetching fields for clubId:', clubId);
      setLoading(true);
      setError(null);
      const fieldsCollection = collection(db, 'fields');
      const q = query(fieldsCollection, where('clubId', '==', clubId));
      const snapshot = await getDocs(q);
      console.log('useClubFields: found', snapshot.docs.length, 'fields');
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Field[];
      
      // Trier par date de création (plus récentes en premier)
      data.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setFields(data);
    } catch (err) {
      console.error('Erreur lors du fetch des terrains:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [clubId]);

  const addField = async (fieldData: Omit<Field, 'id' | 'clubId' | 'createdAt' | 'updatedAt'>) => {
    if (!clubId) throw new Error('clubId manquant');

    try {
      console.log('useClubFields.addField: creating new field');
      const docRef = await addDoc(collection(db, 'fields'), {
        ...fieldData,
        clubId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('useClubFields.addField: field created with id:', docRef.id);
      await fetchFields();
      return docRef.id;
    } catch (err) {
      console.error('Erreur lors de la création du terrain:', err);
      throw err;
    }
  };

  const updateField = async (fieldId: string, updates: Partial<Field>) => {
    try {
      console.log('useClubFields.updateField: updating field id:', fieldId);
      const fieldRef = doc(db, 'fields', fieldId);
      await updateDoc(fieldRef, {
        ...updates,
        updatedAt: new Date(),
      });
      console.log('useClubFields.updateField: field updated');
      await fetchFields();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du terrain:', err);
      throw err;
    }
  };

  const deleteField = async (fieldId: string) => {
    try {
      console.log('useClubFields.deleteField: starting deletion for id:', fieldId);
      const fieldRef = doc(db, 'fields', fieldId);
      await deleteDoc(fieldRef);
      console.log('useClubFields.deleteField: deletion completed, calling fetchFields');
      await fetchFields();
      console.log('useClubFields.deleteField: finished');
    } catch (err) {
      console.error('Erreur lors de la suppression du terrain:', err);
      throw err;
    }
  };

  return {
    fields,
    loading,
    error,
    addField,
    updateField,
    deleteField,
    refetch: fetchFields,
  };
};
