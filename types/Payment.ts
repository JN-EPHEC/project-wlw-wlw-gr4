import { Timestamp } from 'firebase/firestore';

/**
 * Status possibles d'un paiement
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

/**
 * Méthode de paiement
 */
export type PaymentMethod = 'card' | 'cash' | 'transfer' | 'other';

/**
 * Type de cible du paiement
 */
export type PaymentTargetType = 'booking' | 'event' | 'subscription' | 'other';

/**
 * Interface complète pour un Payment
 */
export interface Payment {
  // ====== IDs & RÉFÉRENCES ======
  id: string;
  payerUserId: string; // Qui paie (client)
  receiverUserId: string; // Qui reçoit (club ou educateur)
  
  // ====== RELATIONS ======
  targetRef: string; // Référence au document: "/bookings/bookingXXX"
  targetType: PaymentTargetType; // Type de cible: "booking", "event", etc.
  targetId: string; // ID de la cible (bookingXXX)
  
  clubId?: string; // Club associé (optionnel)
  educatorId?: string; // Éducateur associé (optionnel)
  bookingId?: string; // Booking associé (optionnel)
  
  // ====== MONTANT & DEVISE ======
  amount: number; // Montant en cents ou unité principale
  currency: string; // "EUR", "USD", etc.
  
  // ====== DESCRIPTION ======
  description: string; // "Cours Agility - 50€", etc.
  
  // ====== MÉTHODE DE PAIEMENT ======
  paymentMethodType: PaymentMethod; // "card", "cash", "transfer"
  paymentMethodLast4?: string; // Derniers 4 chiffres de la carte
  
  // ====== PROVIDER EXTERNE (Stripe, etc.) ======
  provider: string; // "stripe", "paypal", "manual", etc.
  providerPaymentId?: string; // ID externe (Stripe: pi_XXX, etc.)
  receiptUrl?: string; // URL du reçu envoyé par le provider
  
  // ====== STATUT & DATES ======
  status: PaymentStatus; // État du paiement
  createdAt: Timestamp | Date; // Créé quand
  completedAt?: Timestamp | Date | null; // Payé quand
  refundedAt?: Timestamp | Date | null; // Remboursé quand
  updatedAt: Timestamp | Date; // Dernière modification
  
  // ====== MÉTADONNÉES ======
  metadata?: {
    [key: string]: any;
  };
}

/**
 * Interface pour affichage enrichi
 */
export interface PaymentDisplay extends Payment {
  // Données enrichies depuis les collections relationnelles
  payerName?: string; // Nom du client
  payerEmail?: string;
  payerPhone?: string;
  receiverName?: string; // Nom du club ou éducateur
  bookingTitle?: string; // "Cours Agility groupe"
  bookingDate?: Timestamp | Date; // Date du cours
  participantsCount?: number; // Nombre de participants au cours
}

/**
 * Input pour créer un paiement
 */
export interface CreatePaymentInput {
  payerUserId: string;
  receiverUserId: string;
  amount: number;
  currency: string;
  description: string;
  
  targetRef: string; // "/bookings/bookingXXX"
  targetType: PaymentTargetType;
  targetId: string;
  
  clubId?: string;
  educatorId?: string;
  bookingId?: string;
  
  paymentMethodType?: PaymentMethod;
  provider?: string;
  
  status?: PaymentStatus; // Default: "completed"
  metadata?: Record<string, any>;
}

/**
 * Input pour updater un paiement
 */
export interface UpdatePaymentInput {
  status?: PaymentStatus;
  paymentMethodLast4?: string;
  providerPaymentId?: string;
  receiptUrl?: string;
  completedAt?: Timestamp | Date;
  refundedAt?: Timestamp | Date;
  metadata?: Record<string, any>;
}

/**
 * Statistiques de paiements
 */
export interface PaymentStats {
  total: number; // Nombre total de paiements
  completed: number; // Paiements complétés
  pending: number; // En attente
  failed: number; // Échoués
  refunded: number; // Remboursés
  totalAmount: number; // Montant total reçu
  pendingAmount: number; // Montant en attente
}

/**
 * Filtre pour rechercher les paiements
 */
export interface PaymentFilter {
  payerUserId?: string;
  receiverUserId?: string;
  clubId?: string;
  educatorId?: string;
  bookingId?: string;
  status?: PaymentStatus;
  targetType?: PaymentTargetType;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Info pour affichage simple d'un paiement
 */
export interface PaymentSummary {
  id: string;
  payerName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  date: Date;
  description: string;
  method: PaymentMethod;
}
