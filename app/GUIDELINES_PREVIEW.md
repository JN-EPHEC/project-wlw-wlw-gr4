# Smart Dogs Design System - Preview

## 🎨 Couleurs principales

### Palette
- **Turquoise** `#41B6A6` - Couleur principale
- **Sable** `#E9B782` - Couleur secondaire  
- **Terracotta** `#F28B6F` - Couleur tertiaire

### Dégradés
- Turquoise: `from-[#41B6A6] to-[#359889]` (Headers utilisateur)
- Sable: `from-[#E9B782] to-[#d9a772]` (Headers club)
- Premium: `from-yellow-400 via-orange-400 to-orange-500` (Boost)

## 🧩 Composants clés

### Boutons
```tsx
<Button className="bg-[#41B6A6] hover:bg-[#359889] text-white">Turquoise</Button>
<Button className="rounded-full">Arrondi</Button>
```

### Cartes
```tsx
<Card className="p-6 shadow-sm border-0">Standard</Card>
<Card className="p-6 shadow-lg border-0">Avec ombre</Card>
```

### Badges
```tsx
<Badge className="bg-[#41B6A6] text-white border-0">Badge</Badge>
```

## 📐 Espacements

- `gap-2` (8px) - Petit
- `gap-4` (16px) - Standard
- `gap-6` (24px) - Large
- `p-4` (16px) - Padding standard
- `p-6` (24px) - Padding large

## 🎯 Patterns

### Header utilisateur
```tsx
<div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl">
  <h1 className="text-white">Titre</h1>
</div>
```

### Header club
```tsx
<div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl">
  <h1 className="text-white">Titre</h1>
</div>
```

## ⚠️ Règles importantes

1. **Typographie**: Ne PAS utiliser `text-*`, `font-*`, `leading-*` classes
2. **Cartes**: Toujours utiliser `shadow-sm border-0` par défaut
3. **Images**: Utiliser `ImageWithFallback` component
4. **Icônes**: Uniquement Lucide React
5. **Mobile**: Toujours ajouter `pb-20` pour éviter la bottom nav

## 📱 Responsive

- Mobile first approach
- Desktop: grilles adaptatives avec `md:` et `lg:` breakpoints
- iPhone 15 Pro simulation: `w-[393px] h-[852px]`
