import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Booking } from '@/types/Booking';

export interface BookingWithParticipants extends Booking {
  // Données enrichies
  participantsList?: Array<{
    userId: string;
    name?: string;
    email?: string;
    phone?: string;
    paid?: boolean; // Basé sur payment status
  }>;
  educatorName?: string;
  clubName?: string;
  totalParticipants?: number;
}

interface UseFetchClubBookingsWithPaymentsResult {
  bookings: BookingWithParticipants[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les bookings d'un club avec infos de paiement
 * Utile pour afficher à la fois les bookings et les paiements
 * 
 * @param clubId - ID du club
 * @returns Bookings du club enrichis
 */
export const useFetchClubBookingsWithPayments = (
  clubId: string | null
): UseFetchClubBookingsWithPaymentsResult => {
  const [bookings, setBookings] = useState<BookingWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!clubId) {
      console.log('useFetchClubBookingsWithPayments: clubId is null, skipping fetch');
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useFetchClubBookingsWithPayments] Fetching bookings for clubId:', clubId);
      setLoading(true);
      setError(null);

      // 1. Récupérer les bookings du club
      const bookingsCollection = collection(db, 'bookings');
      const q = query(bookingsCollection, where('clubId', '==', clubId));
      const bookingsSnapshot = await getDocs(q);

      console.log(`✅ [useFetchClubBookingsWithPayments] Found ${bookingsSnapshot.size} bookings`);

      // 2. Pour chaque booking, enrichir avec les données utilisateur
      const enrichedBookings: BookingWithParticipants[] = await Promise.all(
        bookingsSnapshot.docs.map(async (bookingDoc) => {
          const booking = bookingDoc.data() as Booking;
          const enriched: BookingWithParticipants = {
            ...booking,
            id: bookingDoc.id,
            totalParticipants: booking.userIds?.length || 0,
          };

          // 3. Enrichir avec les infos des participants
          if (booking.userIds && booking.userIds.length > 0) {
            enriched.participantsList = await Promise.all(
              booking.userIds.map(async (userId) => {
                try {
                  const userDoc = await getDoc(doc(db, 'users', userId));
                  const userData = userDoc.data();

                  return {
                    userId,
                    name: userData?.firstName + ' ' + userData?.lastName || 'Unknown',
                    email: userData?.email || '',
                    phone: userData?.phone || '',
                    paid: booking.paid || false, // TODO: Check per payment
                  };
                } catch (err) {
                  console.warn(`⚠️ Could not fetch user ${userId}:`, err);
                  return { userId, paid: booking.paid || false };
                }
              })
            );
          }

          // 4. Enrichir avec infos éducateur
          if (booking.educatorId) {
            try {
              const educatorDoc = await getDoc(doc(db, 'educators', booking.educatorId));
              const educatorData = educatorDoc.data();
              enriched.educatorName = educatorData?.firstName + ' ' + educatorData?.lastName;
            } catch (err) {
              console.warn(`⚠️ Could not fetch educator ${booking.educatorId}:`, err);
            }
          }

          // 5. Enrichir avec infos club
          if (booking.clubId) {
            try {
              const clubDoc = await getDoc(doc(db, 'club', booking.clubId));
              const clubData = clubDoc.data();
              enriched.clubName = clubData?.name;
            } catch (err) {
              console.warn(`⚠️ Could not fetch club ${booking.clubId}:`, err);
            }
          }

          return enriched;
        })
      );

      setBookings(enrichedBookings);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [useFetchClubBookingsWithPayments] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [clubId]);

  return { bookings, loading, error, refetch: fetchBookings };
};
