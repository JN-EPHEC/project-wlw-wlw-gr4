const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Charger la config Firebase depuis firebase_env.js
const firebaseEnvPath = path.join(__dirname, '../firebase_env.js');
let firebaseConfig;

try {
  // Lecture du fichier et extraction de la config
  const envContent = fs.readFileSync(firebaseEnvPath, 'utf8');
  const match = envContent.match(/export const firebaseConfig = ({[\s\S]*?});/);
  
  if (!match) {
    throw new Error('Config Firebase non trouvée');
  }
  
  // Parser la config
  firebaseConfig = eval('(' + match[1] + ')');
} catch (error) {
  console.error('❌ Erreur: Impossible de charger firebase_env.js');
  console.error(error.message);
  process.exit(1);
}

// Chercher le fichier de credentials service account
let serviceAccount;
const possiblePaths = [
  path.join(__dirname, '../firebaseConfig.json'),
  path.join(__dirname, '../serviceAccountKey.json'),
  path.join(__dirname, '../firebase-adminsdk.json'),
  path.join(__dirname, '../ephec-smartdogs-firebase-adminsdk-fbsvc-f1f0db8690.json'),
];

for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    try {
      serviceAccount = require(filePath);
      console.log(`✅ Credentials trouvées: ${filePath}`);
      break;
    } catch (e) {
      console.warn(`⚠️  Erreur en lisant ${filePath}`);
    }
  }
}

if (!serviceAccount) {
  console.error('❌ Erreur: Aucun fichier de credentials trouvé!');
  console.error('\nLes fichiers cherchés:');
  possiblePaths.forEach(p => console.error(`  - ${p}`));
  console.error('\n📝 Tu dois créer un fichier firebaseConfig.json avec tes credentials Firebase Admin SDK');
  console.error('   1. Va sur: https://console.firebase.google.com/');
  console.error('   2. Sélectionne ton projet');
  console.error('   3. Paramètres → Comptes de service → Générer une nouvelle clé privée');
  console.error('   4. Sauvegarde le fichier JSON à la racine du projet');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Fonction pour importer un club
async function importClub(clubData) {
  try {
    const docRef = await db.collection('club').add({
      ...clubData,
      createdAt: new Date(clubData.createdAt),
      updatedAt: new Date(clubData.updatedAt || clubData.createdAt),
    });
    console.log(`✅ Club importé: ${clubData.name} (ID: ${docRef.id})`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Erreur lors de l'import de ${clubData.name}:`, error);
    throw error;
  }
}

// Fonction pour importer plusieurs clubs depuis un tableau
async function importClubs(clubsData) {
  console.log(`\n🚀 Démarrage de l'import de ${clubsData.length} club(s)...\n`);

  const results = {
    success: 0,
    failed: 0,
    ids: [],
  };

  for (const club of clubsData) {
    try {
      const id = await importClub(club);
      results.success++;
      results.ids.push(id);
    } catch (error) {
      results.failed++;
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ Succès: ${results.success}`);
  console.log(`   ❌ Échoué: ${results.failed}`);
  console.log(`\nIDs créés:`, results.ids);

  await admin.app().delete();
  process.exit(results.failed > 0 ? 1 : 0);
}

// Lire le fichier clubs_import.json
const clubsFilePath = path.join(__dirname, '../clubs_import.json');

if (!fs.existsSync(clubsFilePath)) {
  console.error('❌ Erreur: clubs_import.json non trouvé');
  console.error(`Chemin attendu: ${clubsFilePath}`);
  console.error('\nCrée un fichier clubs_import.json avec un tableau de clubs');
  process.exit(1);
}

try {
  const clubsData = JSON.parse(fs.readFileSync(clubsFilePath, 'utf8'));
  
  if (!Array.isArray(clubsData)) {
    console.error('❌ Erreur: clubs.json doit contenir un tableau de clubs');
    process.exit(1);
  }

  importClubs(clubsData);
} catch (error) {
  console.error('❌ Erreur lors de la lecture de clubs.json:', error);
  process.exit(1);
}
