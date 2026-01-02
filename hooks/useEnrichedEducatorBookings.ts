import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Booking, BookingDisplay } from '@/types/Booking';

interface UseEnrichedEducatorBookingsResult {
  bookings: BookingDisplay[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetch bookings assigned to a specific educator with enriched field data (fieldName, fieldAddress)
 * Filters where educatorId matches and status is confirmed/pending/completed
 */
export const useEnrichedEducatorBookings = (educatorId: string): UseEnrichedEducatorBookingsResult => {
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!educatorId) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useEnrichedEducatorBookings] Setting up real-time listener for educatorId:', educatorId);

      // Query for all bookings assigned to this educator with real-time updates
      const q = query(
        collection(db, 'Bookings'),
        where('educatorId', '==', educatorId)
      );

      // Utiliser onSnapshot pour les mises à jour en temps réel
      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const fetchedBookings: BookingDisplay[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data() as Booking;
            
            // Only include bookings that are confirmed, pending, or completed
            if (['pending', 'confirmed', 'completed'].includes(data.status)) {
              let fieldName = 'N/A';
              let fieldAddress = '';

              // Fetch field data if fieldId exists
              if (data.fieldId) {
                try {
                  const fieldDoc = await getDoc(doc(db, 'fields', data.fieldId));
                  if (fieldDoc.exists()) {
                    fieldName = fieldDoc.data().name || 'N/A';
                    fieldAddress = fieldDoc.data().address || '';
                  }
                } catch (err) {
                  console.warn('⚠️ [useEnrichedEducatorBookings] Could not fetch field:', data.fieldId, err);
                }
              }

              const booking: BookingDisplay = {
                ...data,
                id: docSnapshot.id,
                fieldName,
                fieldAddress,
                currentParticipants: data.userIds?.length || 0,
                availableSpots: (data.maxParticipants || 1) - (data.userIds?.length || 0),
              };
              
              fetchedBookings.push(booking);
            }
          }

          // Sort by date (upcoming first)
          fetchedBookings.sort((a, b) => {
            const dateA = a.sessionDate instanceof Timestamp ? a.sessionDate.toDate() : new Date(a.sessionDate);
            const dateB = b.sessionDate instanceof Timestamp ? b.sessionDate.toDate() : new Date(b.sessionDate);
            return dateA.getTime() - dateB.getTime();
          });

          console.log('✅ [useEnrichedEducatorBookings] Real-time update:', fetchedBookings.length, 'bookings');
          setBookings(fetchedBookings);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('❌ [useEnrichedEducatorBookings] Error:', err);
          setError(err instanceof Error ? err.message : 'Erreur');
          setLoading(false);
        }
      );

      // Cleanup: unsubscribe when component unmounts or educatorId changes
      return () => unsubscribe();
    } catch (err) {
      console.error('❌ [useEnrichedEducatorBookings] Setup error:', err);
      setError(err instanceof Error ? err.message : 'Erreur');
      setLoading(false);
    }
  }, [educatorId]);

  return { bookings, loading, error };
};
