import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';

export interface HomeEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  image: string;
  startDate?: Timestamp | any;
}

export function useUpcomingUserEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Récupérer TOUS les événements futurs
      const eventsCollection = collection(db, 'events');
      const snapshot = await getDocs(eventsCollection);

      const now = new Date();
      const upcomingEvents: HomeEvent[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        let eventDate: Date | null = null;

        if (data.startDate) {
          if (data.startDate.toDate) {
            eventDate = data.startDate.toDate();
          } else if (typeof data.startDate === 'number') {
            eventDate = new Date(data.startDate);
          }
        }

        // Filtrer seulement les événements futurs
        if (eventDate && eventDate > now) {
          const dateStr = eventDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
          const timeStr = eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

          // Convert GeoPoint location to string if needed
          let locationStr = 'Lieu non spécifié';
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

          upcomingEvents.push({
            id: doc.id,
            title: data.title || 'Événement',
            date: dateStr,
            time: timeStr,
            location: locationStr,
            participants: data.attendees?.length || data.maxParticipants || 0,
            image: data.image || data.photoUrl || 'https://images.unsplash.com/photo-1557971779-95a20f2d0e4a?auto=format&fit=crop&w=800&q=80',
            startDate: data.startDate,
          });
        }
      });

      // Trier par date et limiter à 2 événements
      upcomingEvents.sort((a, b) => {
        const dateA = a.startDate?.toDate?.() || new Date(a.startDate);
        const dateB = b.startDate?.toDate?.() || new Date(b.startDate);
        return dateA - dateB;
      });

      setEvents(upcomingEvents.slice(0, 2));
    } catch (err) {
      console.error('Erreur loadUserEvents:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    loadUserEvents,
  };
}
