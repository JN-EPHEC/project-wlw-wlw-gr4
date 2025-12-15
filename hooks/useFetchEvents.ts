import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: any;
  endDate: any;
  clubId: string;
  price: number;
  dogSlots: number;
  spectatorSlots: number;
  isActive: boolean;
  location?: string;
  currency: string;
  fieldId?: string;
  // Champs compatibilité UI
  image?: string;
  subtitle?: string;
  rating?: number;
  reviews?: number;
  distance?: string;
  verified?: boolean;
}

interface UseFetchEventsResult {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export const useFetchEvents = (): UseFetchEventsResult => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsCollection = collection(db, 'events');
        const q = query(eventsCollection);
        const snapshot = await getDocs(q);
        
        const eventsData: Event[] = snapshot.docs.map(doc => {
          const data = doc.data() as any;
          
          // Convert GeoPoint location to string if needed
          let locationStr = data.location;
          if (data.location) {
            if (typeof data.location !== 'string') {
              if (data.location._lat !== undefined && data.location._long !== undefined) {
                // GeoPoint object
                locationStr = `${data.location._lat.toFixed(4)}, ${data.location._long.toFixed(4)}`;
              } else if (data.location.latitude !== undefined && data.location.longitude !== undefined) {
                // Alternative GeoPoint format
                locationStr = `${data.location.latitude.toFixed(4)}, ${data.location.longitude.toFixed(4)}`;
              }
            }
          }
          
          return {
            id: doc.id,
            ...data,
            location: locationStr,
            // Ajouter les champs transformés pour compatibilité UI
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
            subtitle: data.description || 'Événement canin',
            rating: 4.8,
            reviews: 50,
            verified: true,
            distance: '5 km',
          } as Event;
        });
        
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setError('Erreur lors du chargement des événements');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};
