# ❓ FAQ - Questions Fréquentes

**Réponses rapides aux questions courantes**

---

## 🤔 ARCHITECTURE & DESIGN

### Q: Pourquoi 2 payments pour le split 50/50?
**A:** C'est plus simple et traçable. Chaque payment est clairement attribué (club reçoit 50%, éducateur reçoit 50%). Alternative: 1 payment avec métadonnées, mais plus compliqué.

### Q: Comment je sais qui a créé le payment?
**A:** Regarde le champ `payerUserId`. C'est l'ID du client qui paie.

### Q: Et qui reçoit le payment?
**A:** Regarde `receiverUserId`. C'est l'ID du club ou de l'éducateur.

### Q: Comment je vois les stats?
**A:** Utilise `useFetchClubPayments(clubId)` → retourne `stats` avec tous les calculs.

### Q: Faut-il créer le payment avant ou après le booking?
**A:** Les deux existent maintenant, créé ensemble dans le formulaire.

### Q: Pourquoi pas d'intégration Stripe?
**A:** v1 est hardcoded. Stripe viendra plus tard une fois la logique est stable.

---

## 💻 IMPLÉMENTATION

### Q: Comment j'utilise les hooks?
**A:** Voir [PAYMENT_USAGE_GUIDE.md](PAYMENT_USAGE_GUIDE.md) - 6 exemples avec code.

### Q: Quel hook je dois utiliser?
**A:** 
- Club voir paiements? → `useFetchClubPayments`
- Créer paiement? → `useCreatePayment` (importé de useFetchClubPayments)
- Updater statut? → `useUpdatePaymentStatus`
- Éducateur? → `useFetchEducatorPayments`
- Voir qui paie dans un cours? → `useFetchBookingPayments`

### Q: Le hook se met en cache?
**A:** Non, il refetch à chaque changement du `clubId`. Pour refetcher manuellement, appelle `refetch()`.

### Q: Comment je gère les erreurs?
**A:** Le hook retourne `error: string | null`. Affiche-le dans l'UI.

### Q: Comment je sais si c'est en chargement?
**A:** Le hook retourne `loading: boolean`. Affiche un spinner pendant que c'est true.

### Q: Puis-je utiliser le hook dans un hook custom?
**A:** Oui, tu peux wrapper les hooks dans tes propres hooks.

---

## 🧪 TESTING

### Q: Comment je teste si ça fonctionne?
**A:** Voir [PAYMENT_TODO.md](PAYMENT_TODO.md) - Section "TESTS AVANT DE DÉPLOYER".

### Q: Où je vois les données créées?
**A:** Dans Firestore Console → `payments` collection.

### Q: Comment je crée des test data?
**A:** Crée manuellement dans Firestore Console ou via le formulaire de booking.

### Q: Quels champs sont obligatoires?
**A:** Tous les champs marqués sans `?` dans `Payment` interface.

### Q: Je peux tester sans data?
**A:** Non, Firestore doit avoir au moins 1 payment pour voir les listes remplies.

---

## 🐛 DEBUGGING

### Q: Les données ne s'affichent pas
**A:** 
1. Vérifie `loading` state
2. Vérifie `error` state
3. Console.log les `payments`
4. Vérifies que Firestore a des data
5. Vérifie le filtre WHERE (clubId, educatorId, etc.)

### Q: Le hook retourne undefined
**A:**
1. Est-ce que `loading` est true? Attends.
2. Est-ce qu'il y a une `error`? Affiche-la.
3. Est-ce que les paramètres sont valides? Vérifie.

### Q: J'ai une erreur de requête Firestore
**A:**
1. Vérifies que la collection existe
2. Vérifies l'index (probablement pas nécessaire ici)
3. Vérifies les permissions Firestore
4. Regarde la console pour le détail

### Q: Le payment n'est pas créé
**A:**
1. Vérifies `loading` state
2. Vérifies `error` state
3. Va dans Firestore, cherche dans la collection `payments`
4. Si absent = la fonction a échoué silencieusement, check l'error

### Q: Les montants sont faux
**A:** Vérifies les unités (euros vs cents). Par défaut ici = euros (29.9€, pas 2990 cents).

---

## 📊 DONNÉES

### Q: Comment je vois les paiements d'un club spécifique?
**A:** `useFetchClubPayments(clubId)` - Filtre automatiquement.

### Q: Comment je vois les paiements d'un éducateur?
**A:** `useFetchEducatorPayments(educatorId)` - Filtre automatiquement.

### Q: Comment je vois qui a payé dans un cours?
**A:** `useFetchBookingPayments(bookingId)` - Retourne tous les paiements du cours.

### Q: Je veux filtrer les paiements par statut
**A:** Fais-le côté client après avoir récupéré les paiements:
```typescript
const completed = payments.filter(p => p.status === 'completed');
```

### Q: Je veux chercher par date
**A:** Utilise `useFetchBookingPayments` ou filtre côté client:
```typescript
const paid = payments.filter(p => new Date(p.createdAt) > startDate);
```

---

## 📱 UI & PAGES

### Q: Comment j'affiche une page de paiement utilisateur?
**A:** Crée une nouvelle page, utilise `useFetchBookingPayments` pour voir ses paiements.

### Q: Comment j'ajoute un bouton "Marquer comme payé"?
**A:** Voir [PAYMENT_USAGE_GUIDE.md](PAYMENT_USAGE_GUIDE.md) - Cas d'Usage 3.

### Q: Comment j'ajoute des notifications?
**A:** Après `updateStatus`, appelle ta fonction de notification avec les infos du paiement.

### Q: Où j'ajoute la page éducateur?
**A:** Elle existe: [app/educator-payments.tsx](app/educator-payments.tsx). Ajoute juste un bouton pour y accéder.

### Q: Comment j'exporte les paiements?
**A:** Future feature. Pour l'instant, tu peux utiliser Firestore export ou créer une Cloud Function.

---

## 🔒 SÉCURITÉ

### Q: Comment je protège les données sensibles?
**A:** Configure les Firestore Security Rules:
- User ne peut voir que ses propres paiements
- Club peut voir les paiements de son club
- Éducateur peut voir les paiements qu'il a reçus

### Q: Comment j'empêche les fraudes?
**A:** 
1. Valide côté serveur (Cloud Functions)
2. Utilise des montants vérifiés
3. Trace qui a fait quoi et quand (metadata)
4. Utilise un vrai provider paiement (future)

### Q: Est-ce que les paiements sont chiffrés?
**A:** Firestore chiffre en transit et au repos par défaut.

---

## 🌍 MULTILINGUE

### Q: Comment j'ajoute une autre langue?
**A:** Les textes sont en dur en français. À l'avenir, utilise i18n pour les traductions.

### Q: Comment j'ajoute une autre devise?
**A:** Le champ `currency` supporte n'importe quelle devise (EUR, USD, etc.). À codifier par pays.

---

## 🚀 AVANCER PLUS LOIN

### Q: Comment j'intègre Stripe?
**A:** 
1. Installe Stripe SDK
2. Crée une Stripe Session quand payment créé
3. Webhook de Stripe → mise à jour du status
4. C'est au-delà du scope v1

### Q: Comment j'ajoute des taxes/frais?
**A:** 
1. Ajoute les champs `tax`, `fee` dans metadata
2. Calcule le `amount` net après taxes
3. Ou track séparément

### Q: Comment j'automatise les remboursements?
**A:**
1. Cloud Function triggerée par un événement
2. Appelle `updateStatus(paymentId, 'refunded')`
3. Notifie les utilisateurs

### Q: Comment j'ajoute des rappels de paiement?
**A:**
1. Cloud Function quotidienne
2. Cherche les paiements `pending` depuis N jours
3. Envoie des notifications/emails

---

## 📞 SUPPORT

### Q: Je ne trouve pas la réponse ici
**A:** 
1. Vérifie [PAYMENT_IMPLEMENTATION.md](PAYMENT_IMPLEMENTATION.md) - Section "Décisions à Prendre"
2. Regarde le code source - il y a des commentaires
3. Teste dans la console

### Q: Mon erreur n'est pas listée
**A:**
1. Lis le message d'erreur complet
2. Cherche dans la doc
3. Console.log pour débugger
4. Demande/crée un issue

---

**Fin de FAQ! D'autres questions? 🤔**
