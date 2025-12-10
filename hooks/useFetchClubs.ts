import { useEffect, useState } from 'react';
import { collection, query, getDocs, QueryConstraint, where } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '@/firebaseConfig';

export interface Club {
  id: string;
  PhotoUrl?: string;
  address: string;
  averageRating: number;
  cancellationPolicy?: string;
  certifications?: string;
  city: string;
  clubType: string;
  createdAt: any;
  description: string;
  educatorId?: string;
  email: string;
  image?: string; // Pour compatibilité avec l'UI
  language?: string;
  location: string;
  logoUrl?: string;
  maxGroupSize: number;
  name: string;
  ownerUserId: string;
  paymentSettings?: any;
  phone: string;
  reviewsCount: number;
  reviews?: number; // Pour compatibilité avec l'UI
  services: string;
  stats?: {
    totalBookings: number;
    totalDogs: number;
    totalMembers: number;
  };
  subtitle?: string; // Pour compatibilité avec l'UI
  title?: string; // Pour compatibilité avec l'UI
  website?: string;
  isVerified: boolean;
  verified?: boolean; // Pour compatibilité avec l'UI
  priceLevel: number; // 1, 2, 3
  price?: string; // Pour compatibilité avec l'UI
  distanceKm: number;
  distance?: string; // Pour compatibilité avec l'UI
  rating?: number; // Pour compatibilité avec l'UI
}

interface UseFetchClubsResult {
  clubs: Club[];
  loading: boolean;
  error: string | null;
}

export const useFetchClubs = (): UseFetchClubsResult => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        
        // S'authentifier anonymement si nécessaire
        if (!auth.currentUser) {
          try {
            await signInAnonymously(auth);
          } catch (authErr) {
            console.warn('Impossible de s\'authentifier anonymement:', authErr);
            // Continuer quand même - les règles peuvent autoriser les requêtes non authentifiées
          }
        }
        
        const clubsCollection = collection(db, 'club');
        const q = query(clubsCollection);
        const snapshot = await getDocs(q);
        
        const clubsData: Club[] = snapshot.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            ...data,
            // Ajouter les champs transformés pour compatibilité UI avec valeurs par défaut
            image: data.PhotoUrl || data.logoUrl || 'https://via.placeholder.com/300x200?text=Club',
            title: data.name || 'Club sans nom',
            subtitle: data.services || data.clubType || 'Services',
            rating: data.averageRating ?? 0,
            reviews: data.reviewsCount ?? 0,
            verified: data.isVerified ?? false,
            distance: `${data.distanceKm ?? 0} km`,
            price: data.priceLevel === 1 ? '€' : data.priceLevel === 2 ? '€€' : data.priceLevel === 3 ? '€€€' : '€€',
            // Valeurs par défaut pour les champs requis par le filtrage
            distanceKm: data.distanceKm ?? 0,
            priceLevel: data.priceLevel ?? 2,
            averageRating: data.averageRating ?? 0,
            services: data.services ?? '',
            name: data.name || 'Club sans nom',
            city: data.city || '',
            description: data.description || '',
            isVerified: data.isVerified ?? false,
          } as Club;
        });
        
        setClubs(clubsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des clubs:', err);
        setError('Erreur lors du chargement des clubs');
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return { clubs, loading, error };
};

// Fonction utilitaire pour filtrer les clubs
export const filterClubs = (
  clubs: Club[],
  distance: number,
  priceRange: string[],
  specialties: string[],
  minRating: string,
  verifiedOnly: boolean,
  searchQuery: string
): Club[] => {
  return clubs.filter(club => {
    // Filtre distance
    if (club.distanceKm == null || club.distanceKm > distance) return false;

    // Filtre prix
    if (priceRange.length > 0 && club.priceLevel != null) {
      const clubPrice = club.priceLevel.toString();
      const priceInRange = priceRange.includes('€') && clubPrice === '1' ||
                          priceRange.includes('€€') && clubPrice === '2' ||
                          priceRange.includes('€€€') && clubPrice === '3';
      if (!priceInRange) return false;
    }

    // Filtre spécialités
    if (specialties.length > 0 && club.services) {
      const clubServices = club.services.toLowerCase().split(',').map(s => s.trim());
      const hasSpecialty = specialties.some(spec => 
        clubServices.some(service => 
          service.includes(spec.toLowerCase()) || 
          spec.toLowerCase().includes(service)
        )
      );
      if (!hasSpecialty) return false;
    }

    // Filtre note minimum
    if (minRating !== 'Toutes' && club.averageRating != null) {
      const minRatingValue = parseFloat(minRating.replace('+', ''));
      if (club.averageRating < minRatingValue) return false;
    }

    // Filtre clubs vérifiés
    if (verifiedOnly && !club.isVerified) return false;

    // Filtre recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = club.name?.toLowerCase().includes(query) || false;
      const matchCity = club.city?.toLowerCase().includes(query) || false;
      const matchDescription = club.description?.toLowerCase().includes(query) || false;
      if (!matchName && !matchCity && !matchDescription) return false;
    }

    return true;
  });
};
