import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface ClubStats {
  totalMembers: number;
  totalSessions: number;
  averageRating: number;
  satisfactionRate: number;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
}

export interface ClubProfileData {
  name: string;
  legalName?: string;
  siret?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logoUrl?: string;
  services: string[];
  stats: ClubStats;
  verificationStatus?: boolean;
  createdAt?: any;
  averageRating?: number;
  reviewsCount?: number;
  members?: any[];
  paymentSettings?: any;
  openingHours?: OpeningHours[];
  loading: boolean;
  error: string | null;
}

export const useClubProfileData = (clubId: string | null) => {
  const [data, setData] = useState<ClubProfileData>({
    name: '',
    legalName: '',
    siret: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logoUrl: '',
    services: [],
    stats: {
      totalMembers: 0,
      totalSessions: 0,
      averageRating: 0,
      satisfactionRate: 0,
    },
    verificationStatus: false,
    members: [],
    paymentSettings: {},
    openingHours: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!clubId) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchClubData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // 1. Récupérer les données du club depuis la collection 'club'
        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);

        if (!clubSnap.exists()) {
          throw new Error('Club non trouvé');
        }

        const clubData = clubSnap.data();

        // 2. Calculer les statistiques
        let totalMembers = 0;
        let totalSessions = 0;
        let satisfactionRate = 0;
        let membersList = [];

        // Récupérer les membres depuis le champ members du club
        if (clubData.members && Array.isArray(clubData.members)) {
          totalMembers = clubData.members.length;
          membersList = clubData.members;
        } else if (clubData.stats?.totalMembers) {
          totalMembers = clubData.stats.totalMembers;
        }

        // Récupérer les réservations/sessions pour calculer les séances
        if (clubData.stats?.totalBookings) {
          totalSessions = clubData.stats.totalBookings;
        } else {
          // Optionnel: faire une requête pour compter les réservations
          try {
            const bookingsCollection = collection(db, 'bookings');
            const bookingsQuery = query(bookingsCollection, where('clubId', '==', clubId));
            const bookingsSnap = await getDocs(bookingsQuery);
            totalSessions = bookingsSnap.size;
          } catch (err) {
            console.warn('Erreur lors du fetch des réservations:', err);
          }
        }

        // Récupérer la satisfaction (si disponible)
        if (clubData.stats?.satisfactionRate) {
          satisfactionRate = clubData.stats.satisfactionRate;
        } else {
          // Calculer la satisfaction basée sur les avis
          try {
            const ratingsCollection = collection(db, 'ratings');
            const ratingsQuery = query(ratingsCollection, where('clubId', '==', clubId));
            const ratingsSnap = await getDocs(ratingsQuery);
            
            if (ratingsSnap.size > 0) {
              const ratings = ratingsSnap.docs.map(d => d.data());
              const avgSatisfaction = ratings.reduce((sum, r) => sum + (r.overallRating || 0), 0) / ratingsSnap.size;
              satisfactionRate = Math.round((avgSatisfaction / 5) * 100);
            }
          } catch (err) {
            console.warn('Erreur lors du calcul de la satisfaction:', err);
          }
        }

        // Construire les données finales
        const servicesArray = Array.isArray(clubData.services)
          ? clubData.services
          : typeof clubData.services === 'string'
          ? [clubData.services]
          : [];

        // Récupérer les horaires depuis la BDD
        let openingHours = clubData.openingHours || [];

        setData({
          name: clubData.name || '',
          legalName: clubData.legalName || '',
          siret: clubData.siret || '',
          description: clubData.description || '',
          email: clubData.email || '',
          phone: clubData.phone || '',
          address: clubData.address || '',
          website: clubData.website || '',
          logoUrl: clubData.logoUrl || clubData.PhotoUrl || '',
          services: servicesArray,
          stats: {
            totalMembers,
            totalSessions,
            averageRating: clubData.averageRating || 0,
            satisfactionRate,
          },
          verificationStatus: clubData.isVerified || false,
          createdAt: clubData.createdAt,
          averageRating: clubData.averageRating,
          reviewsCount: clubData.reviewsCount || 0,
          members: membersList,
          paymentSettings: clubData.paymentSettings || {},
          openingHours: openingHours,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Erreur lors du fetch des données du club:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Une erreur est survenue',
        }));
      }
    };

    fetchClubData();
  }, [clubId]);

  return data;
};
