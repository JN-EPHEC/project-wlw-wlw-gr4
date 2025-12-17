# 🔔 Plan de Déploiement: Notifications par Flux

## **1. FLUX: Demande d'adhésion au club**

```
UTILISATEUR                                    CLUB
    │                                           │
    ├─ Clique "Rejoindre le club"              │
    │                                           │
    ├─ Envoie demande à Firestore              │
    │           (memberships/pending)          │
    │                                           │
    │                    ┌─────────────────────│
    │                    │                      │
    │                    └─► CLUB REÇOIT NOTIF │
    │                        ├─ Type: pending_member_request
    │                        ├─ Title: "Nouvelle demande d'adhésion"
    │                        ├─ Message: "Victor demande à rejoindre..."
    │                        ├─ Voir dans: club-community-management
    │                        │
    │                        ├─ [APPROUVER]
    │                        │   │
    │                        │   └─► USER REÇOIT NOTIF
    │                        │       ├─ Type: member_approved
    │                        │       ├─ Title: "Bienvenue! 🎉"
    │                        │       └─ Message: "Vous avez rejoint le club"
    │                        │
    │                        └─ [REJETER]
    │                            │
    │                            └─► USER REÇOIT NOTIF
    │                                ├─ Type: member_rejected
    │                                ├─ Title: "Demande refusée"
    │                                └─ Message: "Votre demande a été refusée"
```

**Fichiers à modifier:**
- `club-community-management.tsx` - Créer notif quand demande envoyée + quand approuvée/rejetée

---

## **2. FLUX: Réservation d'événement**

```
UTILISATEUR                                    CLUB
    │                                           │
    ├─ Clique "Réserver"                       │
    │  (event-booking.tsx)                     │
    │                                           │
    ├─ Remplit le formulaire                   │
    │                                           │
    ├─ Confirme la réservation                 │
    │                                           │
    ├─ Envoie à Firestore                      │
    │    (bookings collection)                 │
    │                                           │
    │                    ┌─────────────────────│
    │                    │                      │
    │                    └─► CLUB REÇOIT NOTIF │
    │                        ├─ Type: new_booking
    │                        ├─ Title: "Nouvelle réservation"
    │                        ├─ Message: "Victor s'est inscrit à..."
    │                        │
    │                        ├─ [ACCEPTER]
    │                        │   │
    │                        │   └─► USER REÇOIT NOTIF
    │                        │       ├─ Type: booking_confirmed
    │                        │       ├─ Title: "Réservation confirmée! ✅"
    │                        │       └─ Message: "Votre place est confirmée"
    │                        │
    │                        └─ [REFUSER]
    │                            │
    │                            └─► USER REÇOIT NOTIF
    │                                ├─ Type: booking_rejected
    │                                ├─ Title: "Réservation refusée"
    │                                └─ Message: "Votre réservation a été refusée"
```

**Fichiers à modifier:**
- `event-booking.tsx` - Créer notif `new_booking` quand on réserve
- `club-events-management.tsx` - Créer notif approval/rejection

---

## **3. FLUX: Messages (Chat)**

```
USER A                                     USER B
   │                                         │
   ├─ Écrit un message                      │
   │  (chat-room.tsx)                       │
   │                                         │
   ├─ Clique "Envoyer"                      │
   │                                         │
   ├─ Envoie à Firestore                    │
   │   (channels/messages)                  │
   │                                         │
   │                     ┌───────────────────│
   │                     │                   │
   │                     └─► USER B REÇOIT   │
   │                         NOTIF           │
   │                         ├─ Type: message_received
   │                         ├─ Title: "Msg de Victor"
   │                         └─ Message: "Salut! Ça va?"
```

**Fichiers à modifier:**
- `chat-room.tsx` - Créer notif `message_received` quand message envoyé

---

## **4. FLUX: Nouvel événement créé**

```
CLUB OWNER                              CLUB MEMBERS
    │                                       │
    ├─ Crée un événement                   │
    │  (club-events-management.tsx)        │
    │                                       │
    ├─ Clique "Créer"                      │
    │                                       │
    ├─ Envoie à Firestore                  │
    │    (events collection)               │
    │                                       │
    │                   ┌───────────────────│
    │                   │                   │
    │                   └─► MEMBERS REÇOIVENT
    │                       NOTIF           │
    │                       ├─ Type: event_created
    │                       ├─ Title: "Nouvel événement! 🎪"
    │                       └─ Message: "Stage agility - 20 décembre"
```

**Fichiers à modifier:**
- `club-events-management.tsx` - Créer notif `event_created` pour tous les membres

---

## **5. FLUX: Demande d'avis**

```
APRÈS ÉVÉNEMENT
    │
    ├─ X jours après événement
    │  (Cloud Function ou manual trigger)
    │
    ├─ Utilisateur reçoit notif
    │    ├─ Type: review_requested
    │    ├─ Title: "Donnez votre avis!"
    │    └─ Message: "Comment était le cours?"
    │
    ├─ Utilisateur clique
    │
    ├─ Va à l'écran rating
    │
    ├─ Soumet son avis
    │
    └─► CLUB REÇOIT NOTIF
        ├─ Type: review_received
        ├─ Title: "Nouvel avis reçu ⭐"
        └─ Message: "Un utilisateur a laissé un avis"
```

**Fichiers à modifier:**
- `rating.tsx` - Créer notif `review_received` quand avis soumis
- Cloud Function (optionnel) - Créer notif `review_requested` auto

---

## **RÉSUMÉ: Où créer chaque notification**

| Notification | Type | Destinataire | Créée dans | Condition |
|---|---|---|---|---|
| ✅ Demande d'adhésion | `pending_member_request` | Club | club-community-management.tsx | Quand user clique "Rejoindre" |
| ✅ Adhésion approuvée | `member_approved` | User | club-community-management.tsx | Quand club approuve |
| ✅ Adhésion rejetée | `member_rejected` | User | club-community-management.tsx | Quand club rejette |
| 🔴 Nouvelle réservation | `new_booking` | Club | event-booking.tsx | Quand user réserve |
| 🔴 Réservation confirmée | `booking_confirmed` | User | club-events-management.tsx | Quand club accepte |
| 🔴 Réservation refusée | `booking_rejected` | User | club-events-management.tsx | Quand club rejette |
| 🔴 Nouveau message | `message_received` | User | chat-room.tsx | Quand message reçu |
| 🔴 Événement créé | `event_created` | Club Members | club-events-management.tsx | Quand événement créé |
| 🔴 Rappel événement | `event_reminder` | User | Cloud Function/Scheduler | 24h avant l'événement |
| 🔴 Demande d'avis | `review_requested` | User | Cloud Function/Manual | Après événement |
| 🔴 Avis reçu | `review_received` | Club | rating.tsx | Quand avis soumis |

---

## **✅ STRUCTURE FIREBASE PROPOSÉE**

```
notifications/
├── {userId}/
│   └── items/
│       ├── notif_001/
│       │   ├── type: "member_approved"
│       │   ├── title: "Bienvenue! 🎉"
│       │   ├── message: "..."
│       │   ├── recipientId: "userId"
│       │   ├── recipientType: "user"
│       │   ├── isRead: false
│       │   ├── createdAt: Timestamp
│       │   └── ...
│       │
│       └── notif_002/
│
└── {clubId}/
    └── items/
        ├── notif_101/
        │   ├── type: "new_booking"
        │   ├── title: "Nouvelle réservation"
        │   ├── ...
        │
        └── notif_102/
```

---

## **🚀 Prochaine étape: Phase 3**

Une fois cette structure acceptée, on va:

1. ✅ Créer les hooks personnalisés (`useNotifications`, etc.)
2. ✅ Refactoriser `notifications.tsx` pour utiliser les vraies données
3. ✅ Ajouter les appels de créations dans chaque fichier
4. ✅ Tester le flux complet

**Des questions sur cette architecture?**
