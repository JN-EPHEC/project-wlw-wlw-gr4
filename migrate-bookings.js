const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-e54019135e.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateBookings(dryRun = true) {
  try {
    console.log(`\n🚀 Migration des Bookings ${dryRun ? '(DRY RUN)' : '(APPLIQUÉ)'}\n`);

    const bookingsRef = db.collection('Bookings');
    const snapshot = await bookingsRef.get();

    console.log(`📊 Total de Bookings trouvés: ${snapshot.docs.length}\n`);

    let updated = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
      try {
        const data = doc.data();
        const updates = {};
        let hasChanges = false;

        // 1. Convertir userId en userIds (array)
        if (data.userId && !data.userIds) {
          updates.userIds = [data.userId];
          console.log(`✅ ${doc.id}: userId → userIds: [${data.userId}]`);
          hasChanges = true;
        } else if (!data.userIds && !data.userId) {
          updates.userIds = [];
          console.log(`⚠️  ${doc.id}: Aucun userId/userIds, défaut à array vide`);
          hasChanges = true;
        }

        // 2. Ajouter fieldId si manquant
        if (!data.fieldId) {
          updates.fieldId = 'field_not_assigned';
          console.log(`⚠️  ${doc.id}: fieldId manquant, défaut à 'field_not_assigned'`);
          hasChanges = true;
        }

        // 3. Ajouter paymentIds si manquant
        if (!data.paymentIds) {
          updates.paymentIds = [];
          console.log(`⚠️  ${doc.id}: paymentIds manquant, défaut à array vide`);
          hasChanges = true;
        }

        // 4. Ajouter reviewIds si manquant
        if (!data.reviewIds) {
          updates.reviewIds = [];
          console.log(`⚠️  ${doc.id}: reviewIds manquant, défaut à array vide`);
          hasChanges = true;
        }

        // 5. Ajouter isGroupCourse si manquant (défaut: true pour collectif)
        if (data.isGroupCourse === undefined) {
          updates.isGroupCourse = true;
          console.log(`⚠️  ${doc.id}: isGroupCourse manquant, défaut à true (collectif)`);
          hasChanges = true;
        }

        // 6. Ajouter type si manquant
        if (!data.type) {
          updates.type = 'club-based';
          console.log(`⚠️  ${doc.id}: type manquant, défaut à 'club-based'`);
          hasChanges = true;
        }

        // 7. Ajouter updatedAt si on modifie
        if (hasChanges) {
          updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        }

        // Appliquer les modifications
        if (hasChanges) {
          if (!dryRun) {
            await bookingsRef.doc(doc.id).update(updates);
            console.log(`   → Sauvegardé ✓\n`);
          } else {
            console.log(`   → (DRY RUN - pas appliqué)\n`);
          }
          updated++;
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${doc.id}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📈 RÉSUMÉ`);
    console.log(`   Bookings modifiés: ${updated}/${snapshot.docs.length}`);
    console.log(`   Erreurs: ${errors}`);

    if (dryRun) {
      console.log(`\n💡 C'était un DRY RUN. Pour appliquer, lance:`);
      console.log(`   node migrate-bookings.js --apply\n`);
    } else {
      console.log(`\n✅ Migration terminée!\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    process.exit(1);
  }
}

// Vérifier les arguments
const isApply = process.argv.includes('--apply');
const dryRun = !isApply;

if (dryRun) {
  console.log(`\n⚠️  MODE DRY RUN (aucune modification)\n`);
}

migrateBookings(dryRun);
