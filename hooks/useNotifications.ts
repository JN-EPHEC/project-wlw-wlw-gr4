import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Notification } from '@/types/Notification';

/**
 * Hook pour récupérer les notifications d'un utilisateur EN TEMPS RÉEL
 * 
 * Utilisation:
 * const { notifications, loading, error, markAsRead } = useNotifications(userId);
 */
export const useNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'notifications', userId, 'items'),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        try {
          const data: Notification[] = snapshot.docs.map((doc) => {
            const docData = doc.data();
            return {
              id: doc.id,
              ...docData,
              createdAt: docData.createdAt,
              readAt: docData.readAt,
            } as Notification;
          });
          setNotifications(data);
          setError(null);
        } catch (err) {
          console.error('Erreur lors du chargement des notifications:', err);
          setError('Erreur lors du chargement');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Erreur snapshot notifications:', err);
        setError('Erreur de synchronisation');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    if (!userId) return;

    try {
      const notifRef = doc(db, 'notifications', userId, 'items', notificationId);
      await updateDoc(notifRef, {
        isRead: true,
        readAt: Timestamp.now(),
      });
      console.log(`✅ Notification ${notificationId} marquée comme lue`);
    } catch (err) {
      console.error('Erreur lors du marquage comme lue:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const promises = notifications
        .filter((n) => !n.isRead)
        .map((n) => markAsRead(n.id));

      await Promise.all(promises);
      console.log(`✅ Toutes les notifications marquées comme lues`);
    } catch (err) {
      console.error('Erreur lors du marquage de toutes:', err);
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  };
};

/**
 * Hook pour compter les notifications non lues
 * 
 * Utilisation:
 * const unreadCount = useUnreadNotificationCount(userId);
 */
export const useUnreadNotificationCount = (userId: string | null) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'notifications', userId, 'items'),
        where('isRead', '==', false)
      ),
      (snapshot) => {
        setCount(snapshot.size);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return count;
};

/**
 * Hook pour filtrer les notifications par type
 * 
 * Utilisation:
 * const bookingNotifications = useNotificationsByType(notifications, 'booking_confirmed');
 */
export const useNotificationsByType = (
  notifications: Notification[],
  type: string
) => {
  return notifications.filter((n) => n.type === type);
};

/**
 * Hook pour filtrer les notifications non lues
 * 
 * Utilisation:
 * const unreadNotifications = useUnreadNotifications(notifications);
 */
export const useUnreadNotifications = (notifications: Notification[]) => {
  return notifications.filter((n) => !n.isRead);
};

/**
 * Hook pour récupérer les notifications d'un club
 * (Même logique que useNotifications mais pour clubId)
 * 
 * Utilisation:
 * const { notifications, loading } = useClubNotifications(clubId);
 */
export const useClubNotifications = (clubId: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'notifications', clubId, 'items'),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        try {
          const data: Notification[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Notification));
          setNotifications(data);
          setError(null);
        } catch (err) {
          console.error('Erreur club notifications:', err);
          setError('Erreur de chargement');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Erreur snapshot club notifications:', err);
        setError('Erreur de synchronisation');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [clubId]);

  const markAsRead = async (notificationId: string) => {
    if (!clubId) return;

    try {
      const notifRef = doc(db, 'notifications', clubId, 'items', notificationId);
      await updateDoc(notifRef, {
        isRead: true,
        readAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Erreur marquage club:', err);
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
  };
};

/**
 * Hook pour formater l'affichage du temps (ex: "Il y a 2 heures")
 */
export const useFormattedTime = (timestamp: Timestamp): string => {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    if (!timestamp) return;

    const updateTime = () => {
      const now = new Date();
      const notifDate = timestamp.toDate();
      const diffMs = now.getTime() - notifDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) {
        setFormattedTime('À l\'instant');
      } else if (diffMins < 60) {
        setFormattedTime(`Il y a ${diffMins}min`);
      } else if (diffHours < 24) {
        setFormattedTime(`Il y a ${diffHours}h`);
      } else if (diffDays < 7) {
        setFormattedTime(`Il y a ${diffDays}j`);
      } else {
        setFormattedTime(notifDate.toLocaleDateString('fr-FR'));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Mettre à jour chaque minute

    return () => clearInterval(interval);
  }, [timestamp]);

  return formattedTime;
};

/**
 * Hook pour obtenir l'icône et la couleur selon le type de notification
 */
export const useNotificationIcon = (type: string) => {
  const iconMap: Record<string, { icon: string; color: string; bg: string }> = {
    pending_member_request: {
      icon: 'person-add-outline',
      color: '#3B82F6',
      bg: '#DBEAFE',
    },
    member_approved: {
      icon: 'checkmark-circle',
      color: '#16A34A',
      bg: '#ECFDF3',
    },
    member_rejected: {
      icon: 'close-circle',
      color: '#DC2626',
      bg: '#FEE2E2',
    },
    booking_confirmed: {
      icon: 'checkmark-circle',
      color: '#16A34A',
      bg: '#ECFDF3',
    },
    booking_rejected: {
      icon: 'close-circle',
      color: '#DC2626',
      bg: '#FEE2E2',
    },
    new_booking: {
      icon: 'calendar',
      color: '#F59E0B',
      bg: '#FFFBEB',
    },
    message_received: {
      icon: 'chatbubble-ellipses',
      color: '#8B5CF6',
      bg: '#F3E8FF',
    },
    event_created: {
      icon: 'star',
      color: '#7C3AED',
      bg: '#F3E8FF',
    },
    event_reminder: {
      icon: 'alarm',
      color: '#F59E0B',
      bg: '#FFFBEB',
    },
    review_requested: {
      icon: 'star-outline',
      color: '#E9B782',
      bg: '#FEF3C7',
    },
    review_received: {
      icon: 'star',
      color: '#E9B782',
      bg: '#FEF3C7',
    },
  };

  return iconMap[type] || {
    icon: 'notifications-outline',
    color: '#6B7280',
    bg: '#F3F4F6',
  };
};
