const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-db1069b7aa.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addUserAsMember(email, dryRun = true) {
  try {
    console.log(`\n🚀 Ajout de l'utilisateur ${email} comme membre du club ${dryRun ? '(DRY RUN)' : '(APPLIQUÉ)'}\n`);

    // 1. Trouver l'utilisateur par email
    console.log(`🔍 Recherche de l'utilisateur avec l'email: ${email}`);
    const usersRef = admin.firestore().collection('users');
    const userSnapshot = await usersRef.where('email', '==', email).get();

    if (userSnapshot.empty) {
      console.error(`❌ Utilisateur avec l'email ${email} non trouvé`);
      process.exit(1);
    }

    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    console.log(`✅ Utilisateur trouvé:`);
    console.log(`   ID: ${userId}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Nom: ${userData.firstName} ${userData.lastName}\n`);

    // 2. Ajouter l'utilisateur aux members du club
    const clubId = '12IUbeQluFP9tiQDxJo0'; // Puppy Paradise
    const clubRef = db.collection('club').doc(clubId);
    const clubDoc = await clubRef.get();

    if (!clubDoc.exists) {
      console.error('❌ Club non trouvé');
      process.exit(1);
    }

    const clubData = clubDoc.data();
    const clubName = clubData.name || 'Club inconnu';
    console.log(`📚 Club trouvé: ${clubName}`);

    // Vérifier si l'utilisateur est déjà membre
    const members = clubData.members || [];
    const alreadyMember = members.some(m => m.userId === userId);

    if (alreadyMember) {
      console.log(`⏭️  L'utilisateur est déjà membre du club`);
      process.exit(0);
    }

    // Ajouter l'utilisateur comme membre
    const newMember = {
      userId: userId,
      joinDate: admin.firestore.Timestamp.now(),
      role: 'member'
    };

    const updatedMembers = [...members, newMember];

    if (!dryRun) {
      await clubRef.update({
        members: updatedMembers
      });
      console.log(`\n💾 ${clubName} : UPDATED`);
      console.log(`✅ L'utilisateur a été ajouté comme membre`);
    } else {
      console.log(`\n[DRY RUN] Serait ajouté comme membre:`);
      console.log(`   Role: ${newMember.role}`);
      console.log(`   Date d'adhésion: ${newMember.joinDate.toDate().toLocaleDateString('fr-FR')}`);
    }

    console.log(`\n✨ ${dryRun ? 'DRY RUN terminé' : 'Opération réussie'}!\n`);
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

// Vérifier les arguments
const args = process.argv.slice(2);
const email = 'victormarchetti08@gmail.com';
const isDryRun = !args.includes('--apply');

if (isDryRun) {
  console.log('💡 Conseil: Lancez avec --apply pour vraiment modifier la BDD');
}

addUserAsMember(email, isDryRun);
