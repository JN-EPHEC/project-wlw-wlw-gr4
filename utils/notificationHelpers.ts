import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { 
  CreateNotificationDTO, 
  Notification, 
  NotificationType,
  notificationTemplates 
} from '@/types/Notification';

/**
 * Helper pour créer une notification dans Firestore
 * Utilisation:
 * 
 * await createNotification({
 *   type: 'member_approved',
 *   title: 'Bienvenue!',
 *   message: 'Vous avez rejoint le club',
 *   recipientId: userId,
 *   recipientType: 'user',
 *   relatedId: clubId,
 *   relatedType: 'club',
 *   actionUrl: 'club-detail',
 *   actionParams: { clubId }
 * });
 */
export const createNotification = async (dto: CreateNotificationDTO): Promise<string> => {
  try {
    // Créer le document dans Firestore - exclure les champs undefined
    const notification: any = {
      type: dto.type,
      title: dto.title,
      message: dto.message,
      recipientId: dto.recipientId,
      recipientType: dto.recipientType,
      relatedId: dto.relatedId,
      relatedType: dto.relatedType,
      metadata: dto.metadata || {},
      isRead: false,
      createdAt: Timestamp.now(),
      actionUrl: dto.actionUrl,
      actionParams: dto.actionParams || {},
    };

    // Ajouter les champs optionnels seulement s'ils existent
    if (dto.senderId) notification.senderId = dto.senderId;
    if (dto.senderName) notification.senderName = dto.senderName;
    if (dto.senderAvatar) notification.senderAvatar = dto.senderAvatar;

    // Ajouter à la collection notifications/{recipientId}
    const docRef = await addDoc(
      collection(db, 'notifications', dto.recipientId, 'items'),
      notification
    );

    console.log(`✅ Notification créée: ${docRef.id} pour ${dto.recipientId}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la notification:', error);
    throw error;
  }
};

/**
 * Helper pour créer une notification avec template
 * Remplace automatiquement les placeholders ({clubName}, {eventTitle}, etc.)
 * 
 * Utilisation:
 * 
 * await createNotificationFromTemplate('member_approved', {
 *   recipientId: userId,
 *   relatedId: clubId,
 *   metadata: { clubName: 'Canin Club Paris' }
 * });
 */
export const createNotificationFromTemplate = async (
  type: NotificationType,
  overrides: Partial<CreateNotificationDTO> & { 
    recipientId: string; 
    relatedId: string; 
    actionParams?: Record<string, any>;
  }
): Promise<string> => {
  const template = notificationTemplates[type];
  if (!template) {
    throw new Error(`Template non trouvé pour le type: ${type}`);
  }

  // Fusionner le template avec les overrides
  const dto: CreateNotificationDTO = {
    ...template,
    title: replacePlaceholders(template.title, overrides.metadata || {}),
    message: replacePlaceholders(template.message, overrides.metadata || {}),
    ...overrides,
  };

  return createNotification(dto);
};

/**
 * Remplace les placeholders dans les strings
 * Ex: "Bienvenue {userName}!" → "Bienvenue Victor!"
 */
const replacePlaceholders = (
  text: string,
  data: Record<string, any>
): string => {
  let result = text;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value || ''));
  }
  return result;
};

/**
 * Exemples de créations de notifications pour chaque cas d'usage
 * À placer dans le code où l'action se produit
 */

// ============================================
// EXEMPLE 1: Quand un user demande à rejoindre un club
// À placer dans: club-community-management.tsx (fonction handleJoinClub)
// ============================================
export const notifyClubNewMemberRequest = async (
  clubId: string,
  userId: string,
  userName: string,
  userAvatar?: string
): Promise<void> => {
  await createNotificationFromTemplate('pending_member_request', {
    recipientId: clubId,
    relatedId: clubId,
    senderId: userId,
    senderName: userName,
    senderAvatar: userAvatar,
    metadata: { memberName: userName },
    actionParams: { clubId },
  });
};

// ============================================
// EXEMPLE 2: Quand un club approuve une demande d'adhésion
// À placer dans: club-community-management.tsx (fonction handleApproveMember)
// ============================================
export const notifyUserMembershipApproved = async (
  userId: string,
  clubId: string,
  clubName: string
): Promise<void> => {
  await createNotificationFromTemplate('member_approved', {
    recipientId: userId,
    relatedId: clubId,
    metadata: { clubName },
    actionParams: { clubId },
  });
};

// ============================================
// EXEMPLE 3: Quand un club rejette une demande d'adhésion
// À placer dans: club-community-management.tsx (fonction handleRejectMember)
// ============================================
export const notifyUserMembershipRejected = async (
  userId: string,
  clubId: string,
  clubName: string
): Promise<void> => {
  await createNotificationFromTemplate('member_rejected', {
    recipientId: userId,
    relatedId: clubId,
    metadata: { clubName },
    actionParams: { clubId },
  });
};

// ============================================
// EXEMPLE 4: Quand un user réserve un événement
// À placer dans: event-booking.tsx (fonction handleBooking)
// ============================================
export const notifyClubNewBooking = async (
  clubId: string,
  eventId: string,
  eventTitle: string,
  userName: string,
  userId: string,
  userAvatar?: string
): Promise<void> => {
  await createNotificationFromTemplate('new_booking', {
    recipientId: clubId,
    relatedId: eventId,
    senderId: userId,
    senderName: userName,
    senderAvatar: userAvatar,
    metadata: { eventTitle },
    actionParams: { eventId },
  });
};

// ============================================
// EXEMPLE 5: Quand une réservation est confirmée
// À placer dans: event-booking.tsx ou club-events-management.tsx
// ============================================
export const notifyUserBookingConfirmed = async (
  userId: string,
  bookingId: string,
  eventId: string,
  eventTitle: string,
  eventDate: string
): Promise<void> => {
  await createNotificationFromTemplate('booking_confirmed', {
    recipientId: userId,
    relatedId: bookingId,
    metadata: { eventTitle, eventDate },
    actionParams: { eventId },
  });
};

// ============================================
// EXEMPLE 6: Quand une réservation est refusée
// À placer dans: club-events-management.tsx (fonction de rejet)
// ============================================
export const notifyUserBookingRejected = async (
  userId: string,
  bookingId: string,
  eventId: string,
  eventTitle: string
): Promise<void> => {
  await createNotificationFromTemplate('booking_rejected', {
    recipientId: userId,
    relatedId: bookingId,
    metadata: { eventTitle },
    actionParams: { eventId },
  });
};

// ============================================
// EXEMPLE 7: Quand un nouveau message arrive
// À placer dans: chat-room.tsx (fonction handleSendMessage)
// ============================================
export const notifyNewMessage = async (
  recipientId: string,
  messageId: string,
  senderName: string,
  messagePreview: string,
  senderId: string,
  chatRoomId: string
): Promise<void> => {
  await createNotificationFromTemplate('message_received', {
    recipientId,
    relatedId: messageId,
    senderId,
    senderName,
    metadata: { messagePreview },
    actionParams: { chatRoomId },
  });
};

// ============================================
// EXEMPLE 8: Quand un événement est créé
// À placer dans: club-events-management.tsx (fonction handleCreateEvent)
// ============================================
export const notifyEventCreated = async (
  clubId: string,
  eventId: string,
  eventTitle: string,
  eventDate: string
): Promise<void> => {
  // Notifier tous les membres du club (à adapter selon votre architecture)
  await createNotificationFromTemplate('event_created', {
    recipientId: clubId,
    relatedId: eventId,
    metadata: { eventTitle, eventDate },
    actionParams: { eventId },
  });
};

// ============================================
// EXEMPLE 9: Demande d'avis après une séance
// À placer dans: une fonction d'après-événement
// ============================================
export const notifyReviewRequested = async (
  userId: string,
  bookingId: string,
  clubName: string
): Promise<void> => {
  await createNotificationFromTemplate('review_requested', {
    recipientId: userId,
    relatedId: bookingId,
    metadata: { clubName },
    actionParams: { bookingId },
  });
};

// ============================================
// EXEMPLE 10: Nouvel avis reçu
// À placer dans: quand un avis est soumis
// ============================================
export const notifyReviewReceived = async (
  clubId: string,
  reviewId: string
): Promise<void> => {
  await createNotificationFromTemplate('review_received', {
    recipientId: clubId,
    relatedId: reviewId,
    actionParams: { clubId },
  });
};
