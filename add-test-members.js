const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-db1069b7aa.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addTestMembers(dryRun = true) {
  try {
    console.log(`\n🚀 Ajout de fausses données dans members ${dryRun ? '(DRY RUN)' : '(APPLIQUÉ)'}\n`);

    // Fausses données de test
    const testMembers = [
      {
        userId: "member_1",
        joinDate: admin.firestore.Timestamp.fromDate(new Date("2025-11-01")),
        role: "member"
      },
      {
        userId: "member_2",
        joinDate: admin.firestore.Timestamp.fromDate(new Date("2025-10-15")),
        role: "member"
      },
      {
        userId: "member_3",
        joinDate: admin.firestore.Timestamp.fromDate(new Date("2025-09-20")),
        role: "educator"
      },
      {
        userId: "member_4",
        joinDate: admin.firestore.Timestamp.fromDate(new Date("2025-08-10")),
        role: "owner"
      }
    ];

    const clubRef = db.collection('club').doc('12IUbeQluFP9tiQDxJo0');
    const clubDoc = await clubRef.get();

    if (!clubDoc.exists) {
      console.error('❌ Club non trouvé avec l\'ID: 12IUbeQluFP9tiQDxJo0');
      process.exit(1);
    }

    const clubName = clubDoc.data().name || 'Club inconnu';
    console.log(`Club trouvé: ${clubName}\n`);

    if (!dryRun) {
      await clubRef.update({
        members: testMembers
      });
      console.log(`💾 ${clubName} : UPDATED avec ${testMembers.length} membres\n`);
    } else {
      console.log(`[DRY RUN] Serait ajouté au ${clubName}:`);
      testMembers.forEach((member, index) => {
        console.log(`  ${index + 1}. userId: ${member.userId}, joinDate: ${member.joinDate.toDate().toLocaleDateString('fr-FR')}, role: ${member.role}`);
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

addTestMembers(isDryRun);
