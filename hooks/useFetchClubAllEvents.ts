import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface ClubEventFull extends Record<string, any> {
  id: string;
  clubId: string;
  title: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  duration?: number;
  price: number;
  description?: string;
  dogSlots?: number;
  spectatorSlots?: number;
  isActive: boolean;
}

interface UseFetchClubAllEventsResult {
  events: ClubEventFull[];
  loading: boolean;
  error: string | null;
}

export const useFetchClubAllEvents = (clubId: string): UseFetchClubAllEventsResult => {
  const [events, setEvents] = useState<ClubEventFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 [useFetchClubAllEvents] Fetching all events for clubId:', clubId);

        // Requête sans le filtre de date (pour éviter besoin d'index composite)
        const q = query(
          collection(db, 'events'),
          where('clubId', '==', clubId)
        );
        const snapshot = await getDocs(q);

        const now = new Date();
        const fetchedEvents: ClubEventFull[] = [];
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
            } as ClubEventFull);
          }
        });

        // Trier par date
        fetchedEvents.sort((a, b) => {
          const dateA = a.startDate instanceof Timestamp ? a.startDate.toDate() : new Date(a.startDate);
          const dateB = b.startDate instanceof Timestamp ? b.startDate.toDate() : new Date(b.startDate);
          return dateA.getTime() - dateB.getTime();
        });

        console.log('✅ [useFetchClubAllEvents] Found', fetchedEvents.length, 'events');
        setEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        console.error('❌ [useFetchClubAllEvents] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [clubId]);

  return { events, loading, error };
};
