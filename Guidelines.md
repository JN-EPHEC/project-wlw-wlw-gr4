# Smart Dogs Design System Guidelines

Guide complet des règles de design et de développement pour l'application Smart Dogs.

---

## 🎨 Palette de couleurs

### Couleurs principales
- **Turquoise** : `#41B6A6` - Couleur principale, boutons primaires, accents, interface utilisateur
- **Sable** : `#E9B782` - Couleur secondaire, headers clubs, éléments chaleureux
- **Terracotta** : `#F28B6F` - Couleur tertiaire, éducateurs indépendants, communauté, annonces

### Variantes de couleurs principales
- **Turquoise Dark** : `#359889` - Utilisé dans les gradients avec turquoise
- **Sable Dark** : `#d9a772` - Utilisé dans les gradients avec sable
- **Terracotta Dark** : `#e67a5f` - Utilisé dans les gradients avec terracotta

### Échelle de gris
- **Gray 50** : `#F9FAFB` - Arrière-plans très clairs
- **Gray 100** : `#F3F4F6` - Arrière-plans clairs
- **Gray 200** : `#E5E7EB` - Bordures, séparateurs
- **Gray 300** : `#D1D5DB` - Bordures actives
- **Gray 400** : `#9CA3AF` - Icônes désactivées
- **Gray 500** : `#6B7280` - Texte secondaire
- **Gray 600** : `#4B5563` - Texte tertiaire, boutons secondaires foncés
- **Gray 700** : `#374151` - Texte secondaire foncé, boutons
- **Gray 800** : `#1F2937` - Texte principal
- **Gray 900** : `#111827` - Titres, texte très foncé

### Couleurs fonctionnelles
- **Success / Green** : `#10B981` - Succès, confirmations, statut actif
- **Success Light** : `#34D399` - Variante claire pour backgrounds
- **Emerald** : `#059669` - Revenue, gains, positif
- **Warning / Orange** : `#F59E0B` - Avertissements, attention requise
- **Error / Red** : `#EF4444` - Erreurs, suppressions, actions destructives
- **Info / Blue** : `#3B82F6` - Informations, liens
- **Blue Light** : `#60A5FA` - Variante claire pour info
- **Cyan** : `#06B6D4` - Variante info/fraîcheur
- **Purple** : `#9333EA` - Promotions, offres spéciales, classements
- **Purple Dark** : `#7C3AED` - Variante foncée pour classements
- **Purple Medium** : `#A855F7` - Variante medium
- **Pink** : `#EC4899` - DjanAI, intelligence artificielle, highlights
- **Pink Dark** : `#DB2777` - Variante foncée pour pink

### Couleurs de niveaux/progression
- **Bronze** : `from-orange-400 to-orange-600` - Niveau 1-2
- **Argent / Silver** : `from-gray-300 to-gray-500` - Niveau 3-4
- **Or / Gold** : `from-yellow-400 to-yellow-600` - Niveau 5-6
- **Platine** : `from-blue-400 to-blue-600` - Niveau 7-8
- **Diamant** : `from-purple-400 to-purple-600` - Niveau 9-10

### Couleurs boost/premium
- **Amber** : `#F59E0B` - Badges déverrouillés, récompenses
- **Yellow** : `#EAB308` - Premium, or, highlight
- **Orange** : `#F97316` - Boost, premium, énergie

---

## 🌈 Dégradés

### Dégradés principaux de marque
```tsx
// Turquoise (Interface Utilisateur)
bg-gradient-to-br from-[#41B6A6] to-[#359889]

// Sable (Interface Club)  
bg-gradient-to-br from-[#E9B782] to-[#d9a772]

// Terracotta (Interface Éducateur & Annonces)
bg-gradient-to-br from-[#F28B6F] to-[#e67a5f]
```

### Dégradés fonctionnels

#### Premium / Boost
```tsx
// Boost principal (jaune-orange)
bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500

// Boost alternatif
bg-gradient-to-r from-yellow-500 to-orange-500

// Overlay boost
bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-orange-500/20 mix-blend-overlay
```

#### Intelligence Artificielle / DjanAI
```tsx
// DjanAI principal (purple-pink)
bg-gradient-to-r from-purple-600 to-pink-600
bg-gradient-to-br from-purple-600 to-pink-600

// DjanAI cards backgrounds
bg-gradient-to-br from-purple-50 to-pink-50

// DjanAI boutons/badges
bg-gradient-to-br from-purple-600 to-pink-600
```

#### Leaderboards / Classements
```tsx
// Header leaderboard
bg-gradient-to-br from-purple-600 to-purple-800

// Podium 1ère place
bg-gradient-to-br from-yellow-400 to-orange-500

// Podium 2ème place  
bg-gradient-to-br from-gray-300 to-gray-400

// Podium 3ème place
bg-gradient-to-br from-orange-400 to-orange-500

// Cards leaderboard
bg-gradient-to-br from-purple-100 to-white
```

#### Success / Revenue
```tsx
// Statut vérifié
bg-gradient-to-r from-green-500 to-green-600

// Revenue / Gains
bg-gradient-to-br from-green-50 to-emerald-50
```

#### Backgrounds de sections
```tsx
// Background page principal
bg-gradient-to-b from-[#41B6A6]/5 to-white
bg-gradient-to-b from-[#41B6A6]/10 to-white
bg-gradient-to-b from-[#E9B782]/10 to-white

// Background sections spéciales
bg-gradient-to-b from-orange-50/30 to-white  // Clubs boostés
bg-gradient-to-b from-purple-50/30 to-white  // Événements
```

#### Overlays pour images
```tsx
// Overlay standard (bas vers transparent)
bg-gradient-to-t from-black/60 to-transparent
bg-gradient-to-t from-black/50 to-transparent

// Overlay premium (3 niveaux)
bg-gradient-to-t from-black/70 via-black/30 to-transparent
```

#### Cards colorées
```tsx
// Info cards
bg-gradient-to-br from-[#41B6A6]/5 to-white
bg-gradient-to-br from-[#41B6A6]/10 to-white
bg-gradient-to-br from-[#E9B782]/10 to-white
bg-gradient-to-br from-[#F28B6F]/10 to-white
bg-gradient-to-br from-blue-50 to-blue-100
bg-gradient-to-br from-purple-50 to-white

// Badges débloqués
bg-gradient-to-br from-amber-50 to-amber-100
```

#### Boutons club avec gradients
```tsx
// Boutons actions club
bg-gradient-to-br from-[#41B6A6] to-[#359889]  // Calendrier
bg-gradient-to-br from-[#F28B6F] to-[#e67a5f]  // Communauté
bg-gradient-to-br from-[#E9B782] to-[#d9a772]  // Professeurs
bg-gradient-to-br from-gray-600 to-gray-700    // Paramètres
bg-gradient-to-br from-purple-500 to-purple-600 // Paiements
```

#### Avatars par défaut
```tsx
// Avatar utilisateur
bg-gradient-to-br from-[#41B6A6] to-[#359889]

// Avatar éducateur
bg-gradient-to-br from-[#F28B6F] to-[#e67a5f]

// Avatar icône DjanAI
bg-gradient-to-br from-purple-600 to-pink-600
```

#### Promos / Offres spéciales
```tsx
// Promo variante 1
from-purple-500 to-pink-500

// Promo variante 2
from-orange-500 to-red-500

// Promo variante 3
from-blue-500 to-cyan-500
```

---

## 📝 Typographie

### Polices
- **Baloo Bold** : Utilisée pour TOUS les titres (h1, h2, h3, h4, h5, h6)
- **Poppins** : Utilisée pour tout le corps de texte, labels, descriptions

### ⚠️ RÈGLE IMPORTANTE
**Ne JAMAIS utiliser les classes Tailwind pour font-size, font-weight ou line-height !**

La typographie est gérée dans `styles/globals.css` avec des valeurs par défaut pour chaque élément HTML.

✅ **Bon** :
```tsx
<h1>Mon titre</h1>
<h2>Section</h2>
<h3>Sous-titre</h3>
<h4>Titre de carte</h4>
<p>Mon texte</p>
```

❌ **Mauvais** :
```tsx
<h1 className="text-2xl font-bold">Mon titre</h1>
<p className="text-sm">Mon texte</p>
```

### Exception : Classes de taille autorisées
Uniquement pour les cas spécifiques où le design l'exige :
- `text-xs` : Texte très petit (timestamps, métadonnées, labels secondaires)
- `text-sm` : Texte petit (descriptions courtes, sous-labels)
- Ne jamais utiliser text-base, text-lg, text-xl, text-2xl, etc.

### Hiérarchie typographique
- `h1` : Titres principaux de page (headers)
- `h2` : Titres de section majeure
- `h3` : Sous-titres importants
- `h4` : Titres de cartes, noms d'éléments
- `p` (base) : Texte normal, paragraphes
- `text-sm` : Labels, descriptions
- `text-xs` : Métadonnées, timestamps, petits labels

---

## 🧩 Composants

### Boutons

#### Variantes principales
```tsx
// Défaut (noir)
<Button>Défaut</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost (transparent)
<Button variant="ghost">Ghost</Button>

// Destructive (rouge)
<Button variant="destructive">Supprimer</Button>
```

#### Couleurs Smart Dogs personnalisées
```tsx
// Turquoise (utilisateur)
<Button className="bg-[#41B6A6] hover:bg-[#359889]">Action</Button>

// Sable (club)
<Button className="bg-[#E9B782] hover:bg-[#d9a772] text-white">Action</Button>

// Terracotta (éducateur)
<Button className="bg-[#F28B6F] hover:bg-[#e67a5f] text-white">Action</Button>

// Premium / Boost
<Button className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white">
  Booster
</Button>

// DjanAI
<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white">
  DjanAI
</Button>
```

#### Tailles
```tsx
<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

#### Boutons arrondis (pill shaped)
```tsx
<Button className="rounded-full">Bouton arrondi</Button>

// Filtres/Tags
<button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
  Filtre
</button>
```

#### Boutons avec gradients (Club dashboard)
```tsx
// Calendrier
<Button className="h-20 bg-gradient-to-br from-[#41B6A6] to-[#359889] hover:from-[#359889] hover:to-[#41B6A6] flex-col gap-2">
  <Calendar className="h-6 w-6" />
  Calendrier
</Button>

// Communauté  
<Button className="h-20 bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] hover:from-[#e67a5f] hover:to-[#F28B6F] flex-col gap-2">
  <MessageSquare className="h-6 w-6" />
  Communauté
</Button>
```

### Cartes

#### Styles de base
```tsx
// Carte standard (défaut recommandé)
<Card className="p-4 shadow-sm border-0">

// Carte avec plus de padding
<Card className="p-6 shadow-sm border-0">

// Carte avec ombre prononcée
<Card className="p-4 shadow-lg border-0">

// Carte clickable
<Card className="p-4 shadow-sm border-0 cursor-pointer hover:shadow-md transition-shadow">
```

#### Cartes avec gradients de fond
```tsx
// Carte turquoise légère
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#41B6A6]/5 to-white">
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#41B6A6]/10 to-white">

// Carte sable légère
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">

// Carte terracotta légère
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#F28B6F]/10 to-white">

// Carte purple légère (événements/leaderboard)
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-white">
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-purple-100 to-white">

// Carte DjanAI
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-pink-50">

// Carte info
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100">
```

#### Cartes avec bordure latérale
```tsx
<Card className="p-4 shadow-sm border-0 border-l-4 border-l-[#41B6A6]">
<Card className="p-4 shadow-sm border-0 border-l-4 border-l-[#E9B782]">
<Card className="p-4 shadow-sm border-0 border-l-4 border-l-[#F28B6F]">
<Card className="p-4 shadow-sm border-0 border-l-4 border-l-green-500">
```

#### Cartes premium/boost
```tsx
// Premium full gradient
<Card className="p-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0 shadow-lg">

// Verified status
<Card className="p-5 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">

// DjanAI CTA
<Card className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 shadow-lg">
```

### Badges

#### Variants standards
```tsx
<Badge>Défaut</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

#### Couleurs Smart Dogs
```tsx
// Couleurs principales
<Badge className="bg-[#41B6A6] text-white border-0">Turquoise</Badge>
<Badge className="bg-[#E9B782] text-white border-0">Sable</Badge>
<Badge className="bg-[#F28B6F] text-white border-0">Terracotta</Badge>

// États
<Badge className="bg-green-100 text-green-700 border-0">Actif</Badge>
<Badge className="bg-yellow-100 text-yellow-700 border-0">En attente</Badge>
<Badge className="bg-purple-100 text-purple-700 border-0">Promo</Badge>
<Badge className="bg-red-100 text-red-700 border-0">Urgent</Badge>
<Badge className="bg-gray-100 text-gray-700 border-0">Inactif</Badge>

// Avec gradients
<Badge className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0">
  Premium
</Badge>
<Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
  <Sparkles className="h-3 w-3 mr-1" />
  DjanAI
</Badge>
```

#### Badge Verified spécial
```tsx
// Sur fond coloré
<Badge className="bg-white/20 text-white border-0">
  <Shield className="h-3 w-3 mr-1" />
  Verified
</Badge>

// Sur fond blanc
<Badge className="bg-green-100 text-green-700 border-0">
  <BadgeCheck className="h-3 w-3 mr-1" />
  Vérifié
</Badge>
```

### Progress Bar (Gamification)

#### Standard
```tsx
<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-[#41B6A6] to-[#359889] rounded-full transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>

// Petite (h-2)
<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

#### Avec animation
```tsx
<div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500 animate-pulse"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Inputs et formulaires

#### Input standard
```tsx
<div>
  <Label className="text-gray-700">Titre du champ</Label>
  <Input placeholder="Placeholder..." className="mt-1.5" />
</div>
```

#### Input avec icône
```tsx
<div className="relative mt-1.5">
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  <Input className="pl-10" placeholder="Avec icône..." />
</div>
```

#### Textarea
```tsx
<Textarea className="mt-1.5 min-h-[100px]" />
<Textarea className="mt-1.5 min-h-[80px]" />  // Compact
```

#### Checkbox personnalisé
```tsx
<input 
  type="checkbox" 
  className="w-5 h-5 rounded border-gray-300 text-[#41B6A6] focus:ring-[#41B6A6]"
/>
```

---

## 📐 Espacements et mise en page

### Espacements courants (gap)
- `gap-1` (4px) : Très petit espacement
- `gap-2` (8px) : Petit espacement entre éléments adjacents
- `gap-3` (12px) : Espacement moyen entre éléments
- `gap-4` (16px) : Espacement standard entre éléments
- `gap-6` (24px) : Grand espacement entre sections

### Espacements verticaux (space-y)
- `space-y-2` : Liste compacte
- `space-y-3` : Liste standard (recommandé pour leaderboards)
- `space-y-4` : Liste aérée
- `space-y-6` : Sections de page

### Padding
- `p-3` (12px) : Padding compact pour petites cartes
- `p-4` (16px) : Padding standard pour cartes (RECOMMANDÉ)
- `p-5` (20px) : Padding medium pour cartes importantes
- `p-6` (24px) : Padding large pour cartes principales
- `px-4 py-6` : Padding horizontal/vertical différent (contenu de page)

### Margin
- `mb-2` : Petit espacement sous titre
- `mb-3` : Espacement standard sous titre
- `mb-4` : Grand espacement sous titre
- `mb-6` : Espacement entre sections
- `mt-1.5` : Espacement après label (RECOMMANDÉ pour inputs)

### Border Radius
- `rounded` : Arrondis légers (4px)
- `rounded-md` : Arrondis moyens (6px)
- `rounded-lg` : Arrondis standard pour cartes (8px) - RECOMMANDÉ
- `rounded-xl` : Arrondis plus prononcés (12px)
- `rounded-2xl` : Très arrondis (16px)
- `rounded-3xl` : Headers avec arrondis en bas (24px)
- `rounded-full` : Cercles parfaits (avatars, boutons pill, badges)

### Ombres (shadow)
- `shadow-sm` : Ombre légère - USAGE COURANT POUR CARTES
- `shadow-md` : Ombre moyenne - hover states
- `shadow-lg` : Ombre prononcée - emphase, cartes importantes, headers
- `shadow-xl` : Ombre très prononcée - modals, overlays
- `shadow-2xl` : Ombre maximale - frame iPhone

---

## 📱 Layout mobile (iPhone 15 Pro)

### Dimensions
- Largeur : `393px`
- Hauteur : `852px`
- Frame externe : `rounded-[60px]` avec padding `p-3`

### Structure de page standard
```tsx
<div className="flex flex-col h-full bg-white">
  {/* Header avec gradient et arrondis */}
  <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
    <h1 className="text-white">Titre de page</h1>
  </div>

  {/* Contenu scrollable */}
  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
    {/* Contenu ici */}
  </div>
</div>
```

### Structure avec background gradient
```tsx
<div className="flex flex-col h-full bg-gradient-to-b from-[#41B6A6]/5 to-white pb-20">
  {/* Header */}
  <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6 rounded-b-3xl shadow-lg">
    <h1 className="text-white">Titre</h1>
  </div>

  {/* Contenu */}
  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
    {/* Contenu */}
  </div>
</div>
```

### Structure avec filtres sticky (IMPORTANT)
Pour éviter les conflits de scroll horizontal/vertical :

```tsx
<div className="flex flex-col h-full bg-white">
  {/* Header */}
  <div className="bg-gradient-to-br from-purple-600 to-purple-800 px-4 pt-12 pb-6">
    <h1 className="text-white">Titre</h1>
  </div>

  {/* Filtres sticky - SORTIR du conteneur overflow-y-auto */}
  <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
    <div className="pt-4 pb-3">
      <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-2 px-4 min-w-max">
          <button className="px-4 py-2 rounded-full flex-shrink-0 whitespace-nowrap bg-purple-600 text-white">
            Filtre 1
          </button>
          <button className="px-4 py-2 rounded-full flex-shrink-0 whitespace-nowrap bg-gray-100">
            Filtre 2
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Contenu scrollable SÉPARÉ */}
  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
    {/* Contenu */}
  </div>
</div>
```

### Scroll horizontal (filtres, catégories)
**Structure à deux niveaux obligatoire :**

```tsx
<div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
  <div className="flex gap-2 min-w-max">
    <button className="flex-shrink-0 whitespace-nowrap">Item 1</button>
    <button className="flex-shrink-0 whitespace-nowrap">Item 2</button>
  </div>
</div>
```

**Classes obligatoires :**
- `overflow-x-auto` sur le conteneur parent
- `min-w-max` sur le conteneur flex enfant
- `flex-shrink-0` sur chaque élément scrollable
- `whitespace-nowrap` pour empêcher le texte de wrapper

### Bottom Navigation
- Hauteur fixe : `h-20` (80px)
- Position : `fixed bottom-0 left-0 right-0`
- Fond : `bg-white` avec `border-t border-gray-200`
- Ombre : `shadow-lg`
- **IMPORTANT** : Toujours ajouter `pb-20` ou `pb-24` au contenu pour éviter que la nav ne cache le contenu

---

## 🎯 Patterns de design

### Headers de page

#### Header Utilisateur (Turquoise)
```tsx
// Standard avec rounded bottom
<div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
  <h1 className="text-white">Titre</h1>
  <p className="text-white/80">Sous-titre</p>
</div>

// Compact sans rounded
<div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6 shadow-md">
  <h1 className="text-white">Titre</h1>
</div>
```

#### Header Éducateur/Indépendant (Terracotta)
```tsx
<div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] px-4 pt-12 pb-6 shadow-md">
  <h1 className="text-white">Titre</h1>
</div>
```

#### Header Club (Sable)
```tsx
<div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
  <h1 className="text-white">Mon Club</h1>
</div>
```

#### Header Leaderboard (Purple)
```tsx
<div className="bg-gradient-to-br from-purple-600 to-purple-800 px-4 pt-12 pb-6">
  <h1 className="text-white">Classement</h1>
</div>
```

#### Header avec bouton retour
```tsx
<div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
  <Button
    variant="ghost"
    size="icon"
    onClick={onBack}
    className="text-white hover:bg-white/20 rounded-full mb-4"
  >
    <ArrowLeft className="h-5 w-5" />
  </Button>
  <h1 className="text-white">Titre</h1>
</div>
```

### Cards de progression (Gamification)

#### Carte de niveau de chien
```tsx
<Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-white">
  <div className="flex items-center gap-3">
    {/* Image du chien */}
    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200">
      <img src={dogImage} className="w-full h-full object-cover" />
    </div>
    
    {/* Info niveau */}
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-gray-800">{dogName}</h4>
        <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-0">
          Niveau {level}
        </Badge>
      </div>
      
      {/* Barre de progression */}
      <div className="bg-gray-200 rounded-full h-2">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">{xp} / {nextLevelXp} XP</p>
    </div>
  </div>
</Card>
```

#### Carte de badge
```tsx
<Card className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
  <div className="flex flex-col items-center text-center">
    {/* Icône du badge */}
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3">
      <Trophy className="h-8 w-8 text-white" />
    </div>
    
    <h4 className="text-gray-800 mb-1">{badgeName}</h4>
    <p className="text-xs text-gray-600 mb-3">{badgeDescription}</p>
    
    {/* État */}
    {unlocked ? (
      <Badge className="bg-green-100 text-green-700 border-0">
        <CheckCircle className="h-3 w-3 mr-1" />
        Déverrouillé
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-600 border-0">
        <Lock className="h-3 w-3 mr-1" />
        Verrouillé
      </Badge>
    )}
  </div>
</Card>
```

#### Carte de tâche
```tsx
<Card className="p-4 shadow-sm border-0">
  <div className="flex items-start gap-3">
    {/* Checkbox */}
    <input 
      type="checkbox" 
      checked={completed}
      className="w-5 h-5 rounded border-gray-300 text-[#41B6A6] focus:ring-[#41B6A6] mt-0.5 flex-shrink-0"
    />
    
    <div className="flex-1">
      <div className="flex items-start justify-between gap-3">
        <h4 className={completed ? 'text-gray-400 line-through' : 'text-gray-800'}>
          {taskName}
        </h4>
        <Badge className="bg-purple-100 text-purple-700 border-0 flex items-center gap-1 flex-shrink-0">
          <Zap className="h-3 w-3" />
          +{xpReward} XP
        </Badge>
      </div>
      <p className="text-xs text-gray-600 mt-1">{taskDescription}</p>
    </div>
  </div>
</Card>
```

### Leaderboards

#### Podium Top 3
```tsx
<div className="flex items-end justify-center gap-2 px-4 mb-6">
  {/* 2ème place */}
  <div className="flex-1 text-center">
    <div className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-gray-300">
      <img src={avatar} className="w-full h-full rounded-full object-cover" />
    </div>
    <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-t-xl p-3 pt-6">
      <div className="text-2xl mb-1">🥈</div>
      <h4 className="text-white text-sm">{name}</h4>
      <p className="text-white/80 text-xs">{score}</p>
    </div>
  </div>
  
  {/* 1ère place (plus haute avec -mt-4) */}
  <div className="flex-1 text-center -mt-4">
    <div className="w-20 h-20 rounded-full mx-auto mb-2 border-4 border-yellow-400">
      <img src={avatar} className="w-full h-full rounded-full object-cover" />
    </div>
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-t-xl p-3 pt-8">
      <div className="text-3xl mb-1">🏆</div>
      <h4 className="text-white">{name}</h4>
      <p className="text-white/90 text-xs">{score}</p>
    </div>
  </div>
  
  {/* 3ème place */}
  <div className="flex-1 text-center">
    <div className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-orange-400">
      <img src={avatar} className="w-full h-full rounded-full object-cover" />
    </div>
    <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-t-xl p-3 pt-6">
      <div className="text-2xl mb-1">🥉</div>
      <h4 className="text-white text-sm">{name}</h4>
      <p className="text-white/80 text-xs">{score}</p>
    </div>
  </div>
</div>
```

#### Carte de classement
```tsx
<Card className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
  <div className="flex items-center gap-3">
    {/* Position */}
    <div className="w-8 text-center flex-shrink-0">
      <span className="text-gray-800">#{position}</span>
    </div>
    
    {/* Avatar */}
    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
      <img src={avatar} className="w-full h-full object-cover" />
    </div>
    
    {/* Info */}
    <div className="flex-1 min-w-0">
      <h4 className="text-gray-800 truncate">{name}</h4>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
    
    {/* Score/Stats */}
    <div className="text-right flex-shrink-0">
      <div className="text-purple-600">{score}</div>
      <p className="text-xs text-gray-600">{metric}</p>
    </div>
  </div>
</Card>
```

### Overlays pour images

#### Overlay standard
```tsx
<div className="relative h-48 rounded-lg overflow-hidden">
  <img src={image} className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  
  {/* Contenu par-dessus */}
  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
    <h4>{title}</h4>
  </div>
</div>
```

#### Overlay premium (boost)
```tsx
<div className="relative h-48 rounded-lg overflow-hidden">
  <img src={image} className="w-full h-full object-cover opacity-40" />
  
  {/* Gradient principal */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
  
  {/* Overlay boost coloré */}
  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-orange-500/20 mix-blend-overlay" />
  
  {/* Badge boost */}
  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0">
    <Zap className="h-3 w-3 mr-1" />
    Boosté
  </Badge>
</div>
```

### États et interactions

#### Hover states
```tsx
// Hover sur boutons
<Button className="hover:shadow-lg transition-shadow">

// Hover sur cartes
<Card className="cursor-pointer hover:shadow-md transition-shadow">

// Hover sur éléments de liste
<div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">

// Hover avec scale
<div className="transition-transform hover:scale-105">
```

#### Transitions
Toujours utiliser des transitions pour les interactions fluides :
```tsx
transition-all          // Toutes les propriétés
transition-shadow       // Ombres uniquement
transition-colors       // Couleurs uniquement
transition-opacity      // Opacité uniquement
transition-transform    // Transform uniquement

// Durées
duration-200  // Rapide (défaut)
duration-300  // Standard
duration-500  // Lent (progress bars, animations)
```

#### Animations
```tsx
animate-pulse           // Pulse continu
animate-bounce          // Bounce
animate-spin            // Rotation

// Custom avec Tailwind
@keyframes shimmer {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
```

---

## 🖼️ Images et icônes

### Images

#### IMPORTANT : Utiliser ImageWithFallback
Toujours utiliser le composant pour les nouvelles images :
```tsx
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback
  src={imageUrl}
  alt="Description descriptive"
  className="w-full h-full object-cover"
/>
```

#### Tailles d'images courantes
```tsx
// Avatar petit (chat, liste)
className="w-10 h-10 rounded-full object-cover"

// Avatar medium (profil, cards)
className="w-12 h-12 rounded-full object-cover"

// Avatar large (header profil)
className="w-20 h-20 rounded-full object-cover"

// Image de club/event (card)
className="w-full h-40 object-cover"

// Image de club/event (hero detail)
className="w-full h-64 object-cover"
```

### Icônes Lucide React

#### Import
```tsx
import { IconName } from 'lucide-react';
```

#### Tailles standardisées
```tsx
<Icon className="h-3 w-3" />   // Très petit (dans badges, labels)
<Icon className="h-4 w-4" />   // Petit (dans inputs, boutons SM, text)
<Icon className="h-5 w-5" />   // Moyen (dans boutons, nav, titres)
<Icon className="h-6 w-6" />   // Grand (dans cards, features, headers)
<Icon className="h-8 w-8" />   // Très grand (badges principaux, hero)
<Icon className="h-10 w-10" /> // Énorme (avatars par défaut, placeholders)
<Icon className="h-12 w-12" /> // Gigantesque (hero sections, empty states)
```

### 📋 Liste complète des icônes utilisées

#### Navigation & Interface
- `Home` - Accueil
- `ArrowLeft` - Retour
- `ArrowRight` - Suivant
- `ChevronRight` - Navigation vers la droite
- `ChevronLeft` - Navigation vers la gauche
- `MoreVertical` - Menu options
- `Plus` - Ajouter
- `X` - Fermer
- `Search` - Rechercher
- `Filter`, `SlidersHorizontal` - Filtres
- `Settings` - Paramètres
- `Eye`, `EyeOff` - Visibilité

#### Utilisateurs & Profils
- `User`, `UserCircle` - Utilisateur
- `Users`, `UsersIcon` - Groupe utilisateurs
- `Dog` - Chien
- `Building2` - Club/Organisation
- `GraduationCap` - Éducateur

#### Communication
- `MessageCircle`, `MessageSquare` - Messages
- `Send` - Envoyer
- `Bell`, `BellOff` - Notifications
- `Phone` - Téléphone
- `Mail` - Email
- `Hash` - Channel/Tag
- `Megaphone`, `Volume2` - Annonces

#### Actions & États
- `CheckCircle`, `CheckCircle2` - Validé
- `XCircle` - Annulé/Erreur
- `AlertCircle` - Avertissement
- `Clock` - Temps/Horaire
- `Edit` - Éditer
- `Trash2` - Supprimer
- `Save` - Sauvegarder
- `Copy` - Copier
- `Share2` - Partager
- `Download` - Télécharger
- `Upload` - Uploader
- `Lock` - Verrouillé
- `Globe` - Public/Web

#### Contenu & Média
- `Heart` - Favoris/J'aime
- `Star` - Note/Favori
- `ThumbsUp` - Like
- `Eye` - Vues
- `Camera` - Photo
- `Image`, `ImageIcon` - Image
- `FileText` - Document
- `Paperclip` - Pièce jointe
- `BookOpen` - Livre/Formation

#### Calendrier & Temps
- `Calendar` - Calendrier
- `Clock` - Heure

#### Gamification & Récompenses
- `Trophy` - Trophée/Champion
- `Award`, `Medal` - Badge/Médaille
- `Crown` - Couronne/VIP
- `Star` - Étoile/Rating
- `Zap` - Boost/Énergie/XP
- `Sparkles` - Magie/DjanAI
- `Target` - Objectif
- `TrendingUp` - Progression
- `CheckCircle` - Tâche complétée
- `Lock` - Badge verrouillé

#### Vérification & Sécurité
- `Shield`, `BadgeCheck` - Vérifié
- `Lock` - Sécurisé

#### Finance
- `CreditCard` - Paiement
- `Euro`, `DollarSign` - Prix/Argent
- `Wallet` - Portefeuille
- `ArrowUpRight`, `ArrowDownRight` - Flux financiers
- `Percent` - Pourcentage/Réduction
- `Gift` - Cadeau/Bonus

#### Localisation
- `MapPin` - Localisation

#### Stats & Analytics
- `TrendingUp` - Croissance
- `Activity` - Activité
- `BarChart3` - Statistiques

#### Divers
- `Smile` - Emoji
- `Palette` - Design/Couleurs
- `Type`, `Layout`, `Layers` - Design System
- `Zap` - Premium/Boost
- `Construction` - En construction
- `AlertTriangle` - Attention
- `Ban` - Bloquer
- `UserPlus`, `UserMinus`, `UserX` - Gestion membres
- `Play` - Lecture
- `Pin` - Épingler
- `Tag` - Étiquette
- `Smartphone` - Mobile

### Photos de chiens (Unsplash)

#### Recherches recommandées
```
"dog training"         // Dressage général
"dog park"            // Environnement extérieur
"dog agility"         // Sport/Agility
"happy dog"           // Portraits positifs
"puppy training"      // Chiots
"dog obedience"       // Obéissance
"dog playing"         // Jeu/Activité
"golden retriever"    // Race spécifique
"dog portrait"        // Portraits qualité
```

---

## 🎨 Éléments spécifiques Smart Dogs

### Badge Verified

#### Sur fond coloré (header)
```tsx
<Badge className="bg-white/20 text-white border-0">
  <Shield className="h-3 w-3 mr-1" />
  Verified
</Badge>
```

#### Sur fond blanc
```tsx
<Badge className="bg-green-100 text-green-700 border-0">
  <BadgeCheck className="h-3 w-3 mr-1" />
  Vérifié
</Badge>
```

### Promotions et Boost

#### Banner boost principal
```tsx
<Card className="p-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0 shadow-lg relative overflow-hidden">
  {/* Éléments décoratifs */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
  
  <div className="relative z-10">
    <Zap className="h-8 w-8 mb-2" />
    <h3 className="text-white mb-2">Booster votre club</h3>
    <p className="text-white/90 text-sm">Description...</p>
  </div>
</Card>
```

#### Badge boost
```tsx
<Badge className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0">
  <Zap className="h-3 w-3 mr-1" />
  Boosté
</Badge>

<Badge className="bg-white/90 text-orange-600 border-0">
  Premium
</Badge>
```

### DjanAI (Intelligence Artificielle)

#### CTA principale
```tsx
<Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
  <div className="flex items-start gap-3">
    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
      <Sparkles className="h-6 w-6 text-white" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-gray-800">DjanAI</h3>
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          IA
        </Badge>
      </div>
      <p className="text-sm text-gray-600">
        Programme personnalisé pour {dogName}
      </p>
      <Button size="sm" className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-full">
        <Sparkles className="h-4 w-4 mr-1" />
        Commencer
      </Button>
    </div>
  </div>
</Card>
```

#### Full banner DjanAI
```tsx
<Card className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 shadow-lg">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
      <Sparkles className="h-6 w-6 text-white" />
    </div>
    <div className="flex-1">
      <h3 className="text-white mb-1">Consulter DjanAI</h3>
      <p className="text-white/80 text-sm">
        Votre assistant IA personnel
      </p>
    </div>
    <ChevronRight className="h-5 w-5 text-white/80" />
  </div>
</Card>
```

### Messages de statut

#### Succès
```tsx
<Card className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm border-0">
  <div className="flex gap-3">
    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="text-sm text-green-900 mb-1">Succès !</h4>
      <p className="text-sm text-green-700">Message de succès détaillé</p>
    </div>
  </div>
</Card>
```

#### Avertissement
```tsx
<Card className="p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-sm border-0">
  <div className="flex gap-3">
    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="text-sm text-orange-900 mb-1">Attention</h4>
      <p className="text-sm text-orange-700">Message d'avertissement</p>
    </div>
  </div>
</Card>
```

#### Information
```tsx
<Card className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm border-0">
  <div className="flex gap-3">
    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="text-sm text-blue-900 mb-1">Information</h4>
      <p className="text-sm text-blue-700">Message d'information</p>
    </div>
  </div>
</Card>
```

#### Erreur
```tsx
<Card className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm border-0">
  <div className="flex gap-3">
    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="text-sm text-red-900 mb-1">Erreur</h4>
      <p className="text-sm text-red-700">Message d'erreur</p>
    </div>
  </div>
</Card>
```

---

## 👥 Types d'utilisateurs et navigation

### 3 types de comptes

#### 1. Compte Particulier (Turquoise #41B6A6)
- Propriétaires de chiens
- Accès aux services et à la communauté
- Réservation de séances
- Gamification et progression des chiens
- **Navigation** : `<BottomNav />`
  - Accueil (`home`)
  - Clubs (`clubs`)
  - Communauté (`community`)
  - Mes chiens (`dogs`)
  - Compte (`account`)

#### 2. Compte Éducateur/Indépendant (Terracotta #F28B6F)
- Éducateurs canins indépendants
- Proposent leurs propres séances
- Gèrent leur agenda et tarifs
- Peuvent rejoindre des clubs
- **Navigation** : `<TeacherBottomNav />`
  - Accueil (`teacher-home`)
  - Rendez-vous (`teacher-appointments`)
  - Communauté (`teacher-community`)
  - Clubs (`teacher-clubs`)
  - Compte (`teacher-account`)

#### 3. Compte Club/Structure (Sable #E9B782)
- Clubs canins et structures
- Gèrent plusieurs éducateurs
- Organisent des événements
- Créent une communauté
- **Navigation** : `<ClubBottomNav />`
  - Accueil (`clubHome`)
  - Communauté (`clubCommunity`)
  - Rendez-vous (`clubAppointments`)
  - Paiements (`clubPayments`)
  - Profil (`clubProfile`)

### Navigation Bottom adaptée

#### Structure commune
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 flex items-center justify-around shadow-lg z-50">
  {/* Icônes de navigation */}
</div>
```

#### État actif
```tsx
// Icône active
<button className="flex flex-col items-center gap-1 text-[#41B6A6]">
  <Icon className="h-6 w-6" />
  <span className="text-xs">Label</span>
</button>

// Icône inactive
<button className="flex flex-col items-center gap-1 text-gray-600">
  <Icon className="h-6 w-6" />
  <span className="text-xs">Label</span>
</button>
```

---

## 🏆 Système de gamification

### Concepts clés
- **Niveaux** : De 1 à 10, avec progression XP
- **XP** : Points d'expérience gagnés en complétant des tâches
- **Badges** : Récompenses débloquées selon les accomplissements
- **Tâches** : Quotidiennes, hebdomadaires, mensuelles avec récompenses XP
- **Leaderboards** : Classements des éducateurs et clubs

### Couleurs de niveaux
```tsx
// Niveau 1-2 : Bronze
bg-gradient-to-r from-orange-400 to-orange-600

// Niveau 3-4 : Argent
bg-gradient-to-r from-gray-300 to-gray-500

// Niveau 5-6 : Or
bg-gradient-to-r from-yellow-400 to-yellow-600

// Niveau 7-8 : Platine
bg-gradient-to-r from-blue-400 to-blue-600

// Niveau 9-10 : Diamant
bg-gradient-to-r from-purple-400 to-purple-600
```

### Pages de gamification
1. **DogProgressionPage** : Niveau, XP, statistiques, badges du chien
2. **DogTasksPage** : Liste des tâches à compléter avec récompenses
3. **BadgesCollectionPage** : Collection complète des badges
4. **TeacherLeaderboardPage** : Classement des éducateurs (par avis, cours, etc.)
5. **ClubLeaderboardPage** : Classement des clubs (général, cours, événements, avis)

### Points d'accès dans l'app
```tsx
// Badge progression sur carte de chien (MyDogsPage)
<Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-0">
  Niveau {level}
</Badge>

// CTA objectifs du jour (HomePage)
<Card className="cursor-pointer hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Target className="h-5 w-5 text-purple-600" />
      <span>Objectifs du jour</span>
    </div>
    <Badge className="bg-purple-100 text-purple-700 border-0">
      {completedTasks}/{totalTasks}
    </Badge>
  </div>
</Card>

// Badge classements (ClubsPage)
<Card onClick={() => onNavigate('teacherLeaderboard')} className="cursor-pointer">
  <Trophy className="h-5 w-5 text-[#E9B782]" />
  <span>Classement des Éducateurs</span>
</Card>
```

---

## 🔧 Règles techniques

### Composants ShadCN
- Utiliser les composants de `/components/ui` quand disponibles
- Ne PAS créer de versions custom des composants ShadCN
- Importer correctement : `import { Component } from "./components/ui/component"`
- Les composants disponibles : Button, Card, Badge, Input, Label, Textarea, Checkbox, Dialog, Sheet, Tabs, Progress, Avatar, Calendar, Select, etc.

### Structure des fichiers
- Créer des composants séparés dans `/components`
- Un composant = un fichier
- Garder les fichiers concis et lisibles (< 500 lignes idéalement)
- Utiliser des noms descriptifs en PascalCase
- Pattern de nommage : `{Feature}{Type}Page.tsx` (ex: `DogProgressionPage.tsx`)

### TypeScript & Props
```tsx
interface ComponentProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;  // Optional avec ?
  dogId?: number;
  title: string;
}

export function Component({ onNavigate, onBack, dogId, title }: ComponentProps) {
  // ...
}
```

### États React
```tsx
const [state, setState] = useState(initialValue);
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<number | null>(null);
```

### Gestion du scroll

#### Règle d'or
**JAMAIS mettre un élément sticky dans un conteneur avec `overflow-y-auto` !**

#### Structure correcte
```tsx
<div className="flex flex-col h-full">
  {/* Header normal */}
  <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
    <h1 className="text-white">Titre</h1>
  </div>

  {/* Sticky AVANT le conteneur scroll */}
  <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
    <div className="overflow-x-auto">
      <div className="flex gap-2 px-4 min-w-max">
        {/* Éléments */}
      </div>
    </div>
  </div>

  {/* Conteneur scroll SÉPARÉ */}
  <div className="flex-1 overflow-y-auto px-4 py-6">
    {/* Contenu scrollable */}
  </div>
</div>
```

#### Scroll horizontal
```tsx
// Structure à 2 niveaux obligatoire
<div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
  <div className="flex gap-2 min-w-max">
    <button className="flex-shrink-0 whitespace-nowrap">...</button>
  </div>
</div>
```

### Performance
- Utiliser `transition-*` au lieu de `transition-all` quand possible
- Ajouter `will-change-transform` pour les animations complexes
- Utiliser `loading="lazy"` sur les images hors viewport
- Éviter les re-renders inutiles avec `React.memo()` si nécessaire

---

## ✅ Checklist de développement

Avant de finaliser un composant, vérifier :

### Design & Style
- [ ] Les couleurs respectent la palette Smart Dogs
- [ ] Le type d'utilisateur utilise la bonne couleur (Turquoise/Terracotta/Sable)
- [ ] Aucune classe `text-*`, `font-*`, ou `leading-*` n'est utilisée (sauf text-xs et text-sm si nécessaire)
- [ ] Les espacements sont cohérents (gap, padding, space-y)
- [ ] Les transitions sont ajoutées pour les interactions
- [ ] Les border-radius sont cohérents (rounded-lg pour cards, rounded-full pour badges/avatars)
- [ ] Les ombres respectent la hiérarchie (shadow-sm par défaut, shadow-lg pour emphase)

### Images & Icônes
- [ ] `ImageWithFallback` est utilisé pour les images
- [ ] Les icônes viennent de Lucide React
- [ ] Les tailles d'icônes sont standardisées (h-4, h-5, h-6, h-8)
- [ ] Les alt text des images sont descriptifs

### Layout & Navigation
- [ ] Le padding bottom `pb-20` ou `pb-24` est présent pour éviter la bottom nav
- [ ] Les cartes ont `shadow-sm` et `border-0` par défaut
- [ ] Les boutons ont des variants appropriés
- [ ] Les états hover sont définis
- [ ] Le scroll horizontal/vertical fonctionne correctement
- [ ] Les éléments sticky sont positionnés correctement (hors du conteneur overflow-y-auto)

### Code Quality
- [ ] Le code est propre et lisible
- [ ] Les props sont bien typées avec TypeScript
- [ ] Les composants sont bien nommés (PascalCase)
- [ ] Pas de code dupliqué
- [ ] Les fonctions sont bien nommées et descriptives
- [ ] Les imports sont organisés (React, Lucide, composants locaux, UI)

### Accessibilité & UX
- [ ] Les boutons ont des labels clairs
- [ ] Les zones cliquables sont suffisamment grandes (min 44x44px)
- [ ] Les inputs ont des labels associés
- [ ] Les états de chargement sont gérés
- [ ] Les états d'erreur sont gérés
- [ ] Les feedbacks visuels sont présents (hover, active, disabled)

---

## 🎯 Style et ton

### Général
- **Moderne** : Design épuré, espacé, aéré, flat design
- **Chaleureux** : Couleurs douces, arrondis généreux, emojis occasionnels
- **Rassurant** : Feedback visuel clair, états bien définis, confirmations
- **Ludique** : Gamification avec badges et récompenses, animations subtiles

### Par type d'utilisateur
- **Interface utilisateur** : Turquoise (#41B6A6), friendly, accessible, focus sur la progression et l'apprentissage
- **Interface éducateur** : Terracotta (#F28B6F), professionnel, moderne, focus sur la performance et les statistiques
- **Interface club** : Sable (#E9B782), élégant, organisé, focus sur la gestion et la communauté

### Gamification
- **Motivant** : Feedback positif, célébrations de réussite, encouragements
- **Progressif** : Objectifs clairs, récompenses régulières, paliers visibles
- **Compétitif** : Classements, comparaisons amicales, podiums
- **Visuel** : Badges colorés, animations de progression, confettis virtuels

### Ton éditorial
- **Titres** : Courts, directs, orientés action
- **Descriptions** : Claires, concises, bénéfices mis en avant
- **CTAs** : Verbes d'action à l'infinitif ("Commencer", "Réserver", "Découvrir")
- **Messages d'erreur** : Positifs, orientés solution

---

## 📚 Documentation complémentaire

### Ressources internes
- **GuidelinesPage.tsx** : Exemples visuels interactifs de tous les composants
- **DESIGN_SYSTEM.md** : Documentation technique supplémentaire
- **Components** : Consulter les fichiers existants pour des exemples d'implémentation réels

### Workflow recommandé
1. Consulter les Guidelines pour les patterns
2. Regarder les composants existants similaires
3. Utiliser les composants ShadCN quand disponibles
4. Tester le responsive et le scroll
5. Vérifier la checklist avant commit

### Conventions de code
- **Indentation** : 2 espaces
- **Quotes** : Doubles quotes `"` pour JSX, simples `'` pour JS
- **Point-virgules** : Non (sauf si nécessaire)
- **Trailing commas** : Oui
- **Max line length** : 120 caractères

---

*Dernière mise à jour : Novembre 2025*  
*Version : 3.0 - Audit complet et documentation exhaustive*  
*Tous les gradients, couleurs et 100+ icônes documentés*
