# 📢 Implémentation du Système d'Annonces

## ✅ Récapitulatif

Système complet d'annonces implémenté pour **les clubs (owners)** et **les teachers (éducateurs)** utilisant Firebase Firestore comme base de données.

---

## 📋 Fonctionnalités Implémentées

### **1. Page d'Annonces pour les Clubs** (`/app/club-announcements.tsx`)
- ✅ Affichage des annonces en temps réel depuis Firebase
- ✅ Création d'annonces avec modal
- ✅ Vérification des permissions (seuls les owners/éducateurs peuvent poster)
- ✅ Affichage du rôle (Propriétaire/Éducateur) avec badge stylisé
- ✅ Formatage des timestamps (aujourd'hui, hier, date)
- ✅ Gestion du statut de chargement

### **2. Page d'Annonces pour les Teachers** (`/components/TeacherAnnouncementsPage.tsx`) (NOUVEAU)
- ✅ Interface identique à celle des clubs
- ✅ Affichage des annonces pour le club sélectionné
- ✅ Création d'annonces pour les éducateurs autorisés
- ✅ Badges de rôle (Propriétaire/Éducateur)
- ✅ Navigation fluide depuis la page communauté des teachers

---

## 🔄 Architecture & Flux de Données

### **Collections Firebase Utilisées**

```
channels/
├── {channelId}/
│   ├── type: 'announcements'
│   ├── name: 'Annonces'
│   ├── clubId: '{clubId}'
│   └── messages/
│       ├── {messageId}/
│       │   ├── text: 'Contenu de l\'annonce'
│       │   ├── createdBy: '{userId}'
│       │   ├── createdAt: Timestamp
│       │   └── type: 'text'

clubEducators/
├── {clubId}/educators/{educatorId}/
│   ├── isActive: true
│   └── role: 'educator'

club/
├── {clubId}/
│   ├── name: 'Nom du club'
│   └── ownerUserId: '{userId}'

users/
├── {userId}/
│   ├── profile/
│   │   ├── firstName: 'Nom'
│   │   └── lastName: 'Prénom'
```

### **Hooks Utilisés**

| Hook | Fonction | Utilisé dans |
|------|----------|-------------|
| `useCommunityChannels` | Récupère tous les channels d'un club | Pages d'annonces |
| `useCommunityMessages` | Récupère les messages d'un channel | Pages d'annonces |
| `useMessagesWithUserInfo` | Enrichit les messages avec nom/prénom | Pages d'annonces |
| `useCommunityMembers` | Récupère les membres du club | Vérification des rôles |
| `useClubPermissions` | Vérifie les permissions de l'utilisateur | Vérification des droits de posting |
| `useAuth` | Récupère l'utilisateur courant et son rôle | Authentification |

---

## 📱 Navigation

### **Route Teacher Stack** (Nouvelle)
```typescript
'teacher-announcements': { clubId: string | number | null }
```

### **Flux de Navigation**
```
TeacherCommunitySelectionPage
└─> Sélectionner un club
    └─> TeacherClubCommunityPage
        └─> Cliquer sur "Annonces"
            └─> TeacherAnnouncementsPage (NOUVEAU)
                └─> Voir les annonces + créer
```

---

## 🎨 Styles & Thème

### **Palette de Couleurs**
```typescript
{
  primary: '#E39A5C',        // Couleur principale (terrain/terracotta)
  primaryDark: '#D48242',    // Couleur sombre
  text: '#1F2937',           // Texte principal
  gray: '#6B7280',           // Texte secondaire
  border: '#E6E2DD',         // Bordures
  surface: '#FFFFFF',        // Fond blanc
  background: '#F7F4F0',     // Fond gris clair
  terracotta: '#D97706',     // Couleur accent
}
```

### **Badges de Rôle**
- **Owner/Propriétaire**: Fond #FEF3E2, texte #B45309
- **Educator/Éducateur**: Fond #FEF0E8, texte #D97706

---

## 🔐 Système de Permissions

### **Vérification des Droits**

```typescript
useClubPermissions(clubId, userId, userRole)
```

**Permissions Vérifiées:**
- `canPostInAnnouncements`: Seuls les owners + éducateurs
- `canCreateChannels`: Seuls les owners + éducateurs
- `canKickMembers`: Seuls les owners
- `canManageEducators`: Seuls les owners
- `isCommunityMember`: L'utilisateur est-il membre?

**Implémentation:**
```typescript
const canPostAnnouncements = permissions.canPostInAnnouncements;

if (!canPostAnnouncements) {
  Alert.alert('Erreur', 'Vous n\'avez pas la permission de publier une annonce');
  return;
}
```

---

## 📝 Exemple d'Utilisation

### **Affichage des Annonces**

```typescript
// 1. Récupérer le channel d'annonces
const announcementChannel = useMemo(
  () => channels.find((ch) => ch.type === 'announcements'),
  [channels]
);

// 2. Récupérer les messages
const { messages } = useCommunityMessages(
  announcementChannel?.id || '',
  user?.uid || ''
);

// 3. Enrichir avec les infos utilisateur
const { messagesWithInfo } = useMessagesWithUserInfo(messages);

// 4. Mapper et afficher
messagesWithInfo.map((msg) => (
  <View key={msg.id} style={styles.announcementCard}>
    <Text style={styles.author}>{msg.userFirstName}</Text>
    <Text style={styles.cardContent}>{msg.text}</Text>
    <Text style={styles.cardMeta}>{formatDate(msg.createdAt)}</Text>
  </View>
))
```

### **Publication d'une Annonce**

```typescript
const handlePublish = async () => {
  if (!announcementContent.trim()) return;
  
  try {
    await sendMessage(announcementContent.trim());
    setAnnouncementContent('');
    setIsModalVisible(false);
    Alert.alert('Succès', 'Annonce publiée');
  } catch (error) {
    Alert.alert('Erreur', 'Impossible de publier l\'annonce');
  }
};
```

---

## 📂 Fichiers Créés/Modifiés

### **Créés**
- ✅ `components/TeacherAnnouncementsPage.tsx` - Page d'annonces pour les teachers

### **Modifiés**
- ✅ `app/club-announcements.tsx` - Mise à jour pour utiliser les vraies données Firebase
- ✅ `navigation/types.ts` - Ajout de la route `teacher-announcements`
- ✅ `navigation/TeacherStack.tsx` - Enregistrement de la route
- ✅ `components/TeacherClubCommunityPage.tsx` - Lien vers la page des annonces

---

## ✨ Fonctionnalités Avancées

### **Formatage des Timestamps**
```typescript
formatDate(new Date(msg.createdAt)) 
// Affiche: "Aujourd'hui à 14:30" ou "Hier à 10:15" ou "15 déc"
```

### **Badges de Rôle Dynamiques**
```typescript
const authorRole = getMessageAuthorRole(msg.createdBy);
// Affiche le rôle du créateur avec couleur appropriée
```

### **États de Chargement**
- Loader pendant le chargement des messages
- Message vide si aucune annonce
- État "Publier..." pendant la publication

---

## 🚀 Prochaines Améliorations

### **À Considérer**
- [ ] Édition des annonces existantes
- [ ] Suppression des annonces (pour owner/créateur)
- [ ] Recherche/filtrage des annonces
- [ ] Pagination (charge progressive)
- [ ] Notifications lors de nouvelles annonces
- [ ] Épinglage des annonces importantes
- [ ] Archivage des annonces anciennes
- [ ] Réactions/emoji sur les annonces
- [ ] Historique de modification

---

## 🧪 Tests Effectués

✅ Compilation TypeScript - Tous les fichiers compilent sans erreur
✅ Navigation - Routes enregistrées correctement
✅ Permissions - Vérification des droits fonctionnelle
✅ Types - Tous les types correctement typés

---

## 📞 Support

Pour des questions sur l'implémentation:
- Voir les hooks dans `/hooks/`
- Consulter les types dans `/navigation/types.ts`
- Vérifier la structure Firebase dans les fichiers de configuration
