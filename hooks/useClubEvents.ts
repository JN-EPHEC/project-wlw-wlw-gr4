import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp | any;
  endDate: Timestamp | any;
  clubId: string;
  price: number;
  dogSlots: number;
  spectatorSlots: number;
  isActive: boolean;
  location?: string;
  currency: string;
  fieldId?: string;
  participants?: Array<{ userId: string; numDogs: number }>;
  type?: string;
}

interface UseClubEventsResult {
  events: ClubEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useClubEvents = (clubId: string): UseClubEventsResult => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!clubId) {
      console.log('⚠️ [useClubEvents] clubId is empty');
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 [useClubEvents] Fetching events for clubId:', clubId);

      const eventsCollection = collection(db, 'events');
      const q = query(eventsCollection, where('clubId', '==', clubId));
      const snapshot = await getDocs(q);

      console.log('✅ [useClubEvents] Found', snapshot.docs.length, 'events');
      console.log('📋 [useClubEvents] Events data:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const eventsData: ClubEvent[] = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        
        // Convert GeoPoint location to string if needed
        let locationStr = '';
        if (data.location) {
          if (typeof data.location === 'string') {
            locationStr = data.location;
          } else if (data.location._lat !== undefined && data.location._long !== undefined) {
            // GeoPoint object
            locationStr = `${data.location._lat.toFixed(4)}, ${data.location._long.toFixed(4)}`;
          } else if (data.location.latitude !== undefined && data.location.longitude !== undefined) {
            // Alternative GeoPoint format
            locationStr = `${data.location.latitude.toFixed(4)}, ${data.location.longitude.toFixed(4)}`;
          }
        }
        
        return {
          id: doc.id,
          title: data.title || 'Événement',
          description: data.description || '',
          startDate: data.startDate,
          endDate: data.endDate,
          clubId: data.clubId,
          price: data.price || 0,
          dogSlots: data.dogSlots || 0,
          spectatorSlots: data.spectatorSlots || 0,
          isActive: data.isActive !== false,
          location: locationStr,
          currency: data.currency || 'EUR',
          fieldId: data.fieldId,
          participants: data.participants || [],
          type: data.type,
        } as ClubEvent;
      });

      // Trier par date (événements à venir en premier)
      eventsData.sort((a, b) => {
        const dateA = a.startDate?.toDate?.() || new Date(a.startDate);
        const dateB = b.startDate?.toDate?.() || new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
      });

      setEvents(eventsData);
    } catch (err) {
      console.error('Erreur lors du chargement des événements du club:', err);
      setError('Erreur lors du chargement des événements');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [clubId]);

  return { events, loading, error, refetch: fetchEvents };
};
