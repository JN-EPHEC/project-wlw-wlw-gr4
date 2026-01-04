# ✅ CHECKLIST DÉTAILLÉE - IMPLÉMENTATION NOTIFICATIONS V1

**Document:** Plan d'action exact pour chaque phase  
**Durée estimée:** 6-7 heures  
**Statut:** À commencer

---

## 📋 PHASE 1: PRÉPARATION ✅ COMPLÉTÉE

- [x] Analyser l'app complète
- [x] Identifier les flux
- [x] Vérifier l'infrastructure existante
- [x] Créer documents d'analyse

**Documents créés:**
- ✅ `NOTIFICATION_SYSTEM_ANALYSIS.md` - Analyse complète
- ✅ `NOTIFICATION_UI_FLOWS.md` - Visualisation des flux
- ✅ `NOTIFICATION_IMPLEMENTATION_CHECKLIST.md` - Ce document

---

## 🎯 PHASE 2: UI - AFFICHER LES VRAIES NOTIFICATIONS

**Durée:** 1-1.5 heures  
**Objectif:** Les notifications Firestore s'affichent dans la page

### 2.1 Mettre à jour `app/notifications.tsx`

**Fichier:** `/app/notifications.tsx`

**Problème actuel:**
```typescript
const initialNotifications = [
  { id: 1, type: 'rating', ... },  // ← MOCK DATA!
];
```

**Action à faire:**

- [ ] Importer `useNotifications` hook
  ```typescript
  import { useNotifications } from '@/hooks/useNotifications';
  ```

- [ ] Remplacer la logique mockée par le hook
  ```typescript
  export default function NotificationsScreen({ navigation, route }: Props) {
    const { user } = useAuth();
    const userId = (user as any)?.uid || '';
    
    // CHANGE: Utiliser le hook
    const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications(userId);
    
    // Rest de la logique reste pareil
  }
  ```

- [ ] Supprimer `initialNotifications` const

- [ ] Vérifier que le rendu fonctionne avec vraies données

- [ ] Tester:
  - [ ] Page chargement → vide → notifications
  - [ ] Icônes correctes par type
  - [ ] Couleurs correctes

### 2.2 Ajouter badges non-lues dans BottomNav

**Fichier 1:** `/components/UserBottomNav.tsx`

- [ ] Importer `useUnreadNotificationCount`
  ```typescript
  import { useUnreadNotificationCount } from '@/hooks/useNotifications';
  ```

- [ ] Dans le composant, récupérer le count
  ```typescript
  const userId = useAuth().user?.uid;
  const unreadCount = useUnreadNotificationCount(userId);
  ```

- [ ] Ajouter badge à l'onglet notifications
  ```typescript
  <Tab.Screen
    name="notifications"
    component={NotificationsScreen}
    options={{
      tabBarBadge: unreadCount > 0 ? unreadCount : null,
      // ou avec styling personnalisé
    }}
  />
  ```

- [ ] Tester:
  - [ ] Badge affiche "0" quand pas de notif
  - [ ] Badge affiche le nombre correct
  - [ ] Badge disparaît quand tout est marqué comme lu

**Fichier 2:** `/components/ClubBottomNav.tsx`

- [ ] Répéter les mêmes étapes mais avec `clubId` au lieu de `userId`
  ```typescript
  const club = useClubData(); // ou récupérer clubId
  const unreadCount = useUnreadNotificationCount(clubId);
  ```

**Fichier 3:** `/components/TeacherBottomNav.tsx`

- [ ] Idem avec `educatorId`

### ✅ Résultat attendu après Phase 2:

```
✅ Page notifications affiche les vraies notifs Firestore
✅ Marquer comme lu fonctionne
✅ Badge rouge avec nombre non-lues dans BottomNav
✅ Les notifs apparaissent en temps réel (listener actif)
```

**Tests à faire:**
- [ ] Créer manuellement une notif Firestore
  ```typescript
  // Via console Firebase
  db.collection('notifications').doc(userId).collection('items').add({
    type: 'pending_member_request',
    title: 'Test',
    message: 'Test notif',
    recipientId: userId,
    recipientType: 'user',
    isRead: false,
    createdAt: new Date(),
    actionUrl: 'club-detail'
  });
  ```
- [ ] Ouvrir l'app → Voir la notif apparaître
- [ ] Cliquer → Marquer comme lu
- [ ] Badge diminue

---

## 🔄 PHASE 3: CRÉER LES NOTIFICATIONS DANS LES ÉVÉNEMENTS

**Durée:** 3-4 heures  
**Objectif:** Les notifications se créent réellement quand les actions se produisent

### 3.1 FLUX: Adhésion au club

**3.1.1 Créer notif quand USER clique "Rejoindre"**

**Fichier:** `/app/club-detail.tsx`

**Contexte:** Quand l'utilisateur clique sur le bouton "Rejoindre le club"

- [ ] Trouver la fonction `handleJoinClub` (ou équivalent)

- [ ] Ajouter l'appel `createNotification`:
  ```typescript
  import { useCreateNotification } from '@/hooks/useCreateNotification';
  
  const { createNotification } = useCreateNotification();
  
  const handleJoinClub = async () => {
    try {
      // 1. Créer la demande d'adhésion dans Firestore
      await joinClub(clubId, userId);
      
      // 2. NOUVEAU: Notifier le club
      await createNotification({
        type: 'pending_member_request',
        title: 'Nouvelle demande d\'adhésion',
        message: `${userName} demande à rejoindre le club`,
        recipientId: clubId,
        recipientType: 'club',
        relatedId: clubId,
        relatedType: 'club',
        senderId: userId,
        senderName: userName,
        metadata: {
          clubName: clubName,
          memberName: userName
        },
        actionUrl: 'club-community-management',
        actionParams: { clubId }
      });
      
      showSuccess('Demande envoyée!');
    } catch (error) {
      showError(error.message);
    }
  };
  ```

- [ ] Tester:
  - [ ] User clique "Rejoindre"
  - [ ] Va dans Firestore → notifications/{clubId}/items
  - [ ] Vérifier la notif est créée correctement

---

**3.1.2 Créer notif quand CLUB approuve/rejette**

**Fichier:** `/app/club-community-management.tsx`

**Contexte:** Quand le club gestionnaire clique "Approuver" ou "Rejeter" une demande

- [ ] Trouver la fonction `handleApproveMember` (ou équivalent)

- [ ] Ajouter appel `createNotification` pour APPROBATION:
  ```typescript
  const handleApproveMember = async (memberRequest) => {
    try {
      const { userId, userName } = memberRequest;
      
      // 1. Approuver dans Firestore
      await approveMembership(userId, clubId);
      
      // 2. NOUVEAU: Notifier l'utilisateur
      await createNotification({
        type: 'member_approved',
        title: 'Bienvenue! 🎉',
        message: `Vous avez été accepté dans ${clubName}`,
        recipientId: userId,
        recipientType: 'user',
        relatedId: clubId,
        relatedType: 'club',
        metadata: {
          clubName: clubName
        },
        actionUrl: 'club-detail',
        actionParams: { clubId }
      });
      
      showSuccess('Adhésion approuvée!');
    } catch (error) {
      showError(error.message);
    }
  };
  ```

- [ ] Ajouter appel pour REJET:
  ```typescript
  const handleRejectMember = async (memberRequest) => {
    try {
      const { userId, userName } = memberRequest;
      
      // 1. Rejeter dans Firestore
      await rejectMembership(userId, clubId);
      
      // 2. NOUVEAU: Notifier l'utilisateur
      await createNotification({
        type: 'member_rejected',
        title: 'Demande refusée',
        message: `Votre demande d'adhésion à ${clubName} a été refusée`,
        recipientId: userId,
        recipientType: 'user',
        relatedId: clubId,
        relatedType: 'club',
        metadata: {
          clubName: clubName
        },
        actionUrl: 'club-detail',
        actionParams: { clubId }
      });
      
      showSuccess('Demande refusée');
    } catch (error) {
      showError(error.message);
    }
  };
  ```

- [ ] Tester:
  - [ ] Club approuve → User reçoit notif `member_approved`
  - [ ] Club rejette → User reçoit notif `member_rejected`

### ✅ Résultat après 3.1:

```
✅ User peut rejoindre un club
✅ Club reçoit notif de demande
✅ Club peut approuver/rejeter
✅ User reçoit réponse en notif
✅ Les 4 notifs s'affichent correctement
```

---

### 3.2 FLUX: Réservation d'événement

**3.2.1 Créer notif quand USER réserve**

**Fichier:** `/app/event-booking.tsx`

**Contexte:** Quand l'utilisateur clique "Confirmer la réservation"

- [ ] Trouver la fonction `handleSubmitBooking` (ou équivalent)

- [ ] Ajouter appel `createNotification`:
  ```typescript
  const handleSubmitBooking = async (formData) => {
    try {
      // 1. Créer la réservation
      const bookingId = await createBooking(formData);
      
      // 2. NOUVEAU: Notifier le club
      await createNotification({
        type: 'new_booking',
        title: 'Nouvelle réservation',
        message: `${userName} s'inscrit à ${eventTitle}`,
        recipientId: clubId,
        recipientType: 'club',
        relatedId: bookingId,
        relatedType: 'booking',
        senderId: userId,
        senderName: userName,
        metadata: {
          eventTitle: eventTitle,
          eventDate: formatDate(eventDate),
          memberName: userName,
          bookingDate: formatDate(new Date())
        },
        actionUrl: 'club-events-management',
        actionParams: { clubId }
      });
      
      showSuccess('Réservation envoyée au club!');
      navigation.goBack();
    } catch (error) {
      showError(error.message);
    }
  };
  ```

- [ ] Tester:
  - [ ] User remplit form et clique "Confirmer"
  - [ ] Club reçoit notif `new_booking`

---

**3.2.2 Créer notif quand CLUB accepte/refuse**

**Fichier:** `/app/club-events-management.tsx`

**Contexte:** Quand le club gère les réservations (accepte/refuse)

- [ ] Trouver la fonction `handleApproveBooking` (ou équivalent)

- [ ] Ajouter appel pour ACCEPTATION:
  ```typescript
  const handleApproveBooking = async (booking) => {
    try {
      const { userId, eventTitle, eventDate } = booking;
      
      // 1. Approuver dans Firestore
      await updateBooking(booking.id, { status: 'confirmed' });
      
      // 2. NOUVEAU: Notifier l'utilisateur
      await createNotification({
        type: 'booking_confirmed',
        title: 'Réservation confirmée! ✅',
        message: `Votre place pour ${eventTitle} est confirmée`,
        recipientId: userId,
        recipientType: 'user',
        relatedId: booking.id,
        relatedType: 'booking',
        metadata: {
          eventTitle: eventTitle,
          eventDate: formatDate(eventDate),
          clubName: clubName
        },
        actionUrl: 'event-detail',
        actionParams: { eventId: booking.eventId }
      });
      
      showSuccess('Réservation confirmée!');
    } catch (error) {
      showError(error.message);
    }
  };
  ```

- [ ] Ajouter appel pour REFUS:
  ```typescript
  const handleRejectBooking = async (booking) => {
    try {
      const { userId, eventTitle } = booking;
      
      // 1. Refuser dans Firestore
      await updateBooking(booking.id, { status: 'rejected' });
      
      // 2. NOUVEAU: Notifier l'utilisateur
      await createNotification({
        type: 'booking_rejected',
        title: 'Réservation refusée',
        message: `Votre réservation pour ${eventTitle} a été refusée`,
        recipientId: userId,
        recipientType: 'user',
        relatedId: booking.id,
        relatedType: 'booking',
        metadata: {
          eventTitle: eventTitle,
          clubName: clubName
        },
        actionUrl: 'event-detail',
        actionParams: { eventId: booking.eventId }
      });
      
      showSuccess('Réservation refusée');
    } catch (error) {
      showError(error.message);
    }
  };
  ```

- [ ] Tester:
  - [ ] Club accepte → User reçoit `booking_confirmed`
  - [ ] Club refuse → User reçoit `booking_rejected`

### ✅ Résultat après 3.2:

```
✅ User peut réserver un événement
✅ Club reçoit notif de nouvelle réservation
✅ Club peut accepter/refuser
✅ User reçoit réponse en notif
✅ Les 3 notifs s'affichent correctement
```

---

### 3.3 FLUX: Messages (Chat)

**Fichier:** `/app/chat-room.tsx`

**Contexte:** Quand l'utilisateur envoie un message

- [ ] Trouver la fonction `handleSendMessage` (ou équivalent)

- [ ] Ajouter appel `createNotification`:
  ```typescript
  const handleSendMessage = async (messageText) => {
    try {
      // 1. Envoyer le message
      await sendMessage({
        channelId,
        text: messageText,
        senderId: userId,
        createdAt: new Date()
      });
      
      // 2. NOUVEAU: Notifier le destinataire
      // (Pour chat direct, le destinataire est l'autre user)
      await createNotification({
        type: 'message_received',
        title: `Message de ${senderName}`,
        message: messageText,  // Ou preview si trop long
        recipientId: otherUserId,
        recipientType: 'user',
        relatedId: channelId,
        relatedType: 'message',
        senderId: userId,
        senderName: senderName,
        metadata: {
          messagePreview: messageText.substring(0, 50),
          channelId: channelId
        },
        actionUrl: 'chat-room',
        actionParams: { 
          channelId: channelId,
          userId: userId
        }
      });
      
      // Vider le champ texte
      clearMessageInput();
    } catch (error) {
      showError(error.message);
    }
  };
  ```

- [ ] Tester:
  - [ ] User A envoie message à User B
  - [ ] User B reçoit notif `message_received`
  - [ ] Cliquer sur notif ouvre la conversation

### ✅ Résultat après 3.3:

```
✅ User peut envoyer messages
✅ Destinataire reçoit notif `message_received`
✅ Cliquer sur notif ouvre le chat
```

---

### 3.4 FLUX: Nouvel événement créé

**Fichier:** `/app/club-events-management.tsx`

**Contexte:** Quand le club crée un nouvel événement

- [ ] Trouver la fonction `handleCreateEvent` (ou équivalent)

- [ ] Ajouter appel `createNotification` pour TOUS les membres:
  ```typescript
  const handleCreateEvent = async (eventData) => {
    try {
      // 1. Créer l'événement
      const eventId = await createEvent(eventData);
      
      // 2. NOUVEAU: Récupérer tous les membres du club
      const members = await getClubMembers(clubId);
      
      // 3. Créer UNE notif par membre
      const notificationPromises = members.map(member => 
        createNotification({
          type: 'event_created',
          title: 'Nouvel événement créé! 🎪',
          message: `${eventData.title} - ${formatDate(eventData.date)}`,
          recipientId: member.userId,
          recipientType: 'user',
          relatedId: eventId,
          relatedType: 'event',
          metadata: {
            eventTitle: eventData.title,
            eventDate: formatDate(eventData.date),
            clubName: clubName
          },
          actionUrl: 'event-detail',
          actionParams: { eventId: eventId }
        })
      );
      
      // Attendre que toutes les notifs soient créées
      await Promise.all(notificationPromises);
      
      showSuccess('Événement créé et notifs envoyées!');
    } catch (error) {
      showError(error.message);
    }
  };
  ```

- [ ] Tester:
  - [ ] Club crée événement
  - [ ] Tous les members reçoivent notif `event_created`

### ✅ Résultat après 3.4:

```
✅ Club peut créer événements
✅ Tous les membres reçoivent notif `event_created`
✅ Cliquer sur notif affiche l'événement
```

---

## 📍 PHASE 4: NAVIGATION AU CLIC

**Durée:** 1 heure  
**Objectif:** Cliquer sur une notif redirige au bon endroit

### 4.1 Implémenter la navigation dans `notifications.tsx`

**Fichier:** `/app/notifications.tsx`

- [ ] Trouver la fonction `handleNotificationPress` (ou équivalent)

- [ ] Implémenter la navigation:
  ```typescript
  const handleNotificationPress = (notification: Notification) => {
    // 1. Marquer comme lu
    markAsRead(notification.id);
    
    // 2. Naviguer selon actionUrl + actionParams
    if (notification.actionUrl && notification.actionParams) {
      navigation.navigate(notification.actionUrl, notification.actionParams);
    } else {
      console.warn('Notification sans actionUrl:', notification);
    }
  };
  ```

- [ ] S'assurer que chaque TouchableOpacity appelle cette fonction:
  ```typescript
  <TouchableOpacity onPress={() => handleNotificationPress(notif)}>
    {/* Contenu notif */}
  </TouchableOpacity>
  ```

- [ ] Tester chaque type de notif:
  - [ ] Cliquer `pending_member_request` → `club-community-management`
  - [ ] Cliquer `member_approved` → `club-detail`
  - [ ] Cliquer `new_booking` → `club-events-management`
  - [ ] Cliquer `booking_confirmed` → `event-detail`
  - [ ] Cliquer `message_received` → `chat-room`
  - [ ] Cliquer `event_created` → `event-detail`

### ✅ Résultat après Phase 4:

```
✅ Cliquer sur notif navigue au bon endroit
✅ Les params sont correctement passés
✅ La page s'affiche avec les bonnes données
✅ Notif marquée comme lue au clic
```

---

## 🚀 PHASE 5: OPTIMISATIONS

**Durée:** 1 heure  
**Objectif:** Performance et polish final

### 5.1 Optimiser les requêtes Firestore

- [ ] Vérifier que les listeners sont bien supprimés au unmount
  ```typescript
  useEffect(() => {
    const unsubscribe = onSnapshot(...);
    return () => unsubscribe();  // ← Important!
  }, [userId]);
  ```

- [ ] Limiter la taille des documents notif (pas de gros metadata)

### 5.2 Archiver les notifs

- [ ] Ajouter une Cloud Function (futur) ou script pour archiver notifs > 30 jours
  ```typescript
  // À ajouter plus tard
  // Pour V1: Pas obligatoire
  ```

### 5.3 Tests finaux complets

- [ ] Scénario 1: User rejoint club
  - [ ] User voit "Demande envoyée"
  - [ ] Club reçoit notif
  - [ ] Club approuve → User reçoit notif
  - [ ] User clique → Va au club

- [ ] Scénario 2: User réserve événement
  - [ ] User remplit form et clique "Confirmer"
  - [ ] Club reçoit notif
  - [ ] Club accepte → User reçoit notif
  - [ ] User clique → Va à l'événement

- [ ] Scénario 3: Chat
  - [ ] User A envoie message
  - [ ] User B reçoit notif
  - [ ] User B clique → Voir conversation

- [ ] Scénario 4: Nouvel événement
  - [ ] Club crée événement
  - [ ] Tous les members reçoivent notif
  - [ ] Member clique → Voir événement

### ✅ Résultat après Phase 5:

```
✅ Tous les flux fonctionnent
✅ Performance optimale
✅ Pas de fuite mémoire
✅ App prête pour la production V1
```

---

## 📊 RÉSUMÉ FINAL

### Checklist complète

| Phase | Tâche | Durée | État |
|-------|-------|-------|------|
| 1 | Analyse | 2h | ✅ |
| 2.1 | UI notifications | 0.5h | ⬜ |
| 2.2 | Badges BottomNav | 0.5h | ⬜ |
| 3.1 | Flux adhésion | 0.5h | ⬜ |
| 3.2 | Flux réservation | 0.75h | ⬜ |
| 3.3 | Flux messages | 0.5h | ⬜ |
| 3.4 | Flux événement | 0.75h | ⬜ |
| 4 | Navigation | 1h | ⬜ |
| 5 | Optimisations | 1h | ⬜ |
| **TOTAL** | | **8h** | |

---

## 🎯 À FAIRE AVANT DE COMMENCER

- [ ] Confirmer les 6 questions dans le document d'analyse
- [ ] Préparer un accès à Firestore pour tester
- [ ] Vérifier les noms de fonctions exacts dans les fichiers
- [ ] Clarifier la gestion du `clubId` pour les clubs (comment on l'obtient?)

---

**Prêt à démarrer Phase 2?** 🚀
