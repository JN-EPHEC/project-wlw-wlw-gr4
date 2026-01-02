# 🏗️ Architecture Visuelles - Système de Paiements

---

## 📊 Data Flow (Fluxe de Données)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER PREND RDV                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │   booking.tsx (FORM)            │
            │  - Sélectionne cours            │
            │  - Entre détails                │
            │  - Clique "Réserver"            │
            └─────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ Create Booking   │  │ Create Payment   │
        │ (Firestore)      │  │ (Firestore)      │
        │                  │  │                  │
        │ ✅ ID           │  │ ✅ ID            │
        │ ✅ clubId       │  │ ✅ payerUserId   │
        │ ✅ userIds[]    │  │ ✅ receiverUserId│
        │ ✅ price        │  │ ✅ amount        │
        │ ✅ status       │  │ ✅ status        │
        │ ✅ paid: false  │  │ ✅ targetRef     │
        └──────────────────┘  └──────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    ┌──────────────────┐
                    │   SUCCESS PAGE   │
                    │  RDV confirmé!   │
                    │  Paiement requis │
                    └──────────────────┘
```

---

## 🎭 Rôles & Permissions

```
┌──────────────────────────────────────────────────────────────┐
│                        USER (Client)                         │
├──────────────────────────────────────────────────────────────┤
│ ✅ Voit ses bookings                                         │
│ ✅ Crée des paiements (en réservant)                         │
│ ⚠️  Voit le statut de ses paiements (Future)                 │
│ ❌ Voit les paiements d'autres users                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   CLUB (Manager)                             │
├──────────────────────────────────────────────────────────────┤
│ ✅ Voit TOUS les paiements de son club                       │
│ ✅ Peut marquer un paiement comme "reçu"                     │
│ ✅ Voit les statistiques (revenus, etc.)                     │
│ ✅ Voit qui a payé dans chaque cours                         │
│ ❌ Voit les paiements d'autres clubs                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  EDUCATOR (Professeur)                       │
├──────────────────────────────────────────────────────────────┤
│ ✅ Voit les paiements qu'il a reçus (50% du prix)           │
│ ✅ Voit les statistiques de ses cours                        │
│ ⚠️  Peut marquer comme reçu? (A définir)                     │
│ ❌ Voit les paiements d'autres éducateurs                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Firestore Collections

```
firestore/
│
├── club/                          ← Clubs (pas changé)
│
├── users/                         ← Users (pas changé)
│
├── bookings/                      ← RÉSERVATIONS/COURS
│   └── {bookingId}/
│       ├── id
│       ├── clubId
│       ├── educatorId
│       ├── userIds: [userId1, userId2]  ← Participants
│       ├── price: 50               ← Prix PAR PARTICIPANT
│       ├── paid: false             ← Tous payés?
│       ├── paymentIds: [...]       ← Liens aux payments
│       └── ...
│
├── payments/ ✨ NOUVELLE                ← PAIEMENTS
│   └── {paymentId}/
│       ├── id
│       ├── payerUserId            ← Client qui paie
│       ├── receiverUserId         ← Club/Educateur qui reçoit
│       ├── amount: 50              ← Montant de ce paiement
│       ├── targetRef: "/bookings/bookingXXX"
│       ├── targetId: "bookingXXX"
│       ├── targetType: "booking"
│       ├── status: "completed"    ← pending/completed/failed/refunded
│       ├── description: "Cours Agility"
│       ├── createdAt
│       ├── completedAt
│       └── metadata: {}
│
└── educators/                      ← Educateurs (pas changé)
```

---

## 🔗 Relations (Entity-Relationship)

```
┌──────────────┐
│   Payment    │
├──────────────┤
│ id           │
│ payerUserId  │────────────┐
│ receiverUserId            │
│ targetId     │──────┐     │
│ amount       │      │     │
│ status       │      │     │
└──────────────┘      │     │
        │             │     │
        │      ┌──────▼──────────┐
        │      │    Booking      │
        │      ├─────────────────┤
        │      │ id              │
        │      │ clubId          │
        │      │ educatorId      │
        │      │ userIds[]       │
        │      │ paymentIds[]◄───┘
        │      │ status          │
        │      │ paid            │
        │      └─────────────────┘
        │             │
        ├─────────────┼──────────┬──────────┐
        │             │          │          │
        ▼             ▼          ▼          ▼
    ┌────┐       ┌────┐     ┌────────┐  ┌────┐
    │User│       │Club│     │Educator│  │Dog │
    └────┘       └────┘     └────────┘  └────┘
```

---

## 📱 UI Screens & Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                    CLUB MANAGER                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ClubHome (clubHome)                                        │
│  ├─ → Club Payments ✨ UPDATED!                           │
│  │    (clubPayments)                                       │
│  │    - Affiche les VRAIES données                        │
│  │    - Statistiques en temps réel                        │
│  │    - Marquer comme payé                                │
│  │                                                         │
│  ├─ → Club Members                                         │
│  ├─ → Club Appointments                                    │
│  ├─ → Club Teachers                                        │
│  │    ├─ → Educator Payments ✨ NEW!                      │
│  │    │    (educatorPayments)                             │
│  │    │    - Page complète (créée)                       │
│  │    │    - Revenus éducateur                           │
│  │    │    - Paiements reçus/en attente                  │
│  │    │                                                   │
│  │    └─ → Teachers Pricing                               │
│  │                                                         │
│  └─ → Other screens...                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      USER (Client)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Home (home)                                                │
│  ├─ → Club Detail                                          │
│  │    └─ → Booking Form ✨ UPDATED!                       │
│  │         (booking)                                      │
│  │         - Crée Payment après booking                   │
│  │         - Intègre useCreatePayment                     │
│  │                                                         │
│  ├─ → My Bookings (Future)                                │
│  └─ → My Payments (Future)                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎣 Hooks & Functions

```
┌─────────────────────────────────────────────────────────────┐
│  Hooks de Paiements (./hooks/)                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📌 useFetchClubPayments(clubId)                            │
│    ├─ Récupère: payments[], stats                          │
│    ├─ Filtre: WHERE receiverUserId == clubId              │
│    └─ Utile pour: club-payments.tsx                       │
│                                                             │
│ 📌 useFetchEducatorPayments(educatorId)                    │
│    ├─ Récupère: payments[], stats                          │
│    ├─ Filtre: WHERE receiverUserId == educatorId          │
│    └─ Utile pour: educator-payments.tsx                   │
│                                                             │
│ 📌 useFetchBookingPayments(bookingId)                      │
│    ├─ Récupère: payments[], totalPaid, pendingAmount      │
│    ├─ Filtre: WHERE targetId == bookingId                │
│    └─ Utile pour: voir qui a payé dans un cours          │
│                                                             │
│ 📌 useFetchClubBookingsWithPayments(clubId)               │
│    ├─ Récupère: bookings[], enrichis avec users           │
│    ├─ Filtre: WHERE clubId == clubId                     │
│    └─ Utile pour: vue globale bookings + participants     │
│                                                             │
│ 📌 useCreatePayment() (from useFetchClubPayments)         │
│    ├─ Crée: Payment dans Firestore                        │
│    ├─ Input: CreatePaymentInput                           │
│    └─ Utile pour: booking form                            │
│                                                             │
│ 📌 useUpdatePaymentStatus() (from useFetchClubPayments)   │
│    ├─ Update: status d'un paiement                        │
│    ├─ Input: paymentId, status                            │
│    └─ Utile pour: marquer comme payé                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Status Flow d'un Paiement

```
                    ┌─────────────┐
                    │   PENDING   │  ← Au moment du booking
                    └──────┬──────┘
                           │
                    ┌──────▼───────┐
                    │   COMPLETED  │  ← Quand client paie
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
        ┌───────▼────────┐   ┌────────▼──────┐
        │   REFUNDED     │   │     FAILED    │
        │ (Remboursé)    │   │   (Échoué)    │
        └────────────────┘   └───────────────┘
```

---

## 💾 Types (TypeScript)

```
types/Payment.ts
├── PaymentStatus
│   ├─ "pending"
│   ├─ "completed"
│   ├─ "failed"
│   ├─ "refunded"
│   └─ "cancelled"
│
├── PaymentMethod
│   ├─ "card"
│   ├─ "cash"
│   ├─ "transfer"
│   └─ "other"
│
├── PaymentTargetType
│   ├─ "booking"
│   ├─ "event"
│   ├─ "subscription"
│   └─ "other"
│
├── Payment (interface)
│   ├─ id, payerUserId, receiverUserId
│   ├─ amount, currency
│   ├─ targetRef, targetId, targetType
│   ├─ status, description
│   ├─ createdAt, completedAt, refundedAt
│   └─ metadata
│
├── PaymentDisplay (extends Payment)
│   ├─ + payerName, payerEmail
│   ├─ + receiverName
│   ├─ + bookingTitle, bookingDate
│   └─ + participantsCount
│
├── CreatePaymentInput
│   └─ Utilisé par useCreatePayment()
│
├── UpdatePaymentInput
│   └─ Utilisé par useUpdatePaymentStatus()
│
├── PaymentStats
│   ├─ total, completed, pending, failed, refunded
│   ├─ totalAmount, pendingAmount
│   └─ Retourné par useFetchClubPayments()
│
└── ... (autres interfaces)
```

---

## 🔄 Cycle de Vie d'un Paiement

```
TIME 0: USER RÉSERVE COURS
└─ Créer Booking (status: "pending", paid: false)
└─ Créer Payment (status: "pending")
   └─ payerUserId = userId (client)
   └─ receiverUserId = clubId (club pour v1)
   └─ amount = prix du cours
   └─ targetRef = "/bookings/{bookingId}"

TIME X: PAIEMENT REÇU (Eventuellement)
├─ Update Payment: status = "completed"
├─ Update Booking: paid = true
└─ Send Notification to club + educator

TIME Y: CLUB VERIFIE
├─ useFetchClubPayments(clubId) → affiche tous les paiements
└─ Peut voir: qui a payé, montants, dates, statuts

TIME Z: EDUCATEUR VERIFIE
├─ useFetchEducatorPayments(educatorId) → ses paiements
└─ Peut voir: ses revenus, paiements reçus

TIME W: REMBOURSEMENT
├─ Update Payment: status = "refunded"
├─ refundedAt = timestamp
└─ Amount déduit des revenus
```

---

## 📈 Scénario: Cours Collectif (4 participants)

```
COURS: "Agility Groupe" - 50€/participant
PARTICIPANTS: Alice, Bob, Charlie, Diana
TOTAL REVENUS: 200€

┌─────────────────────────────────────────────────────────┐
│ BOOKING (1 document)                                    │
├─────────────────────────────────────────────────────────┤
│ id: "booking123"                                        │
│ clubId: "club1"                                         │
│ educatorId: "edu1"                                      │
│ userIds: ["alice", "bob", "charlie", "diana"]          │
│ price: 50                   ← Par participant          │
│ paid: false                 ← Quand TOUS ont payé      │
│ paymentIds: [p1, p2, p3, p4]                           │
│ title: "Agility Groupe"                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PAYMENTS (4 documents)                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Payment 1 (Alice):                                      │
│  payerUserId: "alice"                                   │
│  receiverUserId: "club1"  ← ou "edu1" si split 50/50   │
│  amount: 50              ← Prix particip. (50) + part   │
│  status: "completed"                                    │
│  targetRef: "/bookings/booking123"                      │
│                                                         │
│ Payment 2 (Bob):                                        │
│  payerUserId: "bob"                                     │
│  receiverUserId: "club1"                                │
│  amount: 50                                             │
│  status: "pending"  ← N'a pas payé                      │
│  ...                                                    │
│                                                         │
│ Payment 3 (Charlie):                                    │
│  payerUserId: "charlie"                                 │
│  amount: 50                                             │
│  status: "completed"                                    │
│  ...                                                    │
│                                                         │
│ Payment 4 (Diana):                                      │
│  payerUserId: "diana"                                   │
│  amount: 50                                             │
│  status: "completed"                                    │
│  ...                                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

STATS DU CLUB:
├─ Total payments: 4
├─ Completed: 3
├─ Pending: 1
├─ Total reçu: 150€ (3 × 50€)
└─ En attente: 50€ (1 × 50€)

VISION DU CLUB:
└─ useFetchClubPayments(club1)
   ├─ Alice: ✅ 50€ payé
   ├─ Bob:   ⏳ 50€ en attente
   ├─ Charlie: ✅ 50€ payé
   └─ Diana: ✅ 50€ payé
```

---

## ✨ Avantages de cette Architecture

```
✅ Flexibilité
   - Chaque participant = 1 payment
   - Facile de tracker individuellement

✅ Transparence
   - Qui a payé? Voir targetId + payerUserId
   - Quand? Voir createdAt + completedAt

✅ Extensibilité
   - Ajouter split 50/50 facilement (2 payments)
   - Ajouter frais/taxes facilement (metadata)

✅ Traçabilité
   - Historique complet des transactions
   - Qui a remboursé? (status: refunded)

✅ Performance
   - Requêtes simples (WHERE receiverUserId)
   - Pas d'index composite nécessaire
```

---

**End of Architecture Diagram. Bonne compréhension! 📚**
