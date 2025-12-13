import { useState } from 'react';
import { useUpdateBooking } from './useUpdateBooking';

interface UseHomeBasedRequestsResult {
  acceptRequest: (bookingId: string) => Promise<void>;
  refuseRequest: (bookingId: string) => Promise<void>;
  loading: boolean;
}

/**
 * Hook pour gérer l'acceptation et refus des demandes de cours à domicile
 * Utilisé côté client pour accepter/refuser les modifications du club
 */
export const useHomeBasedRequests = (): UseHomeBasedRequestsResult => {
  const { updateBooking, loading } = useUpdateBooking();
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  const acceptRequest = async (bookingId: string) => {
    try {
      setCurrentRequestId(bookingId);
      await updateBooking(bookingId, { status: 'confirmed' });
    } finally {
      setCurrentRequestId(null);
    }
  };

  const refuseRequest = async (bookingId: string) => {
    try {
      setCurrentRequestId(bookingId);
      await updateBooking(bookingId, { status: 'refused' });
    } finally {
      setCurrentRequestId(null);
    }
  };

  return {
    acceptRequest,
    refuseRequest,
    loading,
  };
};
