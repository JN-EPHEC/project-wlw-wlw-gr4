import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface ClubEvent {
  id: string;
  clubId: string;
  title: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  duration?: number; // en minutes
  price: number;
  description?: string;
  dogSlots?: number;
  spectatorSlots?: number;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  fieldId?: string;
  [key: string]: any;
}

interface UseFetchClubUpcomingEventsResult {
  events: ClubEvent[];
  loading: boolean;
  error: string | null;
}

export const useFetchClubUpcomingEvents = (clubId: string): UseFetchClubUpcomingEventsResult => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!clubId) {
        console.log('⚠️ [useFetchClubUpcomingEvents] clubId is empty');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useFetchClubUpcomingEvents] Fetching events for clubId:', clubId);

        // Requête sans le filtre de date (pour éviter besoin d'index composite)
        const q = query(
          collection(db, 'events'),
          where('clubId', '==', clubId)
        );
        const snapshot = await getDocs(q);

        const now = new Date();
        const fetchedEvents: ClubEvent[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const docDate = data.startDate instanceof Timestamp ? 
            data.startDate.toDate() : 
            new Date(data.startDate);
          
          // Filtrer les dates dans le code (après la requête)
          if (docDate >= now) {
            fetchedEvents.push({
              id: doc.id,
              ...data,
            } as ClubEvent);
          }
        });

        // Trier par date (déjà fait dans useFetchClubUpcomingBookings, faire pareil ici)
        fetchedEvents.sort((a, b) => {
          const dateA = a.startDate instanceof Timestamp ? a.startDate.toDate() : new Date(a.startDate);
          const dateB = b.startDate instanceof Timestamp ? b.startDate.toDate() : new Date(b.startDate);
          return dateA.getTime() - dateB.getTime();
        });

        console.log('✅ [useFetchClubUpcomingEvents] Found', fetchedEvents.length, 'upcoming events for club', clubId);
        setEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        console.error('❌ [useFetchClubUpcomingEvents] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [clubId]);

  return { events, loading, error };
};
