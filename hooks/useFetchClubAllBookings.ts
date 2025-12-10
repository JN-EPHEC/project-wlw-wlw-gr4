import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface ClubBookingFull extends Record<string, any> {
  id: string;
  clubId: string;
  sessionDate: Timestamp;
  startTime?: string;
  endTime?: string;
  duration?: number;
  educatorId: string;
  price: number;
  status: string;
  isActive: boolean;
}

interface UseFetchClubAllBookingsResult {
  bookings: ClubBookingFull[];
  loading: boolean;
  error: string | null;
}

export const useFetchClubAllBookings = (clubId: string): UseFetchClubAllBookingsResult => {
  const [bookings, setBookings] = useState<ClubBookingFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useFetchClubAllBookings] Fetching all bookings for clubId:', clubId);

        // Requête sans le filtre de date (pour éviter besoin d'index composite)
        const q = query(
          collection(db, 'Bookings'),
          where('clubId', '==', clubId)
        );
        const snapshot = await getDocs(q);

        const now = new Date();
        const fetchedBookings: ClubBookingFull[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const docDate = data.sessionDate instanceof Timestamp ? 
            data.sessionDate.toDate() : 
            new Date(data.sessionDate);
          
          // Filtrer les dates dans le code (après la requête)
          if (docDate >= now) {
            fetchedBookings.push({
              id: doc.id,
              ...data,
            } as ClubBookingFull);
          }
        });

        // Trier par date
        fetchedBookings.sort((a, b) => {
          const dateA = a.sessionDate instanceof Timestamp ? a.sessionDate.toDate() : new Date(a.sessionDate);
          const dateB = b.sessionDate instanceof Timestamp ? b.sessionDate.toDate() : new Date(b.sessionDate);
          return dateA.getTime() - dateB.getTime();
        });

        console.log('✅ [useFetchClubAllBookings] Found', fetchedBookings.length, 'bookings');
        setBookings(fetchedBookings);
        setError(null);
      } catch (err) {
        console.error('❌ [useFetchClubAllBookings] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [clubId]);

  return { bookings, loading, error };
};
