import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, onSnapshot } from 'firebase/firestore';
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

    setLoading(true);

    // Listener real-time sur les invitations de l'utilisateur
    const invitationRef = collection(db, 'ratingInvitations');
    const invitationQuery = query(
      invitationRef,
      where('ownerId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      invitationQuery,
      async (snapshot) => {
        try {
          const invitationsList: RatingInvitationData[] = [];

          // Pour chaque invitation, charger les détails du booking
          for (const invitationDoc of snapshot.docs) {
            const invitationData = invitationDoc.data();
            
            // Charger les détails du booking
            try {
              const bookingsQuery = query(
                collection(db, 'Bookings'),
                where('id', '==', invitationData.bookingId)
              );
              
              const bookingDocs = await getDocs(bookingsQuery);
              
              if (!bookingDocs.empty) {
                const bookingDoc = bookingDocs.docs[0];
                const bookingData = bookingDoc.data();
                
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
              console.warn('Error loading booking for invitation:', err);
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
          console.error('Error processing invitations:', err);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error listening to invitations:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts or userId changes
    return () => unsubscribe();
  }, [userId]);

  return { invitations, loading, error };
};
