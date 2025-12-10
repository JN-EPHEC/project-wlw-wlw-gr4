import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Field {
  id: string;
  clubId: string;
  name: string;
  address?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  surfaceType?: string; // 'gazebo', 'herbe', 'beton', etc.
  trainingType?: string; // 'agility', 'obedience', etc.
  notes?: string;
  isIndoor?: boolean;
  capacity?: number;
  createdAt?: any;
  updatedAt?: any;
}

interface UseFetchClubFieldsResult {
  fields: Field[];
  loading: boolean;
  error: string | null;
}

export const useFetchClubFields = (clubId: string): UseFetchClubFieldsResult => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useFetchClubFields] Fetching fields for clubId:', clubId);
        
        const q = query(collection(db, 'fields'), where('clubId', '==', clubId));
        const snapshot = await getDocs(q);

        const fetchedFields: Field[] = [];
        snapshot.forEach((doc) => {
          fetchedFields.push({
            id: doc.id,
            ...doc.data(),
          } as Field);
        });

        console.log('✅ [useFetchClubFields] Found', fetchedFields.length, 'fields');
        setFields(fetchedFields);
        setError(null);
      } catch (err) {
        console.error('❌ [useFetchClubFields] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [clubId]);

  return { fields, loading, error };
};
