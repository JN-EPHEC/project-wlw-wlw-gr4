const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-db1069b7aa.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addMembersFields(dryRun = true) {
  try {
    console.log(`\n🚀 Ajout des champs members et pendingMembers ${dryRun ? '(DRY RUN)' : '(APPLIQUÉ)'}\n`);

    const clubsRef = db.collection('club');
    const snapshot = await clubsRef.get();

    console.log(`📊 Total de clubs trouvés: ${snapshot.docs.length}\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
      try {
        const data = doc.data();
        const clubName = data.name || doc.id;
        const updates = {};
        let needsUpdate = false;

        // Ajouter members s'il n'existe pas
        if (!data.members) {
          updates.members = [];
          needsUpdate = true;
          console.log(`  ✅ ${clubName} : members sera ajouté`);
        } else {
          console.log(`  ⏭️  ${clubName} : members existe déjà (${data.members.length} membres)`);
        }

        // Ajouter pendingMembers s'il n'existe pas
        if (!data.pendingMembers) {
          updates.pendingMembers = [];
          needsUpdate = true;
          console.log(`  ✅ ${clubName} : pendingMembers sera ajouté`);
        } else {
          console.log(`  ⏭️  ${clubName} : pendingMembers existe déjà (${data.pendingMembers.length} demandes)`);
        }

        if (needsUpdate) {
          if (!dryRun) {
            await clubsRef.doc(doc.id).update(updates);
            console.log(`  💾 ${clubName} : UPDATED\n`);
          } else {
            console.log(`  [DRY RUN] Serait mis à jour\n`);
          }
          updated++;
        } else {
          skipped++;
          console.log(`\n`);
        }
      } catch (error) {
        console.error(`❌ Erreur pour le club ${doc.id}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📈 Résumé:`);
    console.log(`  ✅ Clubs à mettre à jour: ${updated}`);
    console.log(`  ⏭️  Clubs déjà OK: ${skipped}`);
    console.log(`  ❌ Erreurs: ${errors}`);
    console.log(`\n${dryRun ? '✨ DRY RUN terminé. Relancez sans --dry-run pour appliquer.' : '✨ Migration terminée!'}\n`);

    process.exit(0);
  } catch (error) {
    console.error('Erreur critique:', error);
    process.exit(1);
  }
}

// Vérifier les arguments
const args = process.argv.slice(2);
const isDryRun = !args.includes('--apply');

if (isDryRun) {
  console.log('💡 Conseil: Lancez avec --apply pour vraiment modifier la BDD');
}

addMembersFields(isDryRun);
