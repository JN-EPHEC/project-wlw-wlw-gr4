import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

export interface UserBooking {
  id: string;
  title: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  club: string;
  trainer: string;
  dog: string;
  date: string;
  time: string;
  bookingDate?: Timestamp | any;
}

export function useUserUpcomingBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBookings, setHasBookings] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserBookings();
    } else {
      setBookings([]);
      setHasBookings(false);
      setLoading(false);
    }
  }, [user]);

  const loadUserBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Récupérer les bookings de l'utilisateur
      const bookingsCollection = collection(db, 'Bookings');
      const q = query(bookingsCollection, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);

      const now = new Date();
      const upcomingBookings: UserBooking[] = [];

      // Récupérer les infos détaillées pour chaque booking
      for (const bookingDoc of snapshot.docs) {
        const data = bookingDoc.data();
        let bookingDate: Date | null = null;

        if (data.bookingDate) {
          if (data.bookingDate.toDate) {
            bookingDate = data.bookingDate.toDate();
          } else if (typeof data.bookingDate === 'number') {
            bookingDate = new Date(data.bookingDate);
          }
        }

        // Filtrer seulement les bookings futurs et non annulés
        if (bookingDate && bookingDate > now && data.status !== 'cancelled') {
          // Récupérer les infos du club
          let clubName = 'Club inconnu';
          if (data.clubId) {
            try {
              const clubDoc = await getDoc(doc(db, 'club', data.clubId));
              if (clubDoc.exists()) {
                clubName = clubDoc.data().name || 'Club inconnu';
              }
            } catch (err) {
              console.error('Erreur récupération club:', err);
            }
          }

          // Récupérer les infos du chien
          let dogName = 'Chien inconnu';
          if (data.dogId) {
            try {
              const dogDoc = await getDoc(doc(db, 'Chien', data.dogId));
              if (dogDoc.exists()) {
                dogName = dogDoc.data().name || 'Chien inconnu';
              }
            } catch (err) {
              console.error('Erreur récupération chien:', err);
            }
          }

          const dateStr = bookingDate.toLocaleDateString('fr-FR', { 
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          });
          const timeStr = bookingDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

          upcomingBookings.push({
            id: bookingDoc.id,
            title: data.title || data.courseTitle || 'Séance',
            status: data.status || 'confirmed',
            club: clubName,
            trainer: data.trainerName || data.trainer || 'Entraîneur',
            dog: dogName,
            date: dateStr,
            time: timeStr,
            bookingDate: data.bookingDate,
          });
        }
      }

      // Trier par date
      upcomingBookings.sort((a, b) => {
        const dateA = a.bookingDate?.toDate?.() || new Date(a.bookingDate);
        const dateB = b.bookingDate?.toDate?.() || new Date(b.bookingDate);
        return dateA - dateB;
      });

      setBookings(upcomingBookings);
      setHasBookings(upcomingBookings.length > 0);
    } catch (err) {
      console.error('Erreur loadUserBookings:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des réservations');
      setHasBookings(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    hasBookings,
    loadUserBookings,
  };
}
