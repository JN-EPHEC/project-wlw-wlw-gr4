const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-c3e76b57fe.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('✅ Firebase initialisé avec credentials valides\n');

const db = admin.firestore();

async function migrateBookingsComplete(dryRun = true) {
  try {
    console.log(`\n🚀 Migration COMPLÈTE des Bookings ${dryRun ? '(DRY RUN)' : '(APPLIQUÉ)'}\n`);
    console.log(`⚠️  Cela va SUPPRIMER les champs actuels et les REMPLACER par la nouvelle structure\n`);

    const bookingsRef = db.collection('Bookings');
    const snapshot = await bookingsRef.get();

    console.log(`📊 Total de Bookings trouvés: ${snapshot.docs.length}\n`);

    let updated = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
      try {
        const oldData = doc.data();
        
        console.log(`📝 Traitement: ${doc.id}`);
        console.log(`   Anciens champs: ${Object.keys(oldData).join(', ')}`);

        // NOUVELLE STRUCTURE COMPLÈTE
        const newData = {
          // ====== IDs & RÉFÉRENCES ======
          id: doc.id,
          clubId: oldData.clubId || 'MISSING',
          educatorId: oldData.educatorId || 'MISSING',
          fieldId: oldData.terrainID || oldData.fieldId || 'field_not_assigned',
          
          // ====== PARTICIPANTS (ARRAY) ======
          userIds: oldData.userId ? [oldData.userId] : (oldData.userIds || []),
          maxParticipants: oldData.maxParticipants || 1,
          
          // ====== INFOS DU COURS ======
          title: oldData.title || 'Cours',
          description: oldData.description || '',
          trainingType: oldData.trainingType || 'general',
          isGroupCourse: oldData.isGroupCourse !== undefined ? oldData.isGroupCourse : (oldData.currentParticipants > 1 ? true : false),
          
          // ====== DATES & HORAIRES ======
          sessionDate: oldData.sessionDate || admin.firestore.FieldValue.serverTimestamp(),
          duration: oldData.duration || 60,
          
          // ====== CHIENS & INFOS ======
          dogIds: oldData.dogId ? [oldData.dogId] : (oldData.dogIds || []),
          
          // ====== PAIEMENT ======
          price: oldData.price || 0,
          totalPrice: oldData.totalPrice || (oldData.price * (oldData.currentParticipants || 1) || 0),
          paymentIds: oldData.paymentIds || [],
          currency: oldData.currency || 'EUR',
          paid: oldData.paid || false,
          
          // ====== STATUTS & WORKFLOW ======
          status: oldData.status || 'pending',
          type: oldData.type || 'club-based',
          requestedTeacher: oldData.requestedTeacher || null,
          rejectionReason: oldData.rejectionReason || null,
          rejectedAt: oldData.rejectedAt || null,
          confirmedAt: oldData.confirmedAt || null,
          completedAt: oldData.completedAt || null,
          
          // ====== AVIS & FEEDBACK ======
          reviewIds: oldData.reviewIds || [],
          
          // ====== AUDIT ======
          createdAt: oldData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        console.log(`   Nouveaux champs: ${Object.keys(newData).join(', ')}`);
        console.log(`   Champs supprimés: ${Object.keys(oldData).filter(k => !Object.keys(newData).includes(k)).join(', ') || 'aucun'}`);

        if (!dryRun) {
          // Supprimer le document et le recréer (ou utiliser set avec merge:false)
          await bookingsRef.doc(doc.id).set(newData, { merge: false });
          console.log(`   ✅ Sauvegardé\n`);
        } else {
          console.log(`   ℹ️  (DRY RUN - pas appliqué)\n`);
        }
        updated++;
      } catch (error) {
        console.error(`❌ Erreur pour ${doc.id}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📈 RÉSUMÉ`);
    console.log(`   Bookings traités: ${updated}/${snapshot.docs.length}`);
    console.log(`   Erreurs: ${errors}`);

    if (dryRun) {
      console.log(`\n💡 C'était un DRY RUN. Pour appliquer, lance:`);
      console.log(`   node migrate-bookings-complete.js --apply\n`);
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

migrateBookingsComplete(dryRun);
