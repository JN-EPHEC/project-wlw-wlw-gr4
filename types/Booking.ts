import { Timestamp } from 'firebase/firestore';

/**
 * Status possibles d'une réservation
 */
export type BookingStatus = 'available' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

/**
 * Type de cours
 */
export type BookingType = 'club-based' | 'home-based';

/**
 * Interface complète pour un Booking
 */
export interface Booking {
  // ====== IDs & RÉFÉRENCES ======
  id: string;
  clubId: string;
  educatorId: string;
  fieldId: string; // Référence à la collection "fields"

  // ====== PARTICIPANTS (ARRAY) ======
  userIds: string[]; // Array des utilisateurs inscrits
  maxParticipants: number; // Capacité max du cours

  // ====== INFOS DU COURS ======
  title: string; // "Agility groupe", "Coaching chiot", etc.
  description: string; // Description du cours
  trainingType: string; // "agility", "obedience", etc.
  isGroupCourse: boolean; // true = collectif, false = privé

  // ====== DATES & HORAIRES ======
  sessionDate: Timestamp | Date; // Date + heure du cours
  duration: number; // En minutes (60, 90, 120, etc.)

  // ====== CHIENS & INFOS ======
  dogIds?: string[]; // Array des chiens participants

  // ====== PAIEMENT ======
  price: number; // Prix unitaire (par participant)
  totalPrice?: number; // Prix total (price * nombre de participants)
  paymentIds: string[]; // Array de références à la collection "payments"
  currency: string; // "EUR", "USD", etc.
  paid: boolean; // Si TOUS les paiements sont complétés
  paidAt?: Timestamp | Date | null; // Quand le paiement a été complété

  // ====== STATUTS & WORKFLOW ======
  status: BookingStatus;
  type: BookingType;
  createdBy: 'club' | 'user'; // NEW: Distingue si le cours a été créé par le club ou si c'est une réservation d'utilisateur
  requestedTeacher?: string | null; // Si utilisateur demande éducateur spécifique
  rejectionReason?: string | null; // Raison du refus
  rejectedAt?: Timestamp | Date | null; // Quand refusé
  confirmedAt?: Timestamp | Date | null; // Quand confirmé avec éducateur
  completedAt?: Timestamp | Date | null; // Quand le cours s'est déroulé

  // ====== AVIS & FEEDBACK (COLLECTIONS) ======
  reviewIds: string[]; // Array de références à la collection "reviews"

  // ====== AUDIT ======
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

/**
 * Interface pour affichage en liste (enrichie avec données relationnelles)
 */
export interface BookingDisplay extends Booking {
  // Données enrichies depuis les collections relationnelles
  fieldName?: string; // Nom du terrain
  fieldAddress?: string; // Adresse du terrain
  educatorName?: string; // Nom complet de l'éducateur
  educatorPhone?: string; // Téléphone éducateur
  currentParticipants?: number; // Nombre de participants actuels
  availableSpots?: number; // Places restantes
  userNames?: string[]; // Noms des utilisateurs
  dogNames?: string[]; // Noms des chiens
}

/**
 * Interface pour créer un nouveau Booking
 */
export interface CreateBookingInput {
  clubId: string;
  educatorId?: string; // Optionnel au départ
  fieldId?: string;
  title: string;
  description?: string;
  trainingType: string;
  isGroupCourse: boolean;
  sessionDate: Date | Timestamp;
  duration: number;
  price: number;
  maxParticipants?: number;
  createdBy: 'club' | 'user'; // NEW: Indique qui crée le booking
  type?: 'club-based' | 'home-based'; // NEW: Type de booking
  status?: BookingStatus; // NEW: Statut initial du booking
  userIds?: string[]; // Optionnel (peut être ajouté après)
  dogIds?: string[];
}

/**
 * Interface pour mettre à jour un Booking
 */
export interface UpdateBookingInput {
  sessionDate?: Timestamp | Date;
  educatorId?: string;
  userIds?: string[]; // Ajouter des utilisateurs
  dogIds?: string[];
  status?: BookingStatus;
  confirmedAt?: Timestamp | Date;
  rejectionReason?: string;
  rejectedAt?: Timestamp | Date;
  completedAt?: Timestamp | Date;
  reviewIds?: string[];
  paid?: boolean;
  paymentIds?: string[];
}

/**
 * Statistiques d'un Booking
 */
export interface BookingStats {
  total: number; // Total de bookings
  pending: number; // En attente
  confirmed: number; // Confirmés
  completed: number; // Complétés
  cancelled: number; // Annulés
  rejected: number; // Refusés
}

/**
 * Filtre pour rechercher les bookings
 */
export interface BookingFilter {
  clubId?: string;
  educatorId?: string;
  status?: BookingStatus;
  dateFrom?: Date;
  dateTo?: Date;
  isGroupCourse?: boolean;
}
