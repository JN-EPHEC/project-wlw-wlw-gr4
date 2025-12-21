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
        
        // 1. Récupérer tous les utilisateurs avec role "club"
        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection, where('role', '==', 'club'));
        const usersSnapshot = await getDocs(usersQuery);
        
        const clubUsers: Map<string, any> = new Map();
        usersSnapshot.docs.forEach(doc => {
          clubUsers.set(doc.id, {
            id: doc.id,
            ...doc.data()
          });
        });
        
        // 2. Récupérer la collection club existante
        const clubsCollection = collection(db, 'club');
        const clubsQuery = query(clubsCollection);
        const clubsSnapshot = await getDocs(clubsQuery);
        
        const clubsFromCollection: Map<string, any> = new Map();
        clubsSnapshot.docs.forEach(doc => {
          clubsFromCollection.set(doc.id, {
            id: doc.id,
            ...doc.data()
          });
        });
        
        // 3. Merger les données: pour chaque utilisateur club, chercher les données détaillées
        const mergedClubs: Club[] = [];
        
        // D'abord, ajouter les clubs de la collection club (ils ont des données détaillées)
        clubsFromCollection.forEach((clubData) => {
          // Chercher l'ownerUserId : d'abord depuis le champ, sinon utiliser l'ID du document
          const ownerUserId = clubData.ownerUserId || clubData.id;
          const userData = clubUsers.get(ownerUserId);
          
          console.log('🔍 [useFetchClubs] Processing club:', {
            clubId: clubData.id,
            ownerUserId,
            hasUserData: !!userData,
            userName: userData?.displayName,
            clubName: clubData.name,
            userClubName: userData?.profile?.clubName
          });
          
          const mergedData = {
            ...userData?.profile, // données du profil utilisateur
            ...clubData, // données de la collection club (prioritaires)
          };
          
          const club: Club = {
            id: clubData.id,
            PhotoUrl: clubData.PhotoUrl || clubData.logoUrl || userData?.profile?.logoUrl,
            address: clubData.address || userData?.profile?.address || '',
            averageRating: clubData.averageRating ?? 0,
            cancellationPolicy: clubData.cancellationPolicy,
            certifications: clubData.certifications,
            city: clubData.city || userData?.profile?.city || '',
            clubType: clubData.clubType || 'public',
            createdAt: clubData.createdAt,
            description: clubData.description || userData?.profile?.description || '',
            educatorId: clubData.educatorIds?.[0],
            email: clubData.email || userData?.email || '',
            image: clubData.PhotoUrl || clubData.logoUrl || userData?.profile?.logoUrl || 'https://via.placeholder.com/300x200?text=Club',
            language: clubData.language,
            location: clubData.location,
            logoUrl: clubData.logoUrl || userData?.profile?.logoUrl,
            maxGroupSize: clubData.maxGroupSize ?? 10,
            name: clubData.name || userData?.profile?.clubName || userData?.displayName || 'Club',
            ownerUserId: clubData.ownerUserId || clubData.id,
            paymentSettings: clubData.paymentSettings,
            phone: clubData.phone || userData?.profile?.phone || '',
            reviewsCount: clubData.reviewsCount ?? 0,
            reviews: clubData.reviewsCount ?? 0,
            services: clubData.services || userData?.profile?.services?.join(', ') || '',
            stats: clubData.stats,
            subtitle: clubData.services || userData?.profile?.services?.join(', ') || 'Services',
            title: clubData.name || userData?.profile?.clubName || userData?.displayName || 'Club',
            website: clubData.website || userData?.profile?.website || '',
            isVerified: clubData.isVerified ?? false,
            verified: clubData.isVerified ?? false,
            priceLevel: clubData.priceLevel ?? 2,
            price: clubData.priceLevel === 1 ? '€' : clubData.priceLevel === 2 ? '€€' : clubData.priceLevel === 3 ? '€€€' : '€€',
            distanceKm: clubData.distanceKm ?? 0,
            distance: `${clubData.distanceKm ?? 0} km`,
            rating: clubData.averageRating ?? 0,
          };
          
          mergedClubs.push(club);
        });
        
        // Ensuite, ajouter les utilisateurs club qui n'ont pas de document club correspondant
        clubUsers.forEach((userData, userId) => {
          // Vérifier si ce club user existe déjà dans la collection club
          const existingClub = Array.from(clubsFromCollection.values()).find(
            c => c.ownerUserId === userId
          );
          
          if (!existingClub) {
            // Créer un objet club à partir des données utilisateur
            const servicesString = userData.profile?.services?.join(', ') || '';
            const club: Club = {
              id: userId, // Utiliser l'ID utilisateur comme ID du club
              PhotoUrl: userData.profile?.logoUrl,
              address: userData.profile?.address || '',
              averageRating: 0,
              cancellationPolicy: undefined,
              certifications: undefined,
              city: userData.profile?.city || '',
              clubType: 'public',
              createdAt: new Date(),
              description: userData.profile?.description || '',
              educatorId: undefined,
              email: userData.email || '',
              image: userData.profile?.logoUrl || 'https://via.placeholder.com/300x200?text=Club',
              language: undefined,
              location: '',
              logoUrl: userData.profile?.logoUrl,
              maxGroupSize: 10,
              name: userData.profile?.clubName || userData.displayName || 'Club',
              ownerUserId: userId,
              paymentSettings: undefined,
              phone: userData.profile?.phone || '',
              reviewsCount: 0,
              reviews: 0,
              services: servicesString,
              stats: undefined,
              subtitle: servicesString,
              title: userData.profile?.clubName || userData.displayName || 'Club',
              website: userData.profile?.website || '',
              isVerified: false,
              verified: false,
              priceLevel: 2,
              price: '€€',
              distanceKm: 0,
              distance: '0 km',
              rating: 0,
            };
            
            mergedClubs.push(club);
          }
        });
        
        setClubs(mergedClubs);
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
