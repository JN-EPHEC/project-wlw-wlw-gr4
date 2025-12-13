import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Booking, BookingDisplay } from '@/types/Booking';

interface UseFetchEducatorBookingsResult {
  bookings: BookingDisplay[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetch bookings assigned to a specific educator with real-time updates
 * Filters where educatorId matches and status is confirmed/pending/completed
 */
export const useFetchEducatorBookings = (educatorId: string): UseFetchEducatorBookingsResult => {
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!educatorId) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useFetchEducatorBookings] Setting up real-time listener for educatorId:', educatorId);

      // Query for all bookings assigned to this educator with real-time updates
      const q = query(
        collection(db, 'Bookings'),
        where('educatorId', '==', educatorId)
      );

      // Utiliser onSnapshot pour les mises à jour en temps réel
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedBookings: BookingDisplay[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as Booking;
            
            // Only include bookings that are confirmed, pending, or completed
            if (['pending', 'confirmed', 'completed'].includes(data.status)) {
              const booking: BookingDisplay = {
                ...data,
                id: doc.id,
                currentParticipants: data.userIds?.length || 0,
                availableSpots: (data.maxParticipants || 1) - (data.userIds?.length || 0),
              };
              
              fetchedBookings.push(booking);
            }
          });

          // Sort by date (upcoming first)
          fetchedBookings.sort((a, b) => {
            const dateA = a.sessionDate instanceof Timestamp ? a.sessionDate.toDate() : new Date(a.sessionDate);
            const dateB = b.sessionDate instanceof Timestamp ? b.sessionDate.toDate() : new Date(b.sessionDate);
            return dateA.getTime() - dateB.getTime();
          });

          console.log('✅ [useFetchEducatorBookings] Real-time update:', fetchedBookings.length, 'bookings');
          setBookings(fetchedBookings);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('❌ [useFetchEducatorBookings] Error:', err);
          setError(err instanceof Error ? err.message : 'Erreur');
          setLoading(false);
        }
      );

      // Cleanup: unsubscribe when component unmounts or educatorId changes
      return () => unsubscribe();
    } catch (err) {
      console.error('❌ [useFetchEducatorBookings] Setup error:', err);
      setError(err instanceof Error ? err.message : 'Erreur');
      setLoading(false);
    }
  }, [educatorId]);

  return { bookings, loading, error };
};
