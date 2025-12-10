# Script de Nettoyage des Salons

Ce script supprime tous les salons en doublons, en gardant seulement:
- `salon1`
- `Général`

## Installation

### 1. Installer firebase-admin
```bash
npm install firebase-admin
```

### 2. Obtenir la clé Firebase

1. Va sur https://console.firebase.google.com
2. Sélectionne ton projet
3. Va à **Paramètres du projet** (⚙️ en haut à gauche)
4. Onglet **Comptes de service**
5. Clique **Générer une nouvelle clé privée**
6. Un fichier JSON se télécharge

### 3. Placer la clé

Place le fichier téléchargé dans le dossier du projet et renomme-le en:
```
firebase-service-account.json
```

### 4. Lancer le script

```bash
node cleanup-channels.js
```

## Sécurité

⚠️ **Ce script supprime des données définitivement!**
- Sauvegarde tes données avant si besoin
- Le script demande PAS de confirmation (attention!)
- Teste d'abord sur une base de test si possible

## Exemple de sortie

```
🧹 Nettoyage des salons en cours...

📊 Total de salons trouvés: 27

✅ CONSERVÉ: "Général" (ID: abc123)
✅ CONSERVÉ: "salon1" (ID: def456)
❌ SUPPRESSION: "Général 2" (ID: ghi789)
❌ SUPPRESSION: "Général 3" (ID: jkl012)
... (autres suppressions)

🎉 Nettoyage terminé!
   Conservés: 2 salon(s)
   Supprimés: 25 salon(s)
```
