import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Booking, BookingDisplay, BookingStats } from '@/types/Booking';

interface UseFetchClubAllBookingsResult {
  bookings: BookingDisplay[];
  loading: boolean;
  error: string | null;
  stats: BookingStats;
}

export const useFetchClubAllBookings = (clubId: string): UseFetchClubAllBookingsResult => {
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useFetchClubAllBookings] Setting up real-time listener for clubId:', clubId);

      // Requête pour tous les bookings du club avec real-time updates
      const q = query(
        collection(db, 'Bookings'),
        where('clubId', '==', clubId)
      );

      // Utiliser onSnapshot pour les mises à jour en temps réel
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedBookings: BookingDisplay[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as Booking;
            
            // Enrichissement avec données calculées
            const booking: BookingDisplay = {
              ...data,
              id: doc.id,
              currentParticipants: data.userIds?.length || 0,
              availableSpots: (data.maxParticipants || 1) - (data.userIds?.length || 0),
            };
            
            fetchedBookings.push(booking);
          });

          // Trier par date
          fetchedBookings.sort((a, b) => {
            const dateA = a.sessionDate instanceof Timestamp ? a.sessionDate.toDate() : new Date(a.sessionDate);
            const dateB = b.sessionDate instanceof Timestamp ? b.sessionDate.toDate() : new Date(b.sessionDate);
            return dateA.getTime() - dateB.getTime();
          });

          console.log('✅ [useFetchClubAllBookings] Real-time update:', fetchedBookings.length, 'bookings');
          setBookings(fetchedBookings);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('❌ [useFetchClubAllBookings] Error:', err);
          setError(err instanceof Error ? err.message : 'Erreur');
          setLoading(false);
        }
      );

      // Cleanup: unsubscribe when component unmounts or clubId changes
      return () => unsubscribe();
    } catch (err) {
      console.error('❌ [useFetchClubAllBookings] Setup error:', err);
      setError(err instanceof Error ? err.message : 'Erreur');
      setLoading(false);
    }
  }, [clubId]);

  // Calculer les statistiques
  const stats: BookingStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  return { bookings, loading, error, stats };
};
