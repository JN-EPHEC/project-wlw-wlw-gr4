import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { CreateBookingInput } from '@/types/Booking';

interface UseCreateBookingResult {
  loading: boolean;
  error: string | null;
  createBooking: (input: CreateBookingInput) => Promise<string>;
}

/**
 * Hook pour créer un nouveau booking
 * Sauvegarde le booking dans Firebase et retourne son ID
 */
export const useCreateBooking = (): UseCreateBookingResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (input: CreateBookingInput): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📝 [useCreateBooking] Creating new booking:', input.title);

      const now = Timestamp.now();
      const sessionDate = input.sessionDate instanceof Timestamp 
        ? input.sessionDate 
        : Timestamp.fromDate(new Date(input.sessionDate));

      const bookingData = {
        // IDs & Références
        clubId: input.clubId,
        educatorId: input.educatorId || '',
        fieldId: input.fieldId || '',

        // Participants
        userIds: input.userIds || [],
        maxParticipants: input.maxParticipants || 1,

        // Infos du cours
        title: input.title,
        description: input.description || '',
        trainingType: input.trainingType,
        isGroupCourse: input.isGroupCourse,

        // Dates
        sessionDate,
        duration: input.duration,

        // Chiens
        dogIds: input.dogIds || [],

        // Paiement
        price: input.price,
        totalPrice: input.price * (input.maxParticipants || 1),
        paymentIds: [],
        currency: 'EUR',
        paid: false,
        paidAt: null,

        // Statuts
        status: input.status || 'available',
        type: input.type || 'club-based',
        createdBy: input.createdBy,
        requestedTeacher: null,
        rejectionReason: null,
        rejectedAt: null,
        confirmedAt: null,
        completedAt: null,

        // Reviews & Feedback
        reviewIds: [],

        // Audit
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, 'Bookings'), bookingData);
      console.log('✅ [useCreateBooking] Booking created with ID:', docRef.id);
      
      return docRef.id;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la création';
      console.error('❌ [useCreateBooking] Error:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createBooking };
};
