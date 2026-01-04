# 🧪 PLAN DE TEST - SCÉNARIOS DE VALIDATION

**Document:** Cas de test détaillés avec étapes exactes  
**Objectif:** Valider chaque flux de notification en production

---

## 📋 AVANT DE TESTER

### Prérequis
- [ ] Deux appareils mobiles (ou émulateurs)
- [ ] Accès à Firestore (pour vérifier les notifs créées)
- [ ] L'app compilée et en cours d'exécution
- [ ] Comptes test créés:
  - User1: `user1@test.com` (Propriétaire de chien)
  - User2: `user2@test.com` (Propriétaire de chien)
  - Club1: `club1@test.com` (Gestionnaire de club)
  - Educator1: `educator1@test.com` (Éducateur)

### Données test nécessaires
- 1 Club avec au moins 2 membres actifs
- 2-3 Événements dans le club
- Messages chat pré-configurés (optionnel)

---

## 🧪 SCÉNARIO 1: ADHÉSION AU CLUB (FLUX COMPLET)

**Durée:** 10-15 minutes  
**Devices:** 2 téléphones (User1 et Club1 manager)

### Test 1.1: User envoie demande d'adhésion

**Sur Téléphone 1 (User1):**

```
1. Connecter en tant que User1 (propriétaire de chien)
   Email: user1@test.com
   
2. Aller à: (tabs) > Home > Clubs > Recherche
   
3. Chercher et cliquer sur "Club1"
   → Affiche la page club-detail
   
4. Scroller bas et cliquer "Rejoindre le club"
   → Message "Demande d'adhésion envoyée!" apparaît
   
5. ✅ VÉRIFIER:
   - Message de succès visible
   - Bouton change d'état (disabled ou "En attente")
```

**Dans Firestore (Vérification):**

```
Aller à Firestore console:
notifications > {clubId} > items

Vérifier qu'il existe un document avec:
✅ type: "pending_member_request"
✅ title: "Nouvelle demande d'adhésion"
✅ message: "User1 demande à rejoindre le club"
✅ recipientId: "{clubId}"
✅ isRead: false
✅ senderId: "{user1Id}"
✅ senderName: "User1 Full Name"
```

---

### Test 1.2: Club reçoit la notif

**Sur Téléphone 2 (Club1 Manager):**

```
1. Connecter en tant que Club1 (manager)
   Email: club1@test.com
   
2. Aller à: Bottom Nav > Notifications
   
3. ✅ VÉRIFIER:
   - La notif de User1 est visible
   - Icône 🏢 (bleue)
   - Texte: "Nouvelle demande d'adhésion"
   - User1 name visible
   - Timestamp correct (il y a moins d'une minute)
   
4. Observer le badge BottomNav
   ✅ VÉRIFIER:
   - Badge rouge avec "1" sur l'icône notifications
   - Badge disparaît si on a 0 non-lues
```

---

### Test 1.3: Club approuve la demande

**Sur Téléphone 2:**

```
1. Cliquer sur la notif de User1
   → Navigue vers club-community-management
   
2. Voir la liste "Demandes en attente"
   → User1 est listé
   
3. Cliquer sur "APPROUVER" pour User1
   → Message "Adhésion approuvée!" apparaît
   
4. ✅ VÉRIFIER:
   - User1 disparaît de la liste
   - User1 apparaît dans "Membres"
```

**Dans Firestore:**

```
notifications > {user1Id} > items

Vérifier qu'il existe UN NOUVEAU document:
✅ type: "member_approved"
✅ title: "Bienvenue! 🎉"
✅ message: "Vous avez été accepté dans Club1"
✅ recipientId: "{user1Id}"
✅ isRead: false
✅ actionUrl: "club-detail"
✅ actionParams: { clubId: "{clubId}" }
```

---

### Test 1.4: User reçoit la réponse

**Sur Téléphone 1 (User1):**

```
1. Laisser l'écran notifications ouvert
   OU cliquer sur Notifications si pas ouvert
   
2. ✅ VÉRIFIER:
   - La notif "Bienvenue! 🎉" est visible
   - Icône ✅ (verte)
   - Message: "Vous avez été accepté..."
   - Timestamp correct
   
3. Cliquer sur la notif
   → Navigue vers club-detail du Club1
   
4. ✅ VÉRIFIER:
   - La notif est maintenant marquée comme lue (plus grisée)
   - La page club s'affiche correctement
   - Bouton "Rejoindre" a changé (ou disparu)
   - Peut maintenant voir les événements du club
```

---

### Test 1.5: Rejeter une demande

**Sur Téléphone 2 (Club1 Manager):**

```
1. Aller à Notifications
   
2. Créer une deuxième demande test:
   a. User2 va sur club-detail
   b. Clique "Rejoindre"
   c. Club1 reçoit la notif
   
3. Club1 clique "REJETER" pour User2
   → Message "Demande refusée" apparaît
```

**Vérifier:**

```
notifications > {user2Id} > items

Doit avoir:
✅ type: "member_rejected"
✅ title: "Demande refusée"
✅ message: "Votre demande d'adhésion a été refusée"
✅ isRead: false
```

**Sur Téléphone User2:**

```
Vérifier que la notif "Demande refusée" apparaît
Cliquer: doit aller au club-detail (voir pourquoi refusée?)
```

---

## 🧪 SCÉNARIO 2: RÉSERVATION D'ÉVÉNEMENT

**Durée:** 10-15 minutes  
**Devices:** 2 téléphones (User1 et Club1)

### Test 2.1: User réserve un événement

**Sur Téléphone 1 (User1):**

```
1. Aller à: Club1 (après adhésion ou directement)
   
2. Voir les événements disponibles
   Scroller pour voir "Réserver" sur un événement
   
3. Cliquer "Réserver" sur un événement
   → Ouvre event-booking page
   
4. Remplir le formulaire:
   - Nombre de places: 1
   - Notes: "Test réservation"
   
5. Cliquer "Confirmer la réservation"
   → Message "Réservation envoyée au club!" apparaît
   
6. ✅ VÉRIFIER:
   - Message de succès visible
```

**Dans Firestore:**

```
notifications > {clubId} > items

Vérifier nouveau document:
✅ type: "new_booking"
✅ title: "Nouvelle réservation"
✅ message: "User1 s'inscrit à {eventTitle}"
✅ recipientId: "{clubId}"
✅ recipientType: "club"
✅ relatedType: "booking"
✅ metadata.eventTitle: "Nom du cours"
✅ metadata.memberName: "User1"
```

---

### Test 2.2: Club reçoit et gère la réservation

**Sur Téléphone 2 (Club1):**

```
1. Aller à Notifications
   → Voir "Nouvelle réservation"
   
2. Cliquer sur la notif
   → Navigue à club-events-management
   
3. Voir la réservation de User1 en attente
   
4. Cliquer "ACCEPTER"
   → Message "Réservation confirmée!"
```

**Vérifier Firestore:**

```
notifications > {user1Id} > items

Nouveau document:
✅ type: "booking_confirmed"
✅ title: "Réservation confirmée! ✅"
✅ message: "Votre place est confirmée"
✅ recipientId: "{user1Id}"
```

---

### Test 2.3: User reçoit confirmation

**Sur Téléphone 1:**

```
1. Aller à Notifications
   
2. ✅ VÉRIFIER:
   - Notif "Réservation confirmée" visible
   - Icône ✅ (verte)
   
3. Cliquer sur la notif
   → Navigue à event-detail
   
4. ✅ VÉRIFIER:
   - Page affiche l'événement
   - Statut: "Confirmé" ou similaire
```

---

### Test 2.4: Club refuse la réservation

```
Répéter Test 2.1-2.2 avec une autre réservation
Mais à la step 2.2.4, cliquer "REFUSER"

Vérifier:
✅ type: "booking_rejected" dans notifications/{user1Id}
✅ User1 voit la notif "Réservation refusée"
```

---

## 🧪 SCÉNARIO 3: MESSAGES (CHAT)

**Durée:** 5-10 minutes  
**Devices:** 2 téléphones (User1 et User2)

### Test 3.1: Envoyer un message

**Sur Téléphone 1 (User1):**

```
1. Aller à: Messages ou Chat
   
2. Chercher User2 ou ouvrir conversation existante
   
3. Écrire un message: "Coucou, ça va? 👋"
   
4. Cliquer "Envoyer"
   → Message apparaît dans le chat
```

**Vérifier Firestore:**

```
notifications > {user2Id} > items

Vérifier:
✅ type: "message_received"
✅ title: "Message de User1"
✅ message: "Coucou, ça va? 👋" (ou preview)
✅ recipientId: "{user2Id}"
✅ senderId: "{user1Id}"
```

---

### Test 3.2: User2 reçoit la notif

**Sur Téléphone 2 (User2):**

```
1. Aller à Notifications
   
2. ✅ VÉRIFIER:
   - Notif "Message de User1" visible
   - Icône 💬 (bleue)
   - Preview du message visible
   
3. Cliquer sur la notif
   → Navigue vers chat-room avec User1
   
4. ✅ VÉRIFIER:
   - La conversation s'ouvre
   - On voit le message de User1
   - On peut répondre
```

---

### Test 3.3: Marquer comme lue

```
En restant sur la page chat:
1. Retourner à Notifications
   
2. ✅ VÉRIFIER:
   - La notif du message est maintenant grisée (lue)
   - Plus en gras
```

---

## 🧪 SCÉNARIO 4: NOUVEL ÉVÉNEMENT

**Durée:** 10 minutes  
**Devices:** 2 téléphones (Club1 et Member)

### Test 4.1: Club crée un événement

**Sur Téléphone 1 (Club1 Manager):**

```
1. Aller à: Dashboard > Gestion événements
   
2. Cliquer "Créer nouvel événement"
   
3. Remplir le formulaire:
   - Titre: "Stage Agility - Janvier"
   - Date: 15 janvier 2026
   - Durée: 2h
   - Niveau: Débutant
   
4. Cliquer "Créer l'événement"
   → Message "Événement créé et notifs envoyées!"
   
5. ✅ VÉRIFIER:
   - Événement apparaît dans la liste
```

---

### Test 4.2: Tous les members reçoivent la notif

**Vérifier Firestore:**

```
Pour chaque member du club, vérifier:
notifications > {memberId} > items

Doit avoir:
✅ type: "event_created"
✅ title: "Nouvel événement créé! 🎪"
✅ message: "Stage Agility - 15 janvier"
✅ recipientId: "{memberId}"
✅ metadata.eventTitle: "Stage Agility - Janvier"
✅ isRead: false
```

**Sur Téléphone 2 (Member):**

```
1. Aller à Notifications
   
2. ✅ VÉRIFIER:
   - Notif "Nouvel événement créé!" visible
   - Icône 🎪 (violette)
   - Titre et date du cours visibles
   - Pour CHAQUE member: sa propre notif
   
3. Cliquer sur la notif
   → Navigue vers event-detail
   
4. ✅ VÉRIFIER:
   - Voir les détails du cours
   - Pouvoir se réserver si désiré
```

---

## 🧪 SCÉNARIO 5: BADGES & COMPTEURS

**Durée:** 5 minutes

### Test 5.1: Badge BottomNav

**Sur n'importe quel téléphone:**

```
1. Vérifier que tu as des notifs non-lues
   (des notifs avec isRead: false)
   
2. Regarder le BottomNav
   ✅ VÉRIFIER:
   - Badge rouge sur l'icône "Notifications"
   - Nombre correct (ex: "3" pour 3 non-lues)
   
3. Ouvrir la page Notifications
   
4. Cliquer sur les notifs pour les marquer comme lues
   
5. ✅ VÉRIFIER:
   - Badge diminue
   - Quand tout est lu: badge disparaît
   
6. Fermer et rouvrir l'app
   ✅ VÉRIFIER:
   - Badge persiste correctement
```

---

### Test 5.2: Marquer tout comme lu

```
1. Avoir plusieurs notifs non-lues
   
2. Aller à Notifications
   
3. Cliquer sur le bouton "Marquer tout comme lu" (✓✓)
   
4. ✅ VÉRIFIER:
   - Toutes les notifs deviennent grisées
   - Badge disparaît du BottomNav
   - Dans Firestore: isRead: true pour toutes
```

---

## 🧪 SCÉNARIO 6: EDGE CASES & ERREURS

**Durée:** 5-10 minutes

### Test 6.1: Notification sans "actionUrl"

```
// Créer une notif manuellement sans actionUrl
notifications/{userId}/items/{notifId} = {
  type: 'test',
  title: 'Test',
  message: 'Test sans action',
  isRead: false,
  // ← PAS d'actionUrl
}

Vérifier:
1. La notif s'affiche toujours
2. Cliquer dessus la marque comme lue
3. Mais ne navigue nulle part (ou affiche un warning)
```

---

### Test 6.2: Créer notif sans senderId

```
// Créer une notif sans senderId
notifications/{userId}/items/{notifId} = {
  type: 'event_created',
  title: 'Nouvel événement',
  // ← PAS de senderId, senderName, senderAvatar
  isRead: false,
}

Vérifier:
1. La notif s'affiche
2. Pas de crash
3. Affiche juste le titre sans détails du sender
```

---

### Test 6.3: Données manquantes dans metadata

```
// Créer une notif sans certains metadata
notifications/{userId}/items/{notifId} = {
  type: 'booking_confirmed',
  title: 'Réservation confirmée',
  message: 'Votre place est confirmée',
  metadata: {
    // Vide ou partiellement vide
  },
  isRead: false,
}

Vérifier:
1. La notif s'affiche toujours
2. Pas de crash
3. Affiche gracefully les champs disponibles
```

---

### Test 6.4: Timestamp invalide

```
// Créer une notif avec Timestamp invalide
notifications/{userId}/items/{notifId} = {
  type: 'test',
  title: 'Test',
  createdAt: 'invalid-date',  // ← INVALIDE
  isRead: false,
}

Vérifier:
1. La notif s'affiche ou affiche "N/A" pour la date
2. Pas de crash
3. Formatage graceful
```

---

## 🧪 SCÉNARIO 7: PERFORMANCE & REAL-TIME

**Durée:** 5-10 minutes

### Test 7.1: Listener temps réel

```
Setup:
- Deux appareils ouverts sur Notifications
- Firestore ouvert en parallèle

1. Sur Firestore, ajouter manuellement une notif:
   db.collection('notifications').doc(userId)
     .collection('items').add({
       type: 'test',
       title: 'Test real-time',
       message: 'Cette notif a été créée directement',
       isRead: false,
       createdAt: new Date()
     })

2. ✅ VÉRIFIER:
   - Sur l'app: la notif apparaît IMMÉDIATEMENT (< 1 sec)
   - Sans refresh
   - Sans redémarrer l'app
   - Listener fonctionne ✅
```

---

### Test 7.2: Performance avec beaucoup de notifs

```
1. Créer 100+ notifs pour un user
   (Via script Firestore ou manuel)

2. Ouvrir la page Notifications
   ✅ VÉRIFIER:
   - Page charge rapidement (< 2 sec)
   - Scroll fluide
   - Pas de crash
   - Pas de lag

3. Scroller jusqu'au bas
   ✅ VÉRIFIER:
   - Toutes les notifs s'affichent
   - Pagination fonctionnelle (si implémentée)
```

---

## 📊 TABLEAU RÉSUMÉ DE VÉRIFICATION

| # | Flux | État | Notes |
|----|------|------|-------|
| 1.1 | Adhésion - User envoie | ✅/❌ | |
| 1.2 | Adhésion - Club reçoit | ✅/❌ | |
| 1.3 | Adhésion - Club approuve | ✅/❌ | |
| 1.4 | Adhésion - User reçoit | ✅/❌ | |
| 1.5 | Adhésion - Club rejette | ✅/❌ | |
| 2.1 | Réservation - User réserve | ✅/❌ | |
| 2.2 | Réservation - Club accepte | ✅/❌ | |
| 2.3 | Réservation - User reçoit | ✅/❌ | |
| 2.4 | Réservation - Club refuse | ✅/❌ | |
| 3.1 | Message - User envoie | ✅/❌ | |
| 3.2 | Message - User2 reçoit | ✅/❌ | |
| 3.3 | Message - Marquer comme lu | ✅/❌ | |
| 4.1 | Événement - Club crée | ✅/❌ | |
| 4.2 | Événement - Members reçoivent | ✅/❌ | |
| 5.1 | Badge BottomNav | ✅/❌ | |
| 5.2 | Marquer tout comme lu | ✅/❌ | |
| 6.1-6.4 | Edge cases | ✅/❌ | |
| 7.1 | Real-time listener | ✅/❌ | |
| 7.2 | Performance | ✅/❌ | |

---

## 🎯 RÉSULTAT ATTENDU

Tous les tests doivent passer (✅) avant de déclarer V1 complétée.

```
Si un test échoue (❌):
1. Noter l'étape exacte
2. Vérifier Firestore pour les données
3. Vérifier la console pour les erreurs
4. Fixer le code
5. Retester
```

---

**Bon testing! 🧪**
