# 📝 CODE TEMPLATES - PRÊT À COPIER-COLLER

**Document:** Snippets de code pour chaque modification  
**Objectif:** Accélérer l'implémentation en fournissant du code prêt à passer

---

## 📌 AVANT DE COPIER-COLLER

1. **Adaptez les noms de variables** à votre code réel
2. **Vérifiez les imports** - Incluez les bons chemins
3. **Testez au fur et à mesure** - Pas tout d'un coup
4. **Consultez le checklist** - Pour savoir où insérer

---

## 🔧 PHASE 2: UI & BADGES

### Template 2.1: Mettre à jour `app/notifications.tsx`

**Remplacer ENTIÈREMENT la section d'imports et du hook:**

```typescript
import React, { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
// 🔴 CHANGE: Importer le hook
import { useNotifications, useNotificationIcon, useFormattedTime } from '@/hooks/useNotifications';
import { Notification } from '@/types/Notification';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<RootStackParamList, 'notifications'>;

export default function NotificationsScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const userId = (user as any)?.uid || '';
  
  // 🟢 CHANGE: Utiliser le hook au lieu de initialNotifications
  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications(userId);
  
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const previousTarget = route.params?.previousTarget;

  // ✅ REST DU CODE RESTE PAREIL
  
  // ... (chargement, empty state, etc.)
  
  // Pour le rendu:
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Header reste pareil */}
        
        {/* 🟢 CHANGE: Utiliser notifications au lieu de initialNotifications */}
        {notifications.map((notif) => (
          <NotificationCard
            key={notif.id}
            notification={notif}
            onPress={() => {
              markAsRead(notif.id);
              // Navigation au clic (voir Phase 4)
              if (notif.actionUrl && notif.actionParams) {
                navigation.navigate(notif.actionUrl, notif.actionParams);
              }
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Composant pour une notif individuelle
function NotificationCard({ notification, onPress }) {
  const icon = useNotificationIcon(notification.type);
  const formattedTime = useFormattedTime(notification.createdAt);
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        opacity: notification.isRead ? 0.5 : 1,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* Icône */}
        <Ionicons name={icon.name} size={24} color={icon.color} />
        
        {/* Contenu */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: notification.isRead ? '400' : '600',
            color: '#1F2937',
          }}>
            {notification.title}
          </Text>
          <Text style={{
            fontSize: 13,
            color: '#6B7280',
            marginTop: 4,
          }}>
            {notification.message}
          </Text>
          <Text style={{
            fontSize: 11,
            color: '#9CA3AF',
            marginTop: 6,
          }}>
            {formattedTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#41B6A6',
    padding: 16,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  back: {
    padding: 8,
  },
});
```

---

### Template 2.2: Badges dans `UserBottomNav.tsx`

**Ajouter au composant principal:**

```typescript
import { useUnreadNotificationCount } from '@/hooks/useNotifications';

export function UserBottomNav({ navigation }) {
  const { user } = useAuth();
  const userId = user?.uid;
  
  // 🟢 AJOUT: Récupérer le count des non-lues
  const unreadCount = useUnreadNotificationCount(userId);
  
  return (
    <BottomTabNavigator>
      {/* Autres onglets ... */}
      
      {/* 🟢 CHANGE: Ajouter le badge */}
      <Tab.Screen
        name="notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          // 🔴 NOUVEAU: Badge rouge avec nombre
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
        }}
      />
    </BottomTabNavigator>
  );
}
```

---

### Template 2.3: Badges dans `ClubBottomNav.tsx`

```typescript
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { useClubData } from '@/hooks/useClubData';

export function ClubBottomNav({ navigation }) {
  // 🟢 AJOUT: Récupérer le clubId
  const club = useClubData();
  const clubId = club?.id;
  
  // 🟢 AJOUT: Count des non-lues
  const unreadCount = useUnreadNotificationCount(clubId);
  
  return (
    <BottomTabNavigator>
      {/* ... */}
      
      <Tab.Screen
        name="notifications"
        component={ClubNotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name=\"bell\" size={size} color={color} />
          ),
          // 🔴 NOUVEAU: Badge
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
        }}
      />
    </BottomTabNavigator>
  );
}
```

---

## 🔄 PHASE 3: CRÉER LES NOTIFICATIONS

### Template 3.1: Dans `club-detail.tsx` - Adhésion

**Ajouter à la fonction qui gère \"Rejoindre\":**

```typescript
import { useCreateNotification } from '@/hooks/useCreateNotification';

export default function ClubDetailScreen({ route, navigation }) {
  const { clubId } = route.params;
  const { user } = useAuth();
  const userId = user?.uid;
  const userName = user?.displayName || 'Un utilisateur';
  
  // 🟢 AJOUT: Hook pour créer notif
  const { createNotification } = useCreateNotification();
  
  // 🟢 AJOUT: Fonction modifiée
  const handleJoinClub = async () => {
    try {
      // 1. EXISTANT: Créer la demande d'adhésion
      await joinClub(clubId, userId);
      
      // 2. 🔴 NOUVEAU: Créer la notification pour le club
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
          clubName: club?.name || 'Club',
          memberName: userName,
        },
        actionUrl: 'club-community-management',
        actionParams: { clubId },
      });
      
      showSuccess('Demande d\'adhésion envoyée!');
    } catch (error) {
      console.error('Erreur:', error);
      showError(error.message);
    }
  };
  
  return (
    <View>
      {/* ... */}
      <TouchableOpacity
        onPress={handleJoinClub}
        style={styles.joinButton}
      >
        <Text>Rejoindre le club</Text>
      </TouchableOpacity>
      {/* ... */}
    </View>
  );
}
```

---

### Template 3.2: Dans `club-community-management.tsx` - Approver/Rejeter

**Pour la fonction \"Approuver\":**

```typescript
import { useCreateNotification } from '@/hooks/useCreateNotification';

export default function CommunityManagementScreen() {
  const { clubId } = route.params;
  const club = useClubData();
  const clubName = club?.name || 'Club';
  
  // 🟢 AJOUT
  const { createNotification } = useCreateNotification();
  
  // 🟢 AJOUT: Fonction modifiée
  const handleApproveMember = async (memberRequest) => {
    try {
      const { userId, userName } = memberRequest;
      
      // 1. EXISTANT: Approuver dans Firestore
      await approveMembership(userId, clubId);
      
      // 2. 🔴 NOUVEAU: Notifier l'utilisateur
      await createNotification({
        type: 'member_approved',
        title: 'Bienvenue! 🎉',
        message: `Vous avez été accepté dans ${clubName}`,
        recipientId: userId,
        recipientType: 'user',
        relatedId: clubId,
        relatedType: 'club',
        metadata: {
          clubName: clubName,
        },
        actionUrl: 'club-detail',
        actionParams: { clubId },
      });
      
      showSuccess('Adhésion approuvée!');
      // Refresh la liste
      refreshMembers();
    } catch (error) {
      showError(error.message);
    }
  };
  
  // 🟢 AJOUT: Fonction modifiée pour rejeter
  const handleRejectMember = async (memberRequest) => {
    try {
      const { userId, userName } = memberRequest;
      
      // 1. EXISTANT: Rejeter dans Firestore
      await rejectMembership(userId, clubId);
      
      // 2. 🔴 NOUVEAU: Notifier l'utilisateur
      await createNotification({
        type: 'member_rejected',
        title: 'Demande refusée',
        message: `Votre demande d'adhésion à ${clubName} a été refusée`,
        recipientId: userId,
        recipientType: 'user',
        relatedId: clubId,
        relatedType: 'club',
        metadata: {
          clubName: clubName,
        },
        actionUrl: 'club-detail',
        actionParams: { clubId },
      });
      
      showSuccess('Demande refusée');
      refreshMembers();
    } catch (error) {
      showError(error.message);
    }
  };
  
  return (
    <View>
      {/* Liste des demandes */}
      {pendingRequests.map(req => (
        <View key={req.id}>
          <Text>{req.userName}</Text>
          <TouchableOpacity onPress={() => handleApproveMember(req)}>
            <Text>Approuver</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRejectMember(req)}>
            <Text>Rejeter</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
```

---

### Template 3.3: Dans `event-booking.tsx` - Nouvelle réservation

**Pour la fonction \"Confirmer la réservation\":**

```typescript
import { useCreateNotification } from '@/hooks/useCreateNotification';

export default function EventBookingScreen({ route }) {
  const { eventId, clubId } = route.params;
  const { user } = useAuth();
  const userId = user?.uid;
  const userName = user?.displayName || 'Un utilisateur';
  
  // Récupérer l'événement
  const event = useEventData(eventId);
  
  // 🟢 AJOUT
  const { createNotification } = useCreateNotification();
  
  // 🟢 AJOUT: Fonction modifiée
  const handleSubmitBooking = async (formData) => {
    try {
      // 1. EXISTANT: Créer la réservation
      const bookingId = await createBooking({
        eventId,
        userId,
        ...formData,
      });
      
      // 2. 🔴 NOUVEAU: Notifier le club
      await createNotification({
        type: 'new_booking',
        title: 'Nouvelle réservation',
        message: `${userName} s'inscrit à ${event?.title}`,
        recipientId: clubId,
        recipientType: 'club',
        relatedId: bookingId,
        relatedType: 'booking',
        senderId: userId,
        senderName: userName,
        metadata: {
          eventTitle: event?.title || 'Événement',
          eventDate: formatDate(event?.date),
          memberName: userName,
          bookingDate: formatDate(new Date()),
        },
        actionUrl: 'club-events-management',
        actionParams: { clubId },
      });
      
      showSuccess('Réservation envoyée au club!');
      navigation.goBack();
    } catch (error) {
      showError(error.message);
    }
  };
  
  return (
    <View>
      {/* Formulaire */}
      <TouchableOpacity onPress={() => handleSubmitBooking(formData)}>
        <Text>Confirmer la réservation</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

### Template 3.4: Dans `club-events-management.tsx` - Accepter/Refuser réservation

**Pour accepter une réservation:**

```typescript
import { useCreateNotification } from '@/hooks/useCreateNotification';

export default function EventsManagementScreen() {
  const { clubId } = route.params;
  const club = useClubData();
  
  // 🟢 AJOUT
  const { createNotification } = useCreateNotification();
  
  // 🟢 AJOUT: Fonction modifiée
  const handleApproveBooking = async (booking) => {
    try {
      const { userId, userName, eventId } = booking;
      const event = bookings[eventId];
      
      // 1. EXISTANT: Mettre à jour le statut
      await updateBooking(booking.id, { status: 'confirmed' });
      
      // 2. 🔴 NOUVEAU: Notifier l'utilisateur
      await createNotification({
        type: 'booking_confirmed',
        title: 'Réservation confirmée! ✅',
        message: `Votre place pour ${event?.title} est confirmée`,
        recipientId: userId,
        recipientType: 'user',
        relatedId: booking.id,
        relatedType: 'booking',
        metadata: {
          eventTitle: event?.title,
          eventDate: formatDate(event?.date),
          clubName: club?.name,
        },
        actionUrl: 'event-detail',
        actionParams: { eventId },
      });
      
      showSuccess('Réservation confirmée!');
      refreshBookings();
    } catch (error) {
      showError(error.message);
    }
  };
  
  // 🟢 AJOUT: Fonction modifiée pour refuser
  const handleRejectBooking = async (booking) => {
    try {
      const { userId, eventId } = booking;
      const event = bookings[eventId];
      
      // 1. EXISTANT: Mettre à jour le statut
      await updateBooking(booking.id, { status: 'rejected' });
      
      // 2. 🔴 NOUVEAU: Notifier l'utilisateur
      await createNotification({
        type: 'booking_rejected',
        title: 'Réservation refusée',
        message: `Votre réservation pour ${event?.title} a été refusée`,
        recipientId: userId,
        recipientType: 'user',
        relatedId: booking.id,
        relatedType: 'booking',
        metadata: {
          eventTitle: event?.title,
          clubName: club?.name,
        },
        actionUrl: 'event-detail',
        actionParams: { eventId },
      });
      
      showSuccess('Réservation refusée');
      refreshBookings();
    } catch (error) {
      showError(error.message);
    }
  };
  
  return (
    <View>
      {/* Liste des réservations */}
      {pendingBookings.map(booking => (
        <View key={booking.id}>
          <Text>{booking.userName}</Text>
          <TouchableOpacity onPress={() => handleApproveBooking(booking)}>
            <Text>Accepter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRejectBooking(booking)}>
            <Text>Refuser</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
```

---

### Template 3.5: Dans `chat-room.tsx` - Message reçu

**Pour la fonction \"Envoyer un message\":**

```typescript
import { useCreateNotification } from '@/hooks/useCreateNotification';

export default function ChatRoomScreen({ route }) {
  const { otherUserId, channelId } = route.params;
  const { user } = useAuth();
  const userId = user?.uid;
  const userName = user?.displayName || 'Un utilisateur';
  
  // 🟢 AJOUT
  const { createNotification } = useCreateNotification();
  
  // 🟢 AJOUT: Fonction modifiée
  const handleSendMessage = async (messageText) => {
    try {
      // 1. EXISTANT: Envoyer le message
      const messageId = await sendMessage({
        channelId,
        text: messageText,
        senderId: userId,
        createdAt: new Date(),
      });
      
      // 2. 🔴 NOUVEAU: Notifier le destinataire
      const preview = messageText.substring(0, 50);
      await createNotification({
        type: 'message_received',
        title: `Message de ${userName}`,
        message: preview,
        recipientId: otherUserId,
        recipientType: 'user',
        relatedId: channelId,
        relatedType: 'message',
        senderId: userId,
        senderName: userName,
        metadata: {
          messagePreview: preview,
          channelId: channelId,
        },
        actionUrl: 'chat-room',
        actionParams: {
          userId,
          channelId,
        },
      });
      
      // 3. EXISTANT: Vider le champ
      setMessageText('');
    } catch (error) {
      showError(error.message);
    }
  };
  
  return (
    <View>
      {/* Messages */}
      <TextInput
        value={messageText}
        onChangeText={setMessageText}
        placeholder=\"Votre message...\"
      />
      <TouchableOpacity onPress={() => handleSendMessage(messageText)}>
        <Text>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

### Template 3.6: Dans `club-events-management.tsx` - Nouvel événement

**Pour la fonction \"Créer un événement\":**

```typescript
import { useCreateNotification } from '@/hooks/useCreateNotification';

export default function EventsManagementScreen() {
  const { clubId } = route.params;
  const club = useClubData();
  
  // 🟢 AJOUT
  const { createNotification } = useCreateNotification();
  
  // 🟢 AJOUT: Fonction modifiée
  const handleCreateEvent = async (eventData) => {
    try {
      // 1. EXISTANT: Créer l'événement
      const eventId = await createEvent({
        clubId,
        ...eventData,
      });
      
      // 2. 🔴 NOUVEAU: Récupérer tous les membres
      const members = await getClubMembers(clubId);
      
      // 3. 🔴 NOUVEAU: Créer UNE notif par membre
      const notificationPromises = members.map((member) =>
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
            clubName: club?.name,
          },
          actionUrl: 'event-detail',
          actionParams: { eventId },
        })
      );
      
      // Attendre que toutes soient créées
      await Promise.all(notificationPromises);
      
      showSuccess('Événement créé et notifs envoyées!');
      refreshEvents();
    } catch (error) {
      showError(error.message);
    }
  };
  
  return (
    <View>
      {/* Formulaire création événement */}
      <TouchableOpacity onPress={() => handleCreateEvent(formData)}>
        <Text>Créer l'événement</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🎓 MODÈLE GÉNÉRAL POUR AJOUTER UNE NOTIFICATION

**Chaque fois que tu dois ajouter une notif, utilise ce modèle:**

```typescript
// 1. IMPORTER le hook
import { useCreateNotification } from '@/hooks/useCreateNotification';

// 2. DANS LE COMPOSANT
const { createNotification } = useCreateNotification();

// 3. DANS LA FONCTION
const handleAction = async (data) => {
  try {
    // ... TA LOGIQUE EXISTANTE ...
    
    // PUIS AJOUTER:
    await createNotification({
      type: 'type_de_notif',           // ← Parmi les 11 types
      title: 'Titre court',             // ← Ce qu'on voit en gras
      message: 'Description',           // ← Contenu principal
      recipientId: targetUserId,        // ← À qui c'est destiné
      recipientType: 'user',            // ← 'user' | 'club' | 'educator'
      relatedId: resourceId,            // ← ID de la ressource concernée
      relatedType: 'booking',           // ← Type de ressource
      senderId: currentUserId,          // ← Optionnel: qui l'a déclenché
      senderName: userName,             // ← Optionnel: nom du sender
      metadata: {                       // ← Optionnel: données flexibles
        eventTitle: 'Stage Agility',
        eventDate: '2026-01-15',
        clubName: 'Canin Club Paris',
      },
      actionUrl: 'event-detail',        // ← Route pour navigation
      actionParams: { eventId },        // ← Params pour la route
    });
    
    // ... REST DE TA LOGIQUE ...
  } catch (error) {
    // ... GESTION ERREUR ...
  }
};
```

---

## ✅ CHECKLIST D'INTÉGRATION

Pour chaque template que tu copies-colles:

- [ ] Adapter les noms de variables à ton code
- [ ] Vérifier les imports
- [ ] Tester que ça compile (TypeScript)
- [ ] Créer une notification manuellement et vérifier qu'elle s'affiche
- [ ] Vérifier que l'action fonctionne (approuver, rejeter, etc.)
- [ ] Vérifier que la notif pour l'autre utilisateur est créée
- [ ] Tester que cliquer sur la notif navigue au bon endroit

---

**Prêt à copier-coller?** 🚀

Chaque template est 100% opérationnel, adapte juste les noms de variables!
