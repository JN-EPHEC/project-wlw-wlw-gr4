import { Timestamp } from 'firebase/firestore';

/**
 * Types de notifications disponibles dans l'application
 */
export type NotificationType = 
  | 'pending_member_request'       // Demande d'adhésion au club
  | 'member_approved'              // Adhésion approuvée
  | 'member_rejected'              // Adhésion rejetée
  | 'booking_confirmed'            // Réservation confirmée
  | 'booking_rejected'             // Réservation refusée
  | 'new_booking'                  // Nouvelle réservation (pour le club)
  | 'message_received'             // Nouveau message
  | 'event_created'                // Nouvel événement créé
  | 'event_reminder'               // Rappel avant un événement
  | 'review_requested'             // Demande d'avis
  | 'review_received';             // Avis reçu

/**
 * Type de destinataire de la notification
 */
export type RecipientType = 'user' | 'club' | 'educator';

/**
 * Type de ressource reliée à la notification
 */
export type RelatedType = 
  | 'booking' 
  | 'event' 
  | 'club' 
  | 'message' 
  | 'member_request'
  | 'review';

/**
 * Interface principale pour une notification
 */
export interface Notification {
  // Identifiants
  id: string;
  
  // Type et contenu
  type: NotificationType;
  title: string;                        // Ex: "Nouvelle demande d'adhésion"
  message: string;                      // Corps du message
  
  // Destinataire (QUI doit recevoir)
  recipientId: string;                  // userId, clubId, educatorId
  recipientType: RecipientType;         // user | club | educator
  
  // Source (QUI a déclenché)
  senderId?: string;                    // Optionnel: qui a déclenché l'action
  senderName?: string;                  // Ex: "Victor Lemoine"
  senderAvatar?: string;                // Avatar URL (optionnel)
  
  // Ressource reliée (QUOI est concerné)
  relatedId: string;                    // bookingId, eventId, clubId, etc.
  relatedType: RelatedType;             // Type de ressource
  
  // Métadonnées (flexible selon le type)
  metadata?: {
    clubName?: string;
    eventTitle?: string;
    eventDate?: string;
    memberName?: string;
    messagePreview?: string;
    bookingDate?: string;
    [key: string]: any;
  };
  
  // État de lecture
  isRead: boolean;
  createdAt: Timestamp;
  readAt?: Timestamp;
  
  // Navigation (où rediriger au clic)
  actionUrl: string;                    // Ex: "event-detail", "club-detail"
  actionParams?: Record<string, any>;   // Params pour la navigation
}

/**
 * DTO pour créer une notification
 * (Utilisé côté client et Cloud Functions)
 */
export interface CreateNotificationDTO {
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string;
  recipientType: RecipientType;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  relatedId: string;
  relatedType: RelatedType;
  metadata?: Record<string, any>;
  actionUrl: string;
  actionParams?: Record<string, any>;
}

/**
 * Payload pour Firebase Realtime Push Notification
 */
export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: {
    type: NotificationType;
    relatedId: string;
    actionUrl: string;
    [key: string]: string;
  };
}

/**
 * Patterns de création de notifications par type
 * (Template pour créer les bonnes notifications)
 * Omit relatedId et recipientId car ils sont fournis à la création
 */
export const notificationTemplates: Record<NotificationType, Omit<CreateNotificationDTO, 'recipientId' | 'relatedId'> & { recipientType: RecipientType }> = {
  pending_member_request: {
    type: 'pending_member_request',
    title: 'Nouvelle demande d\'adhésion',
    message: '{senderName} demande à rejoindre votre club',
    recipientType: 'club',
    relatedType: 'member_request',
    actionUrl: 'club-community-management',
  },
  
  member_approved: {
    type: 'member_approved',
    title: 'Bienvenue! 🎉',
    message: 'Votre demande pour rejoindre {clubName} a été approuvée',
    recipientType: 'user',
    relatedType: 'club',
    actionUrl: 'club-detail',
  },
  
  member_rejected: {
    type: 'member_rejected',
    title: 'Demande refusée',
    message: 'Votre demande pour rejoindre {clubName} a été refusée',
    recipientType: 'user',
    relatedType: 'club',
    actionUrl: 'club-detail',
  },
  
  booking_confirmed: {
    type: 'booking_confirmed',
    title: 'Réservation confirmée! ✅',
    message: 'Votre place pour {eventTitle} le {eventDate} est confirmée',
    recipientType: 'user',
    relatedType: 'booking',
    actionUrl: 'event-detail',
  },
  
  booking_rejected: {
    type: 'booking_rejected',
    title: 'Réservation refusée',
    message: 'Votre réservation pour {eventTitle} a été refusée',
    recipientType: 'user',
    relatedType: 'booking',
    actionUrl: 'event-detail',
  },
  
  new_booking: {
    type: 'new_booking',
    title: 'Nouvelle réservation',
    message: '{senderName} s\'est inscrit(e) à {eventTitle}',
    recipientType: 'club',
    relatedType: 'booking',
    actionUrl: 'event-detail',
  },
  
  message_received: {
    type: 'message_received',
    title: 'Nouveau message de {senderName}',
    message: '{messagePreview}',
    recipientType: 'user',
    relatedType: 'message',
    actionUrl: 'chat-room',
  },
  
  event_created: {
    type: 'event_created',
    title: 'Nouvel événement! 🎪',
    message: '{eventTitle} - {eventDate}',
    recipientType: 'user',
    relatedType: 'event',
    actionUrl: 'event-detail',
  },
  
  event_reminder: {
    type: 'event_reminder',
    title: 'Rappel: {eventTitle}',
    message: 'Votre événement commence {eventDate}',
    recipientType: 'user',
    relatedType: 'event',
    actionUrl: 'event-detail',
  },
  
  review_requested: {
    type: 'review_requested',
    title: 'Donnez votre avis!',
    message: 'Comment s\'est passée votre séance avec {clubName}?',
    recipientType: 'user',
    relatedType: 'review',
    actionUrl: 'rating',
  },
  
  review_received: {
    type: 'review_received',
    title: 'Nouvel avis reçu ⭐',
    message: 'Un utilisateur a laissé un avis sur votre club',
    recipientType: 'club',
    relatedType: 'review',
    actionUrl: 'club-reviews',
  },
};
