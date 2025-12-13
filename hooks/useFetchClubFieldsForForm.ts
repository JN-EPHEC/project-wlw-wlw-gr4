import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface FieldOption {
  id: string;
  name: string;
}

interface UseFetchClubFieldsForFormResult {
  fields: FieldOption[];
  loading: boolean;
  error: string | null;
}

export const useFetchClubFieldsForForm = (clubId: string | null): UseFetchClubFieldsForFormResult => {
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useFetchClubFieldsForForm] Fetching fields for clubId:', clubId);
        
        const q = query(collection(db, 'fields'), where('clubId', '==', clubId));
        const snapshot = await getDocs(q);

        const fetchedFields: FieldOption[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedFields.push({
            id: doc.id,
            name: data.name || 'Terrain sans nom',
          });
        });

        console.log('✅ [useFetchClubFieldsForForm] Found', fetchedFields.length, 'fields');
        setFields(fetchedFields);
        setError(null);
      } catch (err) {
        console.error('❌ [useFetchClubFieldsForForm] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
        setFields([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [clubId]);

  return { fields, loading, error };
};
