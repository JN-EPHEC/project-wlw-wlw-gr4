# 📖 GUIDE PRATIQUE - Intégration Paiements

**Comment utiliser les bases créées pour continuer le dev**

---

## 🎯 Cas d'Usage 1: Afficher les paiements du club (club-payments.tsx)

### Situation actuelle
Page `club-payments.tsx` affiche des données hardcodées (mock).

### Nouvelle implémentation
```typescript
import { useFetchClubPayments } from '@/hooks/useFetchClubPayments';
import { useAuth } from '@/context/AuthContext';

export default function ClubPaymentsScreen() {
  const { user } = useAuth();
  const clubId = user?.clubId; // ou passer via route params
  
  const { payments, stats, loading, error, refetch } = useFetchClubPayments(clubId);
  
  // Loading state
  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  
  // Error state
  if (error) {
    return <Text>Erreur: {error}</Text>;
  }
  
  // Afficher les stats
  return (
    <View>
      {/* Header avec stats */}
      <Text style={styles.revenueValue}>
        {stats.totalAmount.toFixed(2)}€  {/* Au lieu de hardcodé "2850" */}
      </Text>
      
      <Text>Paiements complétés: {stats.completed}</Text>
      <Text>En attente: {stats.pending}</Text>
      
      {/* Transactions */}
      {payments.map(payment => (
        <View key={payment.id} style={styles.card}>
          <Text>{payment.description}</Text>
          <Text>{payment.amount.toFixed(2)}€</Text>
          <Text>{payment.status === 'completed' ? 'Payé' : 'En attente'}</Text>
        </View>
      ))}
    </View>
  );
}
```

---

## 🎯 Cas d'Usage 2: Quand un user réserve un cours

### Location: `booking.tsx` (page de réservation)

```typescript
import { useCreatePayment } from '@/hooks/useFetchClubPayments';
import { useAuth } from '@/context/AuthContext';

export function BookingForm({ clubId, bookingId, bookingPrice }) {
  const { user } = useAuth();
  const { createPayment, loading } = useCreatePayment();
  
  const handleConfirmBooking = async () => {
    // 1. Créer le booking en Firestore (existant)
    // ...
    
    // 2. Créer le paiement
    const paymentId = await createPayment({
      payerUserId: user.uid,           // Client
      receiverUserId: clubId,           // Club (pour v1)
      amount: bookingPrice * 100,       // En cents
      currency: 'EUR',
      description: `Cours ${bookingTitle} - ${bookingDate}`,
      targetRef: `/bookings/${bookingId}`,
      targetType: 'booking',
      targetId: bookingId,
      clubId: clubId,
      status: 'completed',  // Ou 'pending' selon implémentation
      metadata: {
        courseTitle: bookingTitle,
        participantCount: userIds.length,
      }
    });
    
    if (paymentId) {
      // Booking + Payment créés avec succès
      console.log('Payment créé:', paymentId);
      navigation.navigate('bookingSuccess');
    }
  };
  
  return (
    <TouchableOpacity onPress={handleConfirmBooking} disabled={loading}>
      <Text>{loading ? 'Traitement...' : 'Confirmer la réservation'}</Text>
    </TouchableOpacity>
  );
}
```

---

## 🎯 Cas d'Usage 3: Club marque un paiement comme reçu

### Location: `club-payments.tsx` (dans la liste des paiements en attente)

```typescript
import { useUpdatePaymentStatus } from '@/hooks/useFetchClubPayments';

export function PendingPaymentCard({ payment, onRefresh }) {
  const { updateStatus, loading } = useUpdatePaymentStatus();
  
  const handleMarkAsPaid = async () => {
    const success = await updateStatus(payment.id, 'completed');
    
    if (success) {
      console.log('Paiement marqué comme payé');
      // Rafraîchir la liste
      onRefresh();
      
      // Notification au client?
      // await createNotification(...);
    }
  };
  
  return (
    <View style={styles.card}>
      <Text>{payment.description}</Text>
      <Text>{payment.amount.toFixed(2)}€</Text>
      
      <TouchableOpacity
        onPress={handleMarkAsPaid}
        disabled={loading}
        style={styles.button}
      >
        <Text>
          {loading ? 'Traitement...' : 'Marquer comme payé'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🎯 Cas d'Usage 4: Éducateur voit ses paiements

### Location: Nouvelle page `educator-payments.tsx` (déjà créée)

**✅ Page est prête à utiliser!**

Juste ajouter à la navigation du club manager pour accéder à la page de ses éducateurs.

```typescript
// Dans le menu du club
<TouchableOpacity
  onPress={() => navigation.navigate('educatorPayments')}
>
  <Text>Mes paiements (Éducateur)</Text>
</TouchableOpacity>
```

---

## 🎯 Cas d'Usage 5: Voir qui a payé dans un cours collectif

### Location: Détail d'un booking

```typescript
import { useFetchBookingPayments } from '@/hooks/useFetchBookingPayments';

export function BookingDetailScreen({ bookingId, userIds }) {
  const { payments, totalPaid, pendingAmount } = useFetchBookingPayments(bookingId);
  
  return (
    <View>
      <Text>Participants: {userIds.length}</Text>
      <Text>Paiements reçus: {totalPaid.toFixed(2)}€</Text>
      <Text>En attente: {pendingAmount.toFixed(2)}€</Text>
      
      {/* Liste des paiements par participant */}
      {payments.map(payment => (
        <View key={payment.id}>
          <Text>{payment.payerUserId}</Text>
          <Text>{payment.status === 'completed' ? '✅ Payé' : '⏳ En attente'}</Text>
          <Text>{payment.amount.toFixed(2)}€</Text>
        </View>
      ))}
    </View>
  );
}
```

---

## 🎯 Cas d'Usage 6: Split 50/50 entre Club et Éducateur

### Quand créer 2 paiements

```typescript
// Au lieu d'un seul payment pour le club, créer 2:

// Option recommandée: 2 payments séparés
const clubPayment = await createPayment({
  payerUserId: userId,
  receiverUserId: clubId,
  amount: bookingPrice / 2,  // 50%
  description: `${description} (Club)`,
  targetRef: `/bookings/${bookingId}`,
  targetId: bookingId,
  metadata: { split: 'club', educatorId }
});

const educatorPayment = await createPayment({
  payerUserId: userId,
  receiverUserId: educatorId,  // Paiement direct à l'éducateur
  amount: bookingPrice / 2,    // 50%
  description: `${description} (Éducateur)`,
  targetRef: `/bookings/${bookingId}`,
  targetId: bookingId,
  metadata: { split: 'educator', clubId }
});
```

Ensuite:
- `useFetchClubPayments(clubId)` → Voit ses 50%
- `useFetchEducatorPayments(educatorId)` → Voit ses 50%

---

## 📝 Checklist pour finir la tâche

### Pour aujourd'hui (Phase 1)
- [ ] **Updater `club-payments.tsx`**
  - Importer `useFetchClubPayments`
  - Remplacer données hardcodées
  - Utiliser `stats` et `payments` réels

### Demain (Phase 2)
- [ ] **Intégrer payment lors de booking**
  - Dans `booking.tsx`, appeler `useCreatePayment`
  - Tester avec les data Firestore

### Jour 3 (Phase 3)
- [ ] **Tester la page éducateur**
  - Naviguer vers `educatorPayments`
  - Vérifier que les paiements s'affichent

### Jour 4 (Phase 4)
- [ ] **Implémenter split 50/50**
  - Modifier `useCreatePayment` pour créer 2 payments
  - Tester avec club + éducateur

---

## 🧪 Test Rapide

Pour vérifier que tout fonctionne:

### 1. Data existe-t-elle?
```typescript
// Console Firestore
db.collection('payments').get()
// Devrait retourner au moins 1 document
```

### 2. Hook fonctionne?
```typescript
// Dans un composant test
const { payments, stats } = useFetchClubPayments('clubTest1');

console.log('Payments:', payments);
console.log('Stats:', stats);
```

### 3. Affichage?
```typescript
// Dans club-payments.tsx
<Text>{stats.totalAmount}€</Text>  // Devrait afficher "29.9" ou autre montant réel
```

---

## 🚨 Points d'Attention

1. **clubId vs educatorId**
   - S'assurer de passer l'ID correct à chaque hook

2. **Status du paiement**
   - Utiliser les bons enums: 'pending', 'completed', 'failed', 'refunded'

3. **Montants**
   - Vérifier les unités (euros vs cents)
   - Formater correctement avec `.toFixed(2)`

4. **Metadata**
   - Utiliser pour tracker des infos additionnelles
   - Important pour futur troubleshooting

5. **Notifications**
   - Ajouter des notifications quand paiement reçu
   - Notifier club ET éducateur (si split 50/50)

---

## 🎓 Ressources Disponibles

| Fichier | Objet | Utilisation |
|---------|-------|-----------|
| `types/Payment.ts` | Types | Importer les interfaces |
| `hooks/useFetchClubPayments.ts` | Hooks | Récupérer + créer + updater |
| `hooks/useFetchEducatorPayments.ts` | Hooks | Paiements éducateur |
| `hooks/useFetchBookingPayments.ts` | Hooks | Paiements d'un booking |
| `app/educator-payments.tsx` | UI | Page éducateur (ready-to-use) |
| `PAYMENT_IMPLEMENTATION.md` | Guide | Décisions d'architecture |

---

## ❓ Questions Fréquentes

### Q: Comment je sais qui a créé le payment?
R: C'est dans `payerUserId`. Le client qui a payé.

### Q: Et qui reçoit le payment?
R: C'est dans `receiverUserId`. Club ou éducateur selon implémentation.

### Q: Comment je change le status?
R: `useUpdatePaymentStatus` hook. Voir Cas d'Usage 3.

### Q: Comment je vois qui a payé dans un cours?
R: `useFetchBookingPayments(bookingId)`. Voir Cas d'Usage 5.

### Q: Je dois créer les payments automatiquement?
R: Pour v1, créer manuellement dans booking form. Future: webhooks pour paiement réel.

---

**Fin du guide. Bonne chance! 🚀**

