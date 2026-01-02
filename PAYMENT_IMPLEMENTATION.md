# 🏗️ BASES CRÉÉES - Système de Paiements v1

**Date:** 2 janvier 2026  
**Status:** ✅ Prêt pour implémentation  
**Version:** 1.0 (Hardcodé, sans intégration provider)

---

## 📋 Fichiers Créés

### 1️⃣ Type TypeScript: `types/Payment.ts`
**Localisation:** `/types/Payment.ts`  
**Contenu:**
```typescript
// Types principaux
- PaymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
- PaymentMethod: 'card' | 'cash' | 'transfer' | 'other'
- PaymentTargetType: 'booking' | 'event' | 'subscription' | 'other'

// Interfaces
- Payment (complète)
- PaymentDisplay (enrichie avec données relationnelles)
- CreatePaymentInput (pour créer un paiement)
- UpdatePaymentInput (pour modifier un paiement)
- PaymentStats (statistiques)
- PaymentFilter (filtres de recherche)
- PaymentSummary (affichage simple)
```

### 2️⃣ Hook: `hooks/useFetchClubPayments.ts`
**Localisation:** `/hooks/useFetchClubPayments.ts`  
**Fonction:**
- `useFetchClubPayments(clubId)` → Récupère TOUS les paiements du club
- Retourne: `{ payments, stats, loading, error, refetch }`
- Filtre: `WHERE receiverUserId == clubId`
- Calcule automatiquement les stats

**Exports:**
```typescript
export const useFetchClubPayments: (clubId) => {
  payments: PaymentDisplay[]
  stats: PaymentStats
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useCreatePayment: () => {
  createPayment: (input: CreatePaymentInput) => Promise<string | null>
  loading: boolean
  error: string | null
}

export const useUpdatePaymentStatus: () => {
  updateStatus: (paymentId, status) => Promise<boolean>
  loading: boolean
  error: string | null
}
```

### 3️⃣ Hook: `hooks/useFetchEducatorPayments.ts`
**Localisation:** `/hooks/useFetchEducatorPayments.ts`  
**Fonction:**
- `useFetchEducatorPayments(educatorId)` → Récupère les paiements de l'éducateur
- Retourne: `{ payments, stats, loading, error, refetch }`
- Filtre: `WHERE receiverUserId == educatorId`

### 4️⃣ Hook: `hooks/useFetchBookingPayments.ts`
**Localisation:** `/hooks/useFetchBookingPayments.ts`  
**Fonction:**
- `useFetchBookingPayments(bookingId)` → Récupère les paiements d'un booking spécifique
- Utile pour voir qui a payé dans un cours collectif
- Retourne: `{ payments, totalPaid, pendingAmount, loading, error, refetch }`

### 5️⃣ Hook: `hooks/useFetchClubBookingsWithPayments.ts`
**Localisation:** `/hooks/useFetchClubBookingsWithPayments.ts`  
**Fonction:**
- Récupère les bookings du club + enrichit avec données participant
- Utile pour voir les bookings et les participants

### 6️⃣ Page: `app/educator-payments.tsx`
**Localisation:** `/app/educator-payments.tsx`  
**UI:**
- ✅ Header avec revenus du mois
- ✅ 3 stat cards (Payés, En attente, Moyenne)
- ✅ 3 tabs: Overview, Reçus, En attente
- ✅ Liste des paiements avec statuts
- ✅ Affichage des montants

**Route:** `educatorPayments` (ajoutée à `ClubStackParamList`)

---

## 🔄 Flow de Paiement (Logique)

```
USER PREND RDV:
├─ Créer Booking (status: "pending", paid: false)
└─ Créer Payment (status: "pending") avec:
   ├─ payerUserId = userId (client)
   ├─ receiverUserId = clubId (club reçoit pour l'instant)
   ├─ targetRef = "/bookings/bookingXXX"
   ├─ targetId = bookingId
   └─ amount = prix du cours

PAYMENT REÇU:
├─ Update Payment status = "completed"
├─ Update Booking paid = true
└─ Notification au club + éducateur

CLUB VE ILS PAIEMENTS:
├─ useFetchClubPayments(clubId) → Liste des paiements
└─ Peut marquer comme payé ou relancer
```

---

## 📊 Structure Firestore Existante

Collection `payments` EXISTE DÉJÀ avec structure:

```typescript
payments/
├── {paymentId}
│   ├── id: string
│   ├── payerUserId: string              // Client qui paie
│   ├── receiverUserId: string           // Club ou éducateur
│   ├── amount: number                   // Montant
│   ├── currency: "EUR"
│   ├── description: string              // "Cours Agility"
│   ├── targetRef: "/bookings/bookingXXX" // Lien au booking
│   ├── targetId: string                 // bookingId
│   ├── targetType: "booking" | "event"
│   ├── clubId?: string                  // Club associé
│   ├── educatorId?: string              // Éducateur associé
│   ├── bookingId?: string               // Booking associé
│   ├── paymentMethodType: "card" | "cash" | "transfer"
│   ├── paymentMethodLast4?: string
│   ├── provider: "stripe" | "manual"
│   ├── providerPaymentId?: string
│   ├── receiptUrl?: string
│   ├── status: "pending" | "completed" | "failed" | "refunded"
│   ├── createdAt: Timestamp
│   ├── completedAt?: Timestamp
│   ├── refundedAt?: Timestamp
│   ├── updatedAt: Timestamp
│   └── metadata?: object
```

---

## 🚀 Prochaines Étapes Recommandées

### **Phase 1: Page Club-Payments (Urgent)**
- [ ] Updater [app/club-payments.tsx](app/club-payments.tsx)
  - Remplacer les données hardcodées
  - Utiliser `useFetchClubPayments(clubId)`
  - Afficher les vraies données
- [ ] Ajouter action "Marquer payé"
  - Utiliser `useUpdatePaymentStatus`

### **Phase 2: Logique Booking → Payment**
- [ ] Dans `booking.tsx` (réservation)
  - Après confirmation de réservation
  - Créer un Payment avec `useCreatePayment`
  - Status initialement "pending" ou "completed" (selon implémentation)

### **Phase 3: Page Éducateur (Pré-créée)**
- [ ] Intégrer `educator-payments.tsx` à la navigation
- [ ] Ajouter bouton dans menu éducateur pour accéder

### **Phase 4: Logique Split 50/50**
- [ ] Quand payment reçu:
  - Créer 2 entries? Non, 1 payment par client
  - Mais tracker dans metadata qui reçoit quoi
  - Ou créer 2 payments (un pour club, un pour éducateur)

---

## 💡 Décisions à Prendre

### **1. Split 50/50 - Comment implémenter?**

**Option A: 1 Payment, Split dans les stats**
```typescript
// 1 payment par client
const payment = {
  receiverUserId: clubId,  // C'est le club qui reçoit d'abord
  amount: 100,
  // Les stats calculent 50/50 automatiquement
}
```

**Option B: 2 Payments (Recommandé)**
```typescript
// Payment 1: Client → Club (50%)
const clubPayment = {
  payerUserId: userId,
  receiverUserId: clubId,
  amount: 50,  // 50% du prix
}

// Payment 2: Client → Éducateur (50%)
const educatorPayment = {
  payerUserId: userId,
  receiverUserId: educatorId,
  amount: 50,  // 50% du prix
}
```

**Recommandation:** Option B est plus claire et traçable.

### **2. Quand crée-t-on le Payment?**
- À la création du booking?
- Après validation du booking?
- Après paiement réel?

**Recommandation:** À la création du booking, mais avec status "pending" jusqu'à paiement.

### **3. Comment tracker qui a payé dans un cours collectif?**
- Chaque participant = 1 payment
- Voir `useFetchBookingPayments` pour avoir tous les paiements d'un booking

---

## 🧪 Test Data (Pour vérifier)

Dans Firestore, tu devrais avoir au moins 1 payment existant:
```
payments/cQRj7oWkOu34lXkZlkl/
├── amount: 29.9
├── status: "refunded"
├── description: "Abonnement Boost 30 jours pour clubTest1"
└── ...
```

Utilise cette data pour tester les hooks et l'UI.

---

## 📚 Comment Utiliser les Hooks

### **1. Afficher les paiements du club**
```typescript
import { useFetchClubPayments } from '@/hooks/useFetchClubPayments';

export function ClubPaymentsScreen({ clubId }) {
  const { payments, stats, loading, error } = useFetchClubPayments(clubId);

  if (loading) return <Text>Chargement...</Text>;
  
  return (
    <View>
      <Text>{stats.totalAmount}€ reçus</Text>
      <Text>{stats.pending} en attente</Text>
      {payments.map(p => (
        <Text key={p.id}>{p.description} - {p.amount}€</Text>
      ))}
    </View>
  );
}
```

### **2. Créer un paiement**
```typescript
import { useCreatePayment } from '@/hooks/useFetchClubPayments';

export function BookingForm() {
  const { createPayment } = useCreatePayment();

  const handleSubmit = async () => {
    const paymentId = await createPayment({
      payerUserId: userId,
      receiverUserId: clubId,  // Ou educatorId
      amount: 50,
      currency: 'EUR',
      description: 'Cours Agility',
      targetRef: '/bookings/bookingXXX',
      targetType: 'booking',
      targetId: bookingId,
      status: 'completed',
    });
    
    if (paymentId) console.log('Payment créé:', paymentId);
  };
}
```

### **3. Updater le statut**
```typescript
import { useUpdatePaymentStatus } from '@/hooks/useFetchClubPayments';

const { updateStatus } = useUpdatePaymentStatus();
await updateStatus(paymentId, 'completed');
```

---

## ⚠️ Notes Importantes

1. **Pas d'intégration provider** - Tout est manual/hardcodé pour v1
2. **receiverUserId** peut être `clubId` ou `educatorId`
3. **Status** doit être mis à jour manuellement par le club
4. **Metadata** peut contenir des infos additionnelles
5. **Split 50/50** - À décider comment implémenter (Option B recommandée)

---

**Status:** ✅ **Prêt à utiliser**  
**Prochaine action:** Updater `club-payments.tsx` pour afficher les vraies données

