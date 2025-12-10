const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Charger la config Firebase
const firebaseEnvPath = path.join(__dirname, '../firebase_env.js');
let firebaseConfig;

try {
  const envContent = fs.readFileSync(firebaseEnvPath, 'utf8');
  const match = envContent.match(/export const firebaseConfig = ({[\s\S]*?});/);
  
  if (!match) {
    throw new Error('Config Firebase non trouvée');
  }
  
  firebaseConfig = eval('(' + match[1] + ')');
} catch (error) {
  console.error('❌ Erreur: Impossible de charger firebase_env.js');
  console.error(error.message);
  process.exit(1);
}

// Chercher le fichier de credentials
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
  process.exit(1);
}

// Initialiser Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function checkCollections() {
  console.log('\n📊 Vérification des collections Firebase...\n');
  
  try {
    // Vérifier club
    const clubsSnap = await db.collection('club').limit(3).get();
    console.log(`\n📍 Collection "club": ${clubsSnap.size} documents trouvés`);
    clubsSnap.forEach(doc => {
      console.log(`  - ID: ${doc.id}`);
      const data = doc.data();
      console.log(`    Champs: ${Object.keys(data).join(', ')}`);
      console.log(`    Nom: ${data.name}`);
      console.log(`    Rating: ${data.averageRating}`);
    });

    // Vérifier educators
    const editorsSnap = await db.collection('educators').limit(3).get();
    console.log(`\n👨‍🏫 Collection "educators": ${editorsSnap.size} documents trouvés`);
    editorsSnap.forEach(doc => {
      console.log(`  - ID: ${doc.id}`);
      const data = doc.data();
      console.log(`    Champs: ${Object.keys(data).join(', ')}`);
      console.log(`    Nom: ${data.firstName} ${data.lastName}`);
    });

    // Vérifier events
    const eventsSnap = await db.collection('events').limit(3).get();
    console.log(`\n🎉 Collection "events": ${eventsSnap.size} documents trouvés`);
    eventsSnap.forEach(doc => {
      console.log(`  - ID: ${doc.id}`);
      const data = doc.data();
      console.log(`    Champs: ${Object.keys(data).join(', ')}`);
      console.log(`    Titre: ${data.title}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  }

  await admin.app().delete();
  process.exit(0);
}

checkCollections();
