import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Educator {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  presentation?: string;
  hourlyRate: number;
  experienceYears: number;
  email: string;
  phone: string;
  isActive: boolean;
  city: string;
  availabilityKm?: number;
  methods?: string[];
  trainings?: string[];
  reviewsCount?: number;
  averageRating?: number;
  // Champs compatibilité UI
  image?: string;
  title?: string;
  subtitle?: string;
  rating?: number;
  reviews?: number;
  distance?: string;
  price?: string;
  verified?: boolean;
}

interface UseFetchEducatorsResult {
  educators: Educator[];
  loading: boolean;
  error: string | null;
}

export const useFetchEducators = (): UseFetchEducatorsResult => {
  const [educators, setEducators] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducators = async () => {
      try {
        setLoading(true);
        const educatorsCollection = collection(db, 'educators');
        const q = query(educatorsCollection);
        const snapshot = await getDocs(q);
        
        const educatorsData: Educator[] = snapshot.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            ...data,
            // Ajouter les champs transformés pour compatibilité UI
            image: data.photoUrl || 'https://via.placeholder.com/300x200?text=Educateur',
            title: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Éducateur',
            subtitle: data.presentation || 'Éducateur canin',
            rating: data.averageRating ?? 4.5,
            reviews: data.reviewsCount ?? 0,
            verified: true,
            distance: `${data.availabilityKm ?? 5} km`,
            price: `${data.hourlyRate ?? 40} €/h`,
          } as Educator;
        });
        
        setEducators(educatorsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des éducateurs:', err);
        setError('Erreur lors du chargement des éducateurs');
        setEducators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, []);

  return { educators, loading, error };
};
