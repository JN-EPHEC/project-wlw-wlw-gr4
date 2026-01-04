import { useState } from 'react';
import { doc, updateDoc, Timestamp, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Booking, BookingStatus, UpdateBookingInput } from '@/types/Booking';
import { notifyClubNewBooking } from '@/utils/notificationHelpers';

interface UseUpdateBookingResult {
  loading: boolean;
  error: string | null;
  confirmBooking: (bookingId: string, educatorId?: string) => Promise<void>;
  rejectBooking: (bookingId: string, rejectionReason: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  updateBooking: (bookingId: string, updates: Partial<UpdateBookingInput>) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
}

/**
 * Hook to update booking status and other fields in Firebase
 * Handles confirmation, rejection, completion, and cancellation workflows
 */
export const useUpdateBooking = (): UseUpdateBookingResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Confirm a pending booking
   * Sets status to 'confirmed' and optionally assigns an educator
   */
  const confirmBooking = async (bookingId: string, educatorId?: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 [useUpdateBooking] Confirming booking:', bookingId);
      
      // Récupérer les données du booking pour les notifications
      const bookingRef = doc(db, 'Bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);
      const booking = bookingSnap.data() as Booking | undefined;
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      const updateData: any = {
        status: 'confirmed',
        confirmedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (educatorId) {
        updateData.educatorId = educatorId;
      }

      await updateDoc(bookingRef, updateData);
      console.log('✅ [useUpdateBooking] Booking confirmed successfully');

      // 🔔 Créer notifications après confirmation
      try {
        // Notification au club
        console.log('🔔 Tentative notification au club:', booking.clubId);
        await notifyClubNewBooking(booking.userId, booking.clubId, booking);
        console.log('✅ Notification club créée avec succès');
      } catch (notifyErr) {
        console.error('❌ Erreur création notification club:', notifyErr);
      }

      // Notification à l'utilisateur
      try {
        console.log('🔔 Tentative notification à l\'utilisateur:', booking.userId);
        await notifyClubNewBooking(booking.clubId, booking.userId, booking);
        console.log('✅ Notification utilisateur créée avec succès');
      } catch (notifyErr) {
        console.error('❌ Erreur création notification utilisateur:', notifyErr);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la confirmation';
      console.error('❌ [useUpdateBooking] Error confirming booking:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reject a pending booking
   * Sets status to 'rejected' and stores rejection reason
   */
  const rejectBooking = async (bookingId: string, rejectionReason: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 [useUpdateBooking] Rejecting booking:', bookingId);
      
      const bookingRef = doc(db, 'Bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'rejected',
        rejectionReason: rejectionReason || null,
        rejectedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('✅ [useUpdateBooking] Booking rejected successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors du refus';
      console.error('❌ [useUpdateBooking] Error rejecting booking:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mark a booking as completed
   * Sets status to 'completed' and records completion timestamp
   */
  const completeBooking = async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 [useUpdateBooking] Completing booking:', bookingId);
      
      const bookingRef = doc(db, 'Bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'completed',
        completedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('✅ [useUpdateBooking] Booking completed successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la finalisation';
      console.error('❌ [useUpdateBooking] Error completing booking:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel a confirmed or pending booking
   * Sets status to 'cancelled'
   */
  const cancelBooking = async (bookingId: string, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 [useUpdateBooking] Cancelling booking:', bookingId);
      
      const bookingRef = doc(db, 'Bookings', bookingId);
      const updateData: any = {
        status: 'cancelled',
        updatedAt: Timestamp.now(),
      };

      if (reason) {
        updateData.rejectionReason = reason;
      }

      await updateDoc(bookingRef, updateData);
      console.log('✅ [useUpdateBooking] Booking cancelled successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de l\'annulation';
      console.error('❌ [useUpdateBooking] Error cancelling booking:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generic update function for partial booking updates
   */
  const updateBooking = async (bookingId: string, updates: Partial<UpdateBookingInput>) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 [useUpdateBooking] Updating booking:', bookingId, updates);
      
      const bookingRef = doc(db, 'Bookings', bookingId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(bookingRef, updateData);
      console.log('✅ [useUpdateBooking] Booking updated successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      console.error('❌ [useUpdateBooking] Error updating booking:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a booking completely from Firebase
   */
  const deleteBooking = async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 [useUpdateBooking] Deleting booking:', bookingId);
      
      const bookingRef = doc(db, 'Bookings', bookingId);
      await deleteDoc(bookingRef);
      console.log('✅ [useUpdateBooking] Booking deleted successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      console.error('❌ [useUpdateBooking] Error deleting booking:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    confirmBooking,
    rejectBooking,
    completeBooking,
    cancelBooking,
    updateBooking,
    deleteBooking,
  };
};
