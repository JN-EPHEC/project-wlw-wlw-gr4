import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Booking } from '@/types/Booking';

interface UseNextBookingForClubResult {
  booking: (Booking & { id: string }) | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch the next upcoming booking for an educator in a specific club
 */
export const useNextBookingForClub = (
  educatorId: string,
  clubId: string
): UseNextBookingForClubResult => {
  const [booking, setBooking] = useState<(Booking & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!educatorId || !clubId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        console.log('🔍 [useNextBookingForClub] Fetching next booking for educatorId:', educatorId, 'clubId:', clubId);

        const now = new Date();
        
        // Query for bookings where educatorId matches and sessionDate is in the future
        const q = query(
          collection(db, 'Bookings'),
          where('educatorId', '==', educatorId),
          where('clubId', '==', clubId),
          where('sessionDate', '>=', Timestamp.fromDate(now)),
          orderBy('sessionDate', 'asc'),
          limit(1)
        );

        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          console.log('ℹ️ [useNextBookingForClub] No upcoming booking found');
          setBooking(null);
        } else {
          const doc = snapshot.docs[0];
          const data = doc.data() as Booking;
          setBooking({
            ...data,
            id: doc.id,
          });
          console.log('✅ [useNextBookingForClub] Found booking:', doc.id);
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ [useNextBookingForClub] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [educatorId, clubId]);

  return { booking, loading, error };
};
