# ✅ CHECKLIST: Prochaines Étapes

**Imprime ceci ou fais défiler au besoin!**

---

## 🎯 AUJOURD'HUI: Analyse Complète ✅ DONE

- [x] Analyser l'état actuel des paiements
- [x] Créer les types TypeScript
- [x] Créer les hooks (5 au total)
- [x] Créer la page éducateur
- [x] Écrire la documentation (4 guides)
- [x] Créer l'architecture visuelle

**Status:** 🟢 **PRÊT POUR DEMAIN**

---

## 📅 JOUR 1: Updater Club-Payments (30-45 min)

### Tâche:
Remplacer les données hardcodées dans `club-payments.tsx` par les vraies données

### Étapes:
- [ ] Ouvrir [app/club-payments.tsx](app/club-payments.tsx)
- [ ] En haut, ajouter:
  ```typescript
  import { useAuth } from '@/context/AuthContext';
  import { useFetchClubPayments } from '@/hooks/useFetchClubPayments';
  ```

- [ ] Remplacer la création des constantes mock:
  ```typescript
  // ANCIEN CODE (supprimer):
  const stats = { totalRevenue: 2850, pendingPayments: 3, ... }
  const recentTransactions = [{ id: 1, ... }, ...]
  const pendingPayments = [...]
  const monthlyBreakdown = [...]
  
  // NOUVEAU CODE (ajouter):
  const { user } = useAuth();
  const { payments, stats, loading, error } = useFetchClubPayments(user?.clubId);
  ```

- [ ] Dans le JSX, remplacer l'affichage:
  ```typescript
  // ANCIEN:
  <Text>{stats.totalRevenue}€</Text>  // 2850 en hardcodé
  
  // NOUVEAU:
  <Text>{stats.totalAmount.toFixed(2)}€</Text>  // Vraie donnée
  ```

- [ ] Remplacer les listes de transactions:
  ```typescript
  // Utiliser payments au lieu de recentTransactions
  {payments.map(payment => (
    <View key={payment.id}>
      <Text>{payment.description}</Text>
      <Text>{payment.amount}€</Text>
      <Text>{payment.status}</Text>
    </View>
  ))}
  ```

- [ ] Tester:
  - [ ] L'app charge sans erreurs
  - [ ] Les stats s'affichent (actuel: 29.9€ si data existe)
  - [ ] Les listes se remplissent

### Status:
- ⏳ **À FAIRE**

---

## 📅 JOUR 2: Ajouter Payment lors du Booking (20-30 min)

### Tâche:
Intégrer `useCreatePayment` dans le formulaire de booking

### Étapes:
- [ ] Ouvrir [app/booking.tsx](app/booking.tsx)
- [ ] En haut, ajouter:
  ```typescript
  import { useCreatePayment } from '@/hooks/useFetchClubPayments';
  ```

- [ ] Trouver la fonction `handleConfirmBooking()` (ou créer si n'existe pas)
- [ ] Ajouter l'appel à createPayment:
  ```typescript
  const handleConfirmBooking = async () => {
    // 1. Créer le booking (existant)
    const bookingId = await createBooking(...);
    
    // 2. NOUVEAU: Créer le paiement
    const { createPayment } = useCreatePayment();
    const paymentId = await createPayment({
      payerUserId: user.uid,
      receiverUserId: clubId,
      amount: bookingPrice,
      currency: 'EUR',
      description: `Cours ${bookingTitle} - ${sessionDate}`,
      targetRef: `/bookings/${bookingId}`,
      targetType: 'booking',
      targetId: bookingId,
      clubId,
      status: 'completed',  // ou 'pending' selon règles métier
    });
    
    if (paymentId) {
      console.log('✅ Paiement créé');
      // Redirection, notification, etc.
    }
  };
  ```

- [ ] Tester:
  - [ ] Créer un booking
  - [ ] Vérifier dans Firestore que le Payment est créé
  - [ ] Revenir à club-payments.tsx, le paiement devrait s'afficher

### Status:
- ⏳ **À FAIRE**

---

## 📅 JOUR 3: Tester la Page Éducateur (10-15 min)

### Tâche:
Intégrer et tester la page `educator-payments.tsx` (déjà créée!)

### Étapes:
- [ ] La page existe déjà: [app/educator-payments.tsx](app/educator-payments.tsx)
- [ ] La route existe déjà: `educatorPayments` dans ClubStackParamList

- [ ] Ajouter un bouton pour y accéder
  - [ ] Dans le menu club (où? À définir)
  - [ ] Ou dans la page teacher/educator
  ```typescript
  <TouchableOpacity
    onPress={() => navigation.navigate('educatorPayments')}
  >
    <Text>Mes Paiements (Éducateur)</Text>
  </TouchableOpacity>
  ```

- [ ] Tester:
  - [ ] Naviguer vers educatorPayments
  - [ ] L'app charge sans erreurs
  - [ ] Les paiements s'affichent (si existant)
  - [ ] Les stats se calculent correctement

### Status:
- ⏳ **À FAIRE**

---

## 📅 JOUR 4: Split 50/50 (Optionnel, 30-45 min)

### Tâche:
Implémenter le split 50/50 entre club et éducateur

### Décision à prendre d'abord:
- [ ] Voulez-vous 1 payment ou 2 payments par client?
  - Option A: 1 payment au club, split calculé dans les stats
  - Option B: 2 payments (1 au club, 1 à l'éducateur) ✅ RECOMMANDÉ

### Si Option B (recommandée):
- [ ] Modifier `booking.tsx`:
  ```typescript
  // Créer 2 payments au lieu d'1
  
  // Payment 1: Club (50%)
  await createPayment({
    payerUserId: user.uid,
    receiverUserId: clubId,
    amount: bookingPrice / 2,
    description: `${title} (Club)`,
    // ...
  });
  
  // Payment 2: Éducateur (50%)
  await createPayment({
    payerUserId: user.uid,
    receiverUserId: educatorId,
    amount: bookingPrice / 2,
    description: `${title} (Éducateur)`,
    // ...
  });
  ```

- [ ] Tester:
  - [ ] Créer un booking
  - [ ] Vérifier que 2 payments sont créés
  - [ ] Club paie: useFetchClubPayments → voit 50%
  - [ ] Éducateur: useFetchEducatorPayments → voit 50%

### Status:
- ⏳ **À FAIRE (OPTIONNEL)**

---

## 🧪 TESTS AVANT DE DÉPLOYER

### Checklist de test:
- [ ] Charger l'app sans erreurs
- [ ] Vérifier que Firestore a les data:
  - [ ] Collection `payments` existe
  - [ ] Au moins 1 payment est présent
  
- [ ] Tester les hooks:
  - [ ] `useFetchClubPayments` retourne les données
  - [ ] `useFetchEducatorPayments` retourne les données
  - [ ] `useCreatePayment` crée un payment sans erreur
  
- [ ] Tester les pages:
  - [ ] `club-payments.tsx` affiche les vraies données
  - [ ] `educator-payments.tsx` s'ouvre et affiche les données
  
- [ ] Tester le flow complet:
  - [ ] Créer un booking
  - [ ] Vérifier que le payment est créé
  - [ ] Vérifier que club-payments affiche le nouveau payment

### Status:
- ⏳ **À FAIRE APRÈS CHAQUE JOUR**

---

## 🚀 BONUS (Après les 4 jours)

### Si tout fonctionne, considérer:
- [ ] Ajouter notifications quand paiement reçu
- [ ] Page "My Payments" pour les users
- [ ] Export de données (CSV, PDF)
- [ ] Remboursements (refund logic)
- [ ] Intégration Stripe/PayPal (future)
- [ ] Audit trail (qui a changé quoi, quand)

---

## 📊 PROGRESSION

```
JOUR 0: ✅ COMPLÉTÉ
  └─ Analyse + Création des bases

JOUR 1: ⏳ TODO
  └─ Updater club-payments.tsx

JOUR 2: ⏳ TODO
  └─ Ajouter payment lors du booking

JOUR 3: ⏳ TODO
  └─ Tester page éducateur

JOUR 4: ⏳ TODO (OPTIONNEL)
  └─ Split 50/50

BONUS: ⏳ TODO (APRÈS TOUT)
  └─ Features supplémentaires
```

---

## 🆘 SI TU BLOQUES

### "Je ne sais pas par où commencer"
→ Lis [PAYMENT_USAGE_GUIDE.md](PAYMENT_USAGE_GUIDE.md)  
→ Regarde les "Cas d'Usage" avec code

### "Mon hook ne fonctionne pas"
→ Vérifier:
- [ ] L'import est correct
- [ ] Le clubId/educatorId est valide
- [ ] La collection `payments` existe en Firestore
- [ ] Les données existent (checklist test)

### "Les données ne s'affichent pas"
→ Vérifier:
- [ ] `loading` state (afficher spinner)
- [ ] `error` state (afficher message)
- [ ] Les `stats` et `payments` ne sont pas undefined
- [ ] Console.log pour débuguer

### "Je ne sais pas si j'ai bien compris l'archi"
→ Lire [PAYMENT_ARCHITECTURE.md](PAYMENT_ARCHITECTURE.md)  
→ Regarder les diagrammes

---

## 📚 RESSOURCES RAPIDES

| Problème | Fichier |
|----------|---------|
| J'ai oublié comment utiliser les hooks | [PAYMENT_USAGE_GUIDE.md](PAYMENT_USAGE_GUIDE.md) |
| Je veux comprendre l'architecture | [PAYMENT_ARCHITECTURE.md](PAYMENT_ARCHITECTURE.md) |
| Qu'est-ce qui a été créé? | [PAYMENT_IMPLEMENTATION.md](PAYMENT_IMPLEMENTATION.md) |
| Résumé rapide | [PAYMENT_SUMMARY.md](PAYMENT_SUMMARY.md) |
| J'ai besoin du code TypeScript | [types/Payment.ts](types/Payment.ts) |
| J'ai besoin des hooks | [hooks/useFetchClubPayments.ts](hooks/useFetchClubPayments.ts) |
| Je veux voir une page complète | [app/educator-payments.tsx](app/educator-payments.tsx) |

---

## ✨ C'est Tout!

**Bonne chance! Tu as tout ce qu'il faut pour réussir! 🚀**

Si tu as des questions pendant le dev:
1. Lis la doc (tu trouveras la réponse)
2. Regarde le code (il y a des commentaires)
3. Teste dans la console (console.log pour débugger)

**Go!** 💪

