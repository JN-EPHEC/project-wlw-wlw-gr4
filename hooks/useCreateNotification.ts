import { useState } from 'react';
import { collection, doc, setDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { CreateNotificationDTO, NotificationType, RelatedType, RecipientType } from '@/types/Notification';

interface CreateNotificationInput {
  userId: string; // Qui reçoit
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    bookingId?: string;
    clubId?: string;
    educatorId?: string;
    eventId?: string;
    previousTarget?: string;
    [key: string]: any;
  };
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
}

/**
 * Hook pour créer des notifications
 * Simplifié pour les cas courants
 */
export const useCreateNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createNotification = async (input: CreateNotificationInput): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const {
        userId,
        type,
        title,
        message,
        data = {},
        senderId,
        senderName,
        senderAvatar,
      } = input;

      // Déterminer le type de ressource et l'ID basé sur le type de notification
      let relatedId = data.bookingId || data.clubId || data.eventId || userId;
      let relatedType: RelatedType = 'booking';

      if (type === 'review_requested') {
        relatedType = 'booking';
        relatedId = data.bookingId || userId;
      } else if (type === 'booking_confirmed' || type === 'booking_rejected' || type === 'new_booking') {
        relatedType = 'booking';
        relatedId = data.bookingId || userId;
      } else if (type === 'event_created' || type === 'event_reminder') {
        relatedType = 'event';
        relatedId = data.eventId || userId;
      } else if (type === 'review_received') {
        relatedType = 'review';
        relatedId = data.clubId || userId;
      } else if (type === 'pending_member_request' || type === 'member_approved' || type === 'member_rejected') {
        relatedType = 'member_request';
        relatedId = data.clubId || userId;
      }

      // Construire le DTO complet
      const notificationDTO: CreateNotificationDTO = {
        type,
        title,
        message,
        recipientId: userId,
        recipientType: 'user',
        senderId,
        senderName,
        senderAvatar,
        relatedId,
        relatedType,
        metadata: data,
        actionUrl: getActionUrl(type, data),
        actionParams: getActionParams(type, data),
      };

      // Créer dans Firestore avec structure imbriquée
      const notificationId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const notificationRef = doc(collection(db, 'notifications', userId, 'items'), notificationId);

      await setDoc(notificationRef, {
        id: notificationId,
        ...notificationDTO,
        isRead: false,
        createdAt: Timestamp.now(),
      });

      setLoading(false);
      return notificationId;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setLoading(false);
      throw error;
    }
  };

  return { createNotification, loading, error };
};

/**
 * Détermine l'URL d'action basée sur le type de notification
 */
function getActionUrl(type: NotificationType, data: Record<string, any>): string {
  switch (type) {
    case 'review_requested':
      return 'ratingInvitation';
    case 'booking_confirmed':
    case 'booking_rejected':
      return 'booking';
    case 'event_created':
    case 'event_reminder':
      return 'eventDetail';
    case 'review_received':
      return 'reviews';
    case 'pending_member_request':
      return 'clubMembers';
    default:
      return 'account';
  }
}

/**
 * Détermine les params de navigation basées sur le type
 */
function getActionParams(
  type: NotificationType,
  data: Record<string, any>
): Record<string, any> {
  const params: Record<string, any> = {};

  if (data.bookingId) params.bookingId = data.bookingId;
  if (data.clubId) params.clubId = data.clubId;
  if (data.educatorId) params.educatorId = data.educatorId;
  if (data.eventId) params.eventId = data.eventId;
  if (data.previousTarget) params.previousTarget = data.previousTarget;

  return params;
}
