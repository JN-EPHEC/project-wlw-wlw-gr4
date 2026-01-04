# 🎨 MAQUETTE UI & FLUX NOTIFICATIONS

**Document:** Visualisation des pages et flux  
**Objectif:** Clarifier comment les notifs s'intègrent dans l'interface

---

## 📱 PAGE NOTIFICATIONS - VUE ACTUELLE

### Structure du Layout

```
┌─────────────────────────────────────────┐
│  ← Mes notifications        ✓✓ 3 non lues │
├─────────────────────────────────────────┤
│                                         │
│  🏢 Nouvelle adhésion                   │
│  Victor Lemoine demande à rejoindre     │
│  2 heures                               │
│  ✗                                      │
├─────────────────────────────────────────┤
│  ✅ Réservation confirmée!             │
│  Votre place est confirmée              │
│  1 jour                                 │
│  ✗                                      │
├─────────────────────────────────────────┤
│  💬 Message de Victor                   │
│  "Salut! C'est pour confirmer..."      │
│  3 jours                                │
│  ✗                                      │
├─────────────────────────────────────────┤
│  (scroll down)                          │
│                                         │
│  🎪 Nouvel événement créé               │
│  Stage Agility - 20 décembre            │
│  1 semaine                              │
│  ✓ (déjà lu)                           │
│                                         │
└─────────────────────────────────────────┘
```

### Types de Notifications - Icônes & Couleurs

```
TYPE                      ICÔNE    COULEUR      EXEMPLE
─────────────────────────────────────────────────────────────
pending_member_request    🏢      BLEU         "Nouvelle demande d'adhésion"
member_approved           ✅      VERT         "Bienvenue!"
member_rejected           ❌      ROUGE        "Demande refusée"
booking_confirmed         ✅      VERT         "Réservation confirmée"
booking_rejected          ❌      ROUGE        "Réservation refusée"
new_booking               🆕      ORANGE       "Nouvelle réservation"
message_received          💬      BLEU         "Nouveau message"
event_created             🎪      VIOLET       "Nouvel événement"
event_reminder            ⏰      ORANGE       "Rappel événement"
review_requested          ⭐      JAUNE        "Donnez votre avis"
review_received           ⭐      JAUNE        "Avis reçu"
```

---

## 🔄 FLUX VISUELS PAR SCÉNARIO

### SCÉNARIO 1: Demande d'adhésion au club

```
┌─────────────┐
│   USER      │
│ club-detail │
└────┬────────┘
     │ 1. Clique "Rejoindre le club"
     │
     ├─→ Envoie memberships/pending à Firestore
     │
     ├─→ createNotification({
     │      recipientId: clubId,
     │      type: "pending_member_request",
     │      senderId: userId,
     │      senderName: "Victor Lemoine"
     │   })
     │
     └─→ 💾 NOTIF CRÉÉE DANS Firestore
           notifications/{clubId}/items/{notifId}

         ┌──────────────────────┐
         │      CLUB            │
         │ /notifications       │
         └────┬─────────────────┘
              │ 2. Voit la notif en ouverture l'app
              │    🏢 Nouvelle adhésion
              │    Victor Lemoine demande...
              │
              │ 3. Clique → navigate à club-community-management
              │    (avec notification.relatedId = clubId)
              │
              │ 4a. Clique "APPROUVER"
              │     ├─→ Update memberships status = "active"
              │     │
              │     └─→ createNotification({
              │          recipientId: userId,
              │          type: "member_approved",
              │          title: "Bienvenue! 🎉"
              │        })
              │
              │ 4b. Clique "REJETER"
              │     └─→ createNotification({
              │          recipientId: userId,
              │          type: "member_rejected"
              │        })

┌─────────────┐
│   USER      │
│ /notifi...  │
└────┬────────┘
     │ 5. Ouvre l'app / page notif
     │    Voit: ✅ Bienvenue! Vous avez rejoint le club
     │
     │ 6. Clique
     │    → navigate('club-detail', { clubId: "..." })
     │
     └─→ AFFICHE LE CLUB ✅
```

---

### SCÉNARIO 2: Réservation à un événement

```
┌──────────────────┐
│   USER           │
│ event-booking    │
└────┬─────────────┘
     │ 1. Remplit form + clique "Confirmer"
     │
     ├─→ Envoie booking à Firestore
     │
     ├─→ createNotification({
     │      recipientId: clubId,
     │      type: "new_booking",
     │      senderId: userId,
     │      metadata: {
     │        eventTitle: "Stage Agility",
     │        eventDate: "2026-01-15",
     │        memberName: "Victor Lemoine"
     │      }
     │   })
     │
     └─→ 💾 NOTIF CRÉÉE

         ┌──────────────────────────────────┐
         │      CLUB                        │
         │ /notifications                   │
         │ club-events-management (modal)   │
         └────┬─────────────────────────────┘
              │ 2. Voit la notif
              │    🆕 Nouvelle réservation
              │    Victor s'inscrit à Stage Agility
              │
              │ 3. Va dans club-events-management
              │    Voit la réservation en pending
              │
              │ 4a. Clique "ACCEPTER"
              │     ├─→ Update booking status = "confirmed"
              │     │
              │     └─→ createNotification({
              │          recipientId: userId,
              │          type: "booking_confirmed"
              │        })
              │
              │ 4b. Clique "REFUSER"
              │     └─→ createNotification({
              │          recipientId: userId,
              │          type: "booking_rejected"
              │        })

┌──────────────┐
│   USER       │
│ /notifi...   │
└────┬─────────┘
     │ 5. Voit: ✅ Réservation confirmée!
     │    Votre place pour Stage Agility est confirmée
     │
     │ 6. Clique
     │    → navigate('event-detail', { eventId: "..." })
     │
     └─→ AFFICHE L'ÉVÉNEMENT ✅
```

---

### SCÉNARIO 3: Nouveau message

```
┌──────────────┐
│   USER A     │
│ chat-room    │
└────┬─────────┘
     │ 1. Écrit message "Salut! Ça va?"
     │
     │ 2. Clique "Envoyer"
     │    ├─→ Envoie à messages/{channelId}
     │    │
     │    └─→ createNotification({
     │         recipientId: userIdB,
     │         type: "message_received",
     │         senderName: "Victor Lemoine",
     │         metadata: {
     │           messagePreview: "Salut! Ça va?"
     │         }
     │       })
     │
     └─→ 💾 NOTIF CRÉÉE

         ┌──────────────┐
         │   USER B     │
         │ /notifications
         └────┬─────────┘
              │ 3. USER B a la notif
              │    💬 Message de Victor
              │    "Salut! Ça va?"
              │
              │ 4. Clique
              │    → navigate('chat-room', {
              │         userId: userIdA,
              │         channelId: channelId
              │       })
              │
              └─→ AFFICHE LA CONVERSATION ✅
```

---

### SCÉNARIO 4: Nouvel événement créé

```
┌──────────────────────────────┐
│   CLUB                       │
│ club-events-management       │
└────┬────────────────────────┘
     │ 1. Crée nouvel événement "Stage Agility"
     │
     │ 2. Clique "Créer"
     │    ├─→ Envoie event à Firestore
     │    │
     │    └─→ FOR EACH member in club:
     │         createNotification({
     │           recipientId: memberId,
     │           type: "event_created",
     │           metadata: {
     │             eventTitle: "Stage Agility",
     │             eventDate: "2026-01-15"
     │           }
     │         })
     │
     └─→ 💾 NOTIFS CRÉÉES POUR TOUS LES MEMBRES

         ┌──────────────┐
         │   USER 1     │
         │ /notifications
         ├──────────────┤
         │ 🎪 Nouvel événement créé
         │ Stage Agility - 20 décembre
         │
         └────┬─────────┘
              │ 3. Clique
              │    → navigate('event-detail', { eventId })
              │
              └─→ AFFICHE L'ÉVÉNEMENT ✅

         ┌──────────────┐
         │   USER 2     │
         │ /notifications
         ├──────────────┤
         │ 🎪 Nouvel événement créé
         │ Stage Agility - 20 décembre
         │
         └─→ (Idem)
```

---

## 🏠 BOTTOM NAVIGATION - BADGES

### AVANT (Actuel)

```
┌─────────────────────────────────────────┐
│  🏠        👥        🎯        ⚙️         │
│ Home      Search    Bookings  Settings  │
└─────────────────────────────────────────┘
```

### APRÈS (Avec badges)

```
┌─────────────────────────────────────────┐
│  🏠      👥      🎯      🔔₃     ⚙️     │
│ Home   Search  Bookings  Notif  Settings │
│                          (3 non-lues)   │
└─────────────────────────────────────────┘
```

**Implémentation:**

```typescript
import { useUnreadNotificationCount } from '@/hooks/useNotifications';

export function UserBottomNav() {
  const userId = ...;
  const unreadCount = useUnreadNotificationCount(userId);
  
  return (
    <BottomTabNavigator>
      <Tab.Screen
        name="notifications"
        component={NotificationsScreen}
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
          // Badge avec couleur rouge par défaut
        }}
      />
    </BottomTabNavigator>
  );
}
```

---

## 📄 STRUCTURE DE PAGE NOTIFICATIONS (Détaillée)

### UI Complète

```
┌─────────────────────────────────────────┐
│ ← Mes notifications           ✓✓ 2 non lues
├─────────────────────────────────────────┤
│ SECTION 1: NOUVELLES (non-lues)         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🏢 │ Nouvelle demande d'adhésion    │ │
│ │    │ Victor Lemoine demande à...    │ │
│ │    │ Il y a 2 heures         [···]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✅ │ Réservation confirmée!         │ │
│ │    │ Votre place est confirmée      │ │
│ │    │ Il y a 1 jour           [···]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ SECTION 2: LUES                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💬 │ Message de Victor               │ │
│ │    │ "Salut! C'est pour confirmer..." │ │
│ │    │ Il y a 3 jours          [···]   │ │
│ │    │ (icon grisé = lue)              │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Actions au clic

```
┌─ Clique sur la notif
│  └─ Si isRead == false
│     ├─ markAsRead(notifId)
│     │  └─ Update: isRead = true, readAt = now
│     │
│     └─ Navigate vers actionUrl avec actionParams
│        └─ Exemple:
│           navigate('event-detail', {
│             eventId: notification.relatedId
│           })
│
└─ Clique sur "✓✓" (marquer tout comme lu)
   └─ markAllAsRead()
      └─ Update: isRead = true pour toutes les non-lues
```

### Menu contextuel (...) 

**Option A (Futur):**
```
┌─────────────────────────┐
│ [···] (3-dot menu)     │
├─────────────────────────┤
│ □ Archiver              │
│ 🔔 Activer notifications│
│ 🗑 Supprimer            │
└─────────────────────────┘
```

Pour V1: Ignorer le menu (juste tirer pour supprimer?)

---

## 👥 DIFFÉRENTES PAGES DE NOTIFICATIONS

### Vue 1: USER (Propriétaire)

**Page:** `app/notifications.tsx` (quand user=owner)

Types vus:
- `member_approved` - Adhésion acceptée
- `booking_confirmed` - Réservation confirmée
- `message_received` - Message reçu
- `event_created` - Nouvel événement
- `review_requested` - Avis demandé

---

### Vue 2: CLUB (Gestionnaire)

**Page:** `app/notifications.tsx` (quand user=club owner)

Types vus:
- `pending_member_request` - Demande d'adhésion
- `new_booking` - Nouvelle réservation

**Récupération:** Au lieu de `useNotifications(userId)`, utiliser `useNotifications(clubId)`

---

### Vue 3: EDUCATOR (Éducateur)

**Page:** `app/notifications.tsx` (quand user=educator)

À définir selon tes besoins

**Récupération:** `useNotifications(educatorId)`

---

## 🎯 RÉSUMÉ DES PAGES À MODIFIER

| Page | Action | Notif créée | Destinataire |
|------|--------|-----------|------------|
| `club-detail.tsx` | Clique "Rejoindre" | `pending_member_request` | Club |
| `club-community-management.tsx` | Approuve demande | `member_approved` | User |
| `club-community-management.tsx` | Rejette demande | `member_rejected` | User |
| `event-booking.tsx` | Submit formulaire | `new_booking` | Club |
| `club-events-management.tsx` | Accepte réservation | `booking_confirmed` | User |
| `club-events-management.tsx` | Refuse réservation | `booking_rejected` | User |
| `chat-room.tsx` | Envoie message | `message_received` | Autre User |
| `club-events-management.tsx` | Crée événement | `event_created` | Tous les members |

---

## 📲 EXEMPLE DE CODE - INTÉGRATION

### Dans `event-booking.tsx`

```typescript
import { useCreateNotification } from '@/hooks/useCreateNotification';

export default function EventBookingScreen() {
  const { createNotification } = useCreateNotification();
  const { clubId } = route.params;
  
  const handleSubmit = async (formData) => {
    try {
      // 1. Créer la réservation
      const bookingId = await createBooking({...formData});
      
      // 2. NOUVEAU: Créer la notif pour le club
      await createNotification({
        type: 'new_booking',
        title: 'Nouvelle réservation',
        message: `${userName} s'inscrit à ${eventTitle}`,
        recipientId: clubId,
        recipientType: 'club',
        relatedId: bookingId,
        relatedType: 'booking',
        metadata: {
          eventTitle: eventTitle,
          eventDate: eventDate,
          memberName: userName
        },
        actionUrl: 'club-events-management',
        actionParams: { clubId }
      });
      
      showSuccess('Réservation confirmée!');
    } catch (error) {
      showError(error.message);
    }
  };
}
```

### Dans `app/notifications.tsx`

```typescript
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationsScreen({ navigation, route }) {
  const { user } = useAuth();
  const userId = user?.uid;
  
  // CHANGE: Utiliser le vrai hook au lieu de initialNotifications
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications(userId);
  
  const handleNotifPress = (notification) => {
    // Marquer comme lu
    markAsRead(notification.id);
    
    // Naviguer au bon endroit
    if (notification.actionUrl && notification.actionParams) {
      navigation.navigate(notification.actionUrl, notification.actionParams);
    }
  };
  
  return (
    <ScrollView>
      {notifications.map(notif => (
        <TouchableOpacity 
          key={notif.id}
          onPress={() => handleNotifPress(notif)}
          style={{
            opacity: notif.isRead ? 0.5 : 1  // Grisé si lu
          }}
        >
          {/* Icône par type */}
          <Ionicons 
            name={getIconForType(notif.type)}
            size={24}
            color={getColorForType(notif.type)}
          />
          
          {/* Titre & message */}
          <Text style={!notif.isRead && { fontWeight: 'bold' }}>
            {notif.title}
          </Text>
          <Text style={{ opacity: 0.7 }}>
            {notif.message}
          </Text>
          
          {/* Timestamp */}
          <Text style={{ fontSize: 12, color: '#999' }}>
            {formatTime(notif.createdAt)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
```

---

**Prochaines étapes:** On commence l'implémentation! 🚀
