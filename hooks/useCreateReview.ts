import { useState, useEffect } from 'react';
import { collection, doc, setDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Review } from './useClubReviews';

export interface CreateReviewInput {
  clubId: string;
  bookingId: string;
  educatorId: string;
  ownerId: string; // ID de l'utilisateur qui laisse l'avis
  ownerName: string; // Nom de l'utilisateur
  ownerAvatar?: string;
  rating: number; // 1-5
  comment: string;
  tags?: string[]; // Tags de points forts
}

interface RatingInvitation {
  id: string;
  bookingId: string;
  clubId: string;
  educatorId: string;
  ownerId: string;
  hasLeftClubReview: boolean;
  hasLeftEducatorReview: boolean;
  createdAt: Timestamp;
}

/**
 * Hook pour créer des avis (club + éducateur)
 */
export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Crée un avis pour le club
   */
  const createClubReview = async (input: CreateReviewInput): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const reviewId = `${input.bookingId}_${input.ownerId}_club`;
      const review: Review = {
        id: reviewId,
        clubId: input.clubId,
        bookingId: input.bookingId,
        educatorId: input.educatorId,
        ownerId: input.ownerId,
        ownerName: input.ownerName,
        ownerAvatar: input.ownerAvatar,
        rating: input.rating,
        comment: input.comment,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'reviews', reviewId), review);
      setLoading(false);
      return reviewId;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  /**
   * Crée un avis pour l'éducateur
   */
  const createEducatorReview = async (input: CreateReviewInput): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const reviewId = `${input.bookingId}_${input.ownerId}_educator`;
      const review = {
        id: reviewId,
        educatorId: input.educatorId,
        bookingId: input.bookingId,
        clubId: input.clubId,
        ownerId: input.ownerId,
        ownerName: input.ownerName,
        ownerAvatar: input.ownerAvatar,
        rating: input.rating,
        comment: input.comment,
        tags: input.tags || [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'educatorReviews', reviewId), review);
      setLoading(false);
      return reviewId;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return {
    createClubReview,
    createEducatorReview,
    loading,
    error,
  };
};

/**
 * Hook pour créer une invitation d'avis (après terminer une séance)
 */
export const useCreateRatingInvitation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createInvitation = async (
    bookingId: string,
    clubId: string,
    educatorId: string,
    ownerIds: string[] // Array des propriétaires de chiens participants
  ): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const invitationIds: string[] = [];

      // Créer une invitation pour chaque propriétaire
      for (const ownerId of ownerIds) {
        const invitationId = `${bookingId}_${ownerId}`;
        const invitation: RatingInvitation = {
          id: invitationId,
          bookingId,
          clubId,
          educatorId,
          ownerId,
          hasLeftClubReview: false,
          hasLeftEducatorReview: false,
          createdAt: Timestamp.now(),
        };

        await setDoc(doc(db, 'ratingInvitations', invitationId), invitation);
        invitationIds.push(invitationId);
      }

      setLoading(false);
      return invitationIds;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { createInvitation, loading, error };
};

/**
 * Hook pour récupérer les invitations d'avis d'un utilisateur
 */
export const useRatingInvitations = (ownerId: string) => {
  const [invitations, setInvitations] = useState<RatingInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvitations = async () => {
    if (!ownerId) return;
    setLoading(true);

    try {
      const q = query(
        collection(db, 'ratingInvitations'),
        where('ownerId', '==', ownerId)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RatingInvitation[];

      setInvitations(data);
      setLoading(false);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchInvitations();
  }, [ownerId]);

  return { invitations, loading, error, refetch: fetchInvitations };
};
