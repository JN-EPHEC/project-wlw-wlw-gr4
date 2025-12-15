const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-db1069b7aa.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addTestPendingMembers(dryRun = true) {
  try {
    console.log(`\n🚀 Ajout de fausses données dans pendingMembers ${dryRun ? '(DRY RUN)' : '(APPLIQUÉ)'}\n`);

    // Fausses données de test
    const testPendingMembers = [
      {
        userId: "user_test_1",
        requestDate: admin.firestore.Timestamp.fromDate(new Date("2025-12-10"))
      },
      {
        userId: "user_test_2",
        requestDate: admin.firestore.Timestamp.fromDate(new Date("2025-12-12"))
      },
      {
        userId: "user_test_3",
        requestDate: admin.firestore.Timestamp.fromDate(new Date("2025-12-14"))
      }
    ];

    const clubRef = db.collection('club').doc('12IUbeQluFP9tiQDxJo0');
    const clubDoc = await clubRef.get();

    if (!clubDoc.exists) {
      console.error('❌ Club non trouvé avec l\'ID: 12lUbeQLrFP9tQDxJo0');
      process.exit(1);
    }

    const clubName = clubDoc.data().name || 'Club inconnu';
    console.log(`Club trouvé: ${clubName}\n`);

    if (!dryRun) {
      await clubRef.update({
        pendingMembers: testPendingMembers
      });
      console.log(`💾 ${clubName} : UPDATED avec ${testPendingMembers.length} demandes d'adhésion\n`);
    } else {
      console.log(`[DRY RUN] Serait ajouté au ${clubName}:`);
      testPendingMembers.forEach((member, index) => {
        console.log(`  ${index + 1}. userId: ${member.userId}, requestDate: ${member.requestDate.toDate().toLocaleDateString('fr-FR')}`);
      });
    }

    console.log(`\n✨ ${dryRun ? 'DRY RUN terminé' : 'Données ajoutées'}!\n`);
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

// Vérifier les arguments
const args = process.argv.slice(2);
const isDryRun = !args.includes('--apply');

if (isDryRun) {
  console.log('💡 Conseil: Lancez avec --apply pour vraiment modifier la BDD');
}

addTestPendingMembers(isDryRun);
