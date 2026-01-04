# ❓ QUESTIONS CLÉS & DÉCISIONS REQUISES

**Document:** Questions pour clarifier avant l'implémentation  
**Priorité:** ÉLEVÉE - Ces réponses orienteront l'implémentation

---

## 🎯 SECTION 1: RÔLES & INTERFACES

### Question 1.1: Notifications pour les EDUCATORS?

**Actuellement:** Pas clair si les educateurs reçoivent des notifications

**Options:**

**Option A:** Educateurs reçoivent AUCUNE notif pour V1
```
Raison: Simplifier et se concentrer sur users/clubs
Conséquence: Pas besoin d'ajouter notif aux Teachers
```

**Option B:** Educateurs reçoivent notifs comme les users
```
Quelles notifs?
- Message reçu (de users/clubs)
- Événement créé (des clubs où ils travaillent)
- Nouvelle réservation (si c'est un cours d'un educator)
```

**Option C:** Educateurs reçoivent notifs spéciales
```
À définir selon tes besoins spécifiques
```

**🔴 Ta réponse:** ________________

---

### Question 1.2: Utiliser la même page `/notifications.tsx` pour tous?

**Actuellement:** `app/notifications.tsx` est utilisée par users ET clubs (même page)

**Options:**

**Option A:** Garder UNE page unique
```typescript
// Déterminer le rôle de l'utilisateur
const role = getUserRole(user); // 'user' | 'club' | 'educator'

// Récupérer les notifs du bon destinataire
if (role === 'user') {
  notifications = useNotifications(userId);
} else if (role === 'club') {
  notifications = useNotifications(clubId);
}

// L'affichage est identique pour tous
```

**Avantage:** Moins de code à maintenir  
**Inconvénient:** Pas flexible pour UI différente par rôle

**Option B:** Créer des pages séparées
```
/app/user-notifications.tsx   (pour users)
/app/club-notifications.tsx   (pour clubs)
/app/educator-notifications.tsx (pour educators)

Chacune peut avoir son propre design/fonctionnalité
```

**Avantage:** Plus flexible  
**Inconvénient:** Plus de code à dupliquer

**🔴 Ta réponse:** ________________

---

## 🔔 SECTION 2: TYPES DE NOTIFICATIONS

### Question 2.1: Autres types à ajouter?

**Types actuels (11):**
- pending_member_request
- member_approved
- member_rejected
- booking_confirmed
- booking_rejected
- new_booking
- message_received
- event_created
- event_reminder ⚠️
- review_requested ⚠️
- review_received ⚠️

**Besoin d'autres?**

**Exemples possibles:**
- `payment_received` - Paiement reçu
- `payment_pending` - Paiement en attente
- `comment_on_post` - Quelqu'un a commenté
- `announcement` - Nouvelle annonce
- `educator_joined` - Educator a rejoint un club
- `educator_left` - Educator a quitté un club

**🔴 Ta réponse:** ________________

---

### Question 2.2: Implémenter `event_reminder`?

**Contexte:** Rappeler les utilisateurs avant un événement (ex: 24h avant)

**Options:**

**Option A:** Oui, créer une Cloud Function
```
Cloud Function trigger: 24h avant l'événement
→ Créer notif `event_reminder` pour tous les réservés
Effort: 2-3h
```

**Option B:** Non pour V1
```
Raison: Focus sur les flux d'action (adhésion, réservation)
Futur: Ajouter dans V2 avec Cloud Functions
```

**🔴 Ta réponse:** ________________

---

### Question 2.3: Implémenter demande d'avis (review_requested)?

**Contexte:** Demander à l'utilisateur de noter après un événement

**Déclencheur:** 
- Après la fin d'un événement?
- Manuel (admin clique un bouton)?
- Cloud Function timer?

**Options:**

**Option A:** Oui, ajouter maintenant
```
Manuel: Club peut envoyer demande d'avis via bouton
Effort: 1-2h
```

**Option B:** Non pour V1
```
Raison: Peut être ajouté via Cloud Function plus tard
```

**🔴 Ta réponse:** ________________

---

## 💬 SECTION 3: MESSAGES & CHAT

### Question 3.1: Notif pour CHAQUE message?

**Contexte:** User A envoie message à User B

**Problème:** Si User B a 10 messages de User A, il reçoit 10 notifs 🚨

**Options:**

**Option A:** Oui, une notif par message
```
Avantage: L'utilisateur est immédiatement averti
Inconvénient: Peut être spammé si User A envoie plusieurs messages d'affilée
```

**Option B:** Non, grouper les messages d'un même expéditeur
```
Exemple: 
  Au lieu de 3 notifs: "Message 1", "Message 2", "Message 3"
  → 1 seule notif: "3 messages de Victor"
Effort: +0.5h pour l'implémentation
```

**Option C:** Notifier seulement si le chat n'est pas ouvert
```
Si User B a le chat ouvert et reçoit un message
→ Pas de notif (il le voit déjà)

Si le chat est fermé
→ Créer la notif
Effort: +1h (gérer l'état du chat actif)
```

**🔴 Ta réponse:** ________________

---

### Question 3.2: Messages depuis les CLUBS?

**Contexte:** Peut-on envoyer des messages à une PERSONNE depuis un CLUB?

**Exemple:** "Bonjour Victor, ton paiement a été reçu" (du club)

**Si OUI:**
- Comment différencier dans l'UI? (Icône "Club" au lieu de "User"?)
- Aller vers `chat-room` ou vers `club-detail`?

**🔴 Ta réponse:** ________________

---

## 👥 SECTION 4: NOTIFICATIONS POUR LES CLUBS

### Question 4.1: Club reçoit notif de SES PROPRES ACTIONS?

**Contexte:** Quand le club approuve une adhésion, doit-il la voir en notif aussi?

**Exemple:**
```
Club approuve Victor
→ Victor reçoit notif "Bienvenue"
→ Club reçoit AUSSI notif "Vous avez approuvé Victor"? 
```

**Options:**

**Option A:** Oui, toujours créer deux notifs
```
Une pour l'utilisateur affecté
Une pour le club (pour audit/historique)
```

**Option B:** Non, juste pour l'utilisateur affecté
```
Club voit l'update directement dans ses pages de gestion
Pas besoin de notif
```

**🔴 Ta réponse:** ________________

---

### Question 4.2: Comment récupérer les notifications du CLUB?

**Problème technique:** Pour afficher les notifs d'un club, on a besoin du `clubId`

**Où le trouver?**

**Option A:** Via `useAuth()` - Ajouter clubId au context
```typescript
const { user, clubId } = useAuth();
// Puis récupérer:
const notifs = useNotifications(clubId);
```

**Option B:** Via `useClubData()` - Hook qui récupère le club courant
```typescript
const club = useClubData();
const notifs = useNotifications(club.id);
```

**Option C:** Via route params
```
Chaque page club reçoit clubId en params
page.tsx route: /club/{clubId}/notifications
```

**🔴 Ta réponse:** ________________

---

## 🔐 SECTION 5: SÉCURITÉ & PERMISSIONS

### Question 5.1: Peut-on lire les notifs d'AUTRES utilisateurs?

**Contexte:** Firestore rules pour notifications

**Actuellement:** Pas de règles définies (ou defaults Firebase)

**À décider:** Qui peut lire/modifier une notification?

**Option A:** Strict - Seulement le destinataire
```typescript
rules {
  notifications/{recipientId}/items/{notifId} {
    allow read: if request.auth.uid == recipientId;
    allow write: if false; // Jamais modifier depuis client
  }
}
```

**Option B:** Cloud Functions - Seulement les fonctions peuvent créer
```typescript
// Les notifications sont CRÉÉES par Cloud Functions
// Les utilisateurs ne font que lire les leurs
```

**Quelle approche préfères-tu?**

**🔴 Ta réponse:** ________________

---

## ⏰ SECTION 6: RÉTENTION DES DONNÉES

### Question 6.1: Combien de temps garder les notifs?

**Actuellement:** Stockage infini (nettoyage jamais fait)

**Options:**

**Option A:** 30 jours
```
Archiver/supprimer automatiquement après 30 jours
Raison: Pas d'intérêt après 1 mois
Effort: Cloud Function pour nettoyer
```

**Option B:** 90 jours
```
Plus long = plus d'espace disque mais meilleur historique
```

**Option C:** Infini
```
Garder tout pour l'historique/analyse
Raison: Données peu volumineuses
Conséquence: DB peut devenir grande
```

**🔴 Ta réponse:** ________________

---

### Question 6.2: Permet-on la suppression manuelle?

**Contexte:** L'utilisateur peut-il supprimer une notif?

**Options:**

**Option A:** Oui, via bouton "Supprimer" (bouton ...)
```
User peut supprimer sa notif
Notif disparaît de sa liste
```

**Option B:** Non
```
Juste marquer comme "lu"
Suppression automatique après X jours
```

**🔴 Ta réponse:** ________________

---

## 🔊 SECTION 7: NOTIFICATIONS PUSH (FUTUR)

### Question 7.1: Pour V2 ou plus tard?

**Contexte:** Notifications push sur le téléphone

**Pour V1:** Tu as dit "pas besoin de notif téléphone" ✅

**Confirmer:** On ignore complètement les push notifications pour V1?
```
✅ Oui, juste des notifs dans l'app
```

**Pour V2:** Voudras-tu ajouter?
- [ ] Notifications push (Expo Notifications)
- [ ] Badges red sur l'icône app
- [ ] Son de notification
- [ ] Vibration

**🔴 Ta réponse pour V2:** ________________

---

## 📊 SECTION 8: ANALYTICS & TRACKING

### Question 8.1: Envoyer des events analytics?

**Contexte:** Tracker les actions des utilisateurs

**Options:**

**Option A:** Tracker certains événements
```typescript
// Quand une notif est créée:
analytics.logEvent('notification_created', {
  type: 'pending_member_request',
  recipientType: 'club'
});

// Quand une notif est lue:
analytics.logEvent('notification_read', {
  type: 'pending_member_request',
  delayMs: 1800 // Combien de temps avant de lire
});
```

**Option B:** Pas d'analytics pour V1
```
Ajouter dans V2
```

**🔴 Ta réponse:** ________________

---

## 📱 RÉSUMÉ DES RÉPONSES REQUISES

| # | Question | Réponse | Impact |
|---|----------|---------|--------|
| 1.1 | Notifs educators? | _____ | Rôle educators |
| 1.2 | 1 page ou 3 pages? | _____ | Architecture UI |
| 2.1 | Autres types? | _____ | Types à ajouter |
| 2.2 | event_reminder? | _____ | Cloud Functions |
| 2.3 | review_requested? | _____ | Demande d'avis |
| 3.1 | 1 notif/message? | _____ | Grouper messages? |
| 3.2 | Messages clubs? | _____ | Chat architecture |
| 4.1 | Notif club ses actions? | _____ | Duplication notifs |
| 4.2 | Récupérer clubId? | _____ | Context vs Hook |
| 5.1 | Firestore rules? | _____ | Sécurité |
| 6.1 | Rétention? | _____ | 30/90/∞ jours |
| 6.2 | Suppression manuelle? | _____ | UX |
| 7.1 | V2 push notifications? | _____ | Futur |
| 8.1 | Analytics? | _____ | Tracking |

---

## 🎯 PROCHAINES ÉTAPES

### Étape 1: Répondre à ces questions ⬅️ TU ES ICI
**Temps:** 10-15 minutes

### Étape 2: Confirmer les réponses avec toi
**Temps:** 5 minutes

### Étape 3: Mettre à jour les documents
**Temps:** 5 minutes

### Étape 4: Commencer Phase 2 (UI)
**Temps:** 1-2 heures

---

## 💡 SUGGESTIONS POUR LES RÉPONSES

**Si tu n'es pas sûr(e), voici mes recommandations:**

```
1.1 → Option B: Educators reçoivent notifs comme les users
1.2 → Option A: Garder une page unique adaptée au rôle
2.1 → Commencer avec les 11 types actuels
2.2 → Non pour V1 (ajouter en V2 avec Cloud Functions)
2.3 → Non pour V1 (idem)
3.1 → Option C: Notifier seulement si chat pas ouvert (meilleur UX)
3.2 → Non pour V1 (simplifier d'abord)
4.1 → Non (éviter la duplication)
4.2 → Ajouter clubId dans AuthContext
5.1 → Option A: Strict (seulement destinataire peut lire)
6.1 → 30 jours (bon équilibre)
6.2 → Oui, avec bouton (...) "Supprimer"
7.1 → Oui pour V2 (notifications push avec Expo)
8.1 → Oui, ajouter dès maintenant (utile pour debug)
```

---

**À toi de jouer! 🚀**

Réponds à ces questions et on peut commencer l'implémentation dès demain.
