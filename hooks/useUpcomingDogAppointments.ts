import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface DogAppointment {
  id: string;
  type: string; // 'Cours', 'Événement', etc.
  title: string; // Nom du cours
  date: string; // "15 Nov 2025"
  time: string; // "14h30"
  location: string; // Nom du club ou lieu
  icon: string; // Emoji: '🏃', '🎯', etc.
  clubId: string;
  startDate: Date;
}

/**
 * Hook pour récupérer les prochains rendez-vous d'un chien
 * (Basés sur les bookings confirmés avec ce chien)
 */
export const useUpcomingDogAppointments = (dogId: string | null) => {
  const [appointments, setAppointments] = useState<DogAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dogId) {
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();

        // Récupérer tous les bookings confirmés où ce chien est inscrit
        // Note: On cherche dans le champ 'dogIds' (array)
        const bookingsRef = collection(db, 'Bookings');
        const q = query(
          bookingsRef,
          where('status', '==', 'confirmed')
        );

        const snapshot = await getDocs(q);
        const appointmentsList: DogAppointment[] = [];

        // Filtrer les bookings qui contiennent ce dogId
        for (const doc of snapshot.docs) {
          const booking = doc.data();
          
          // Vérifier si le chien est dans ce booking
          const dogIds = booking.dogIds || [];
          if (!dogIds.includes(dogId)) {
            continue;
          }

          // Vérifier que la date est dans le futur
          let startDate: Date;
          if (booking.sessionDate instanceof Timestamp) {
            startDate = booking.sessionDate.toDate();
          } else {
            startDate = new Date(booking.sessionDate);
          }

          if (startDate < now) {
            continue; // Ignorer les cours passés
          }

          // Formater la date et heure
          const dayOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
          const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

          const dateStr = new Intl.DateTimeFormat('fr-FR', dayOptions).format(startDate);
          const timeStr = new Intl.DateTimeFormat('fr-FR', timeOptions).format(startDate);

          // Déterminer le type de cours et l'emoji correspondant
          const trainingType = (booking.trainingType || 'cours').toLowerCase();
          let icon = '🎯'; // Default

          if (trainingType.includes('agility') || trainingType.includes('agilité')) {
            icon = '🏃';
          } else if (trainingType.includes('obéissance') || trainingType.includes('obedience')) {
            icon = '📋';
          } else if (trainingType.includes('chiot') || trainingType.includes('puppy')) {
            icon = '🐕';
          } else if (trainingType.includes('sport') || trainingType.includes('compétition')) {
            icon = '🏆';
          }

          appointmentsList.push({
            id: doc.id,
            type: 'Cours',
            title: booking.title || 'Cours d\'entraînement',
            date: dateStr,
            time: timeStr,
            location: booking.clubName || booking.fieldName || 'Club d\'entraînement',
            icon,
            clubId: booking.clubId,
            startDate,
          });
        }

        // Trier par date
        appointmentsList.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        setAppointments(appointmentsList);
      } catch (err) {
        console.error('Erreur fetchAppointments:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des rendez-vous');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [dogId]);

  return { appointments, loading, error };
};
