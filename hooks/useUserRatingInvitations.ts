import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface RatingInvitationData {
  id: string;
  title: string;
  clubId: string;
  clubName?: string;
  educatorId: string;
  educatorName?: string;
  sessionDate: any;
  duration: number;
  status: 'pending' | 'completed';
}

/**
 * Hook pour charger les invitations d'avis de l'utilisateur actuel
 */
export const useUserRatingInvitations = (userId: string | null) => {
  const [invitations, setInvitations] = useState<RatingInvitationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    const loadInvitations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Chercher tous les bookings où l'utilisateur est dans userIds
        const bookingsQuery = query(
          collection(db, 'Bookings'),
          where('userIds', 'array-contains', userId),
          where('status', '==', 'completed')
        );

        const bookingsDocs = await getDocs(bookingsQuery);
        const invitationsList: RatingInvitationData[] = [];

        // Pour chaque booking, vérifier si l'utilisateur a déjà voté
        for (const bookingDoc of bookingsDocs.docs) {
          const bookingData = bookingDoc.data();
          
          // Chercher dans ratingInvitations pour voir si l'utilisateur a déjà voté
          const invitationId = `${bookingDoc.id}_${userId}`;
          
          // Charger l'invitation pour vérifier son statut
          try {
            const invitationRef = collection(db, 'ratingInvitations');
            const invitationQuery = query(
              invitationRef,
              where('bookingId', '==', bookingDoc.id),
              where('ownerId', '==', userId)
            );
            
            const invitationDocs = await getDocs(invitationQuery);
            
            if (!invitationDocs.empty) {
              const invitationDoc = invitationDocs.docs[0];
              const invitationData = invitationDoc.data();
              
              // Ajouter uniquement si pas encore voté
              if (!invitationData.hasLeftClubReview || !invitationData.hasLeftEducatorReview) {
                invitationsList.push({
                  id: bookingDoc.id,
                  title: String(bookingData.title || 'Séance'),
                  clubId: String(bookingData.clubId || ''),
                  clubName: bookingData.clubName,
                  educatorId: String(bookingData.educatorId || ''),
                  educatorName: bookingData.educatorName,
                  sessionDate: bookingData.sessionDate,
                  duration: Number(bookingData.duration) || 60,
                  status: 'pending',
                });
              }
            }
          } catch (err) {
            console.warn('Error checking invitation:', err);
          }
        }

        // Trier par date décroissante
        invitationsList.sort((a, b) => {
          const dateA = a.sessionDate instanceof Timestamp ? a.sessionDate.toDate() : new Date(a.sessionDate);
          const dateB = b.sessionDate instanceof Timestamp ? b.sessionDate.toDate() : new Date(b.sessionDate);
          return dateB.getTime() - dateA.getTime();
        });

        setInvitations(invitationsList);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        setError(error);
        console.error('Error loading rating invitations:', error);
        setLoading(false);
      }
    };

    loadInvitations();
  }, [userId]);

  return { invitations, loading, error };
};
