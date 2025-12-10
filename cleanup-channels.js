const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-e54019135e.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanupChannels() {
  try {
    console.log('🧹 Nettoyage des salons en cours...\n');

    // Get all channels
    const channelsRef = db.collection('channels');
    const snapshot = await channelsRef.get();

    console.log(`📊 Total de salons trouvés: ${snapshot.docs.length}\n`);

    let deleted = 0;
    let kept = 0;
    const keepIds = new Set();
    const channelsByName = {};

    // First pass: group channels by name and find which ones to keep
    snapshot.docs.forEach((doc) => {
      const channel = doc.data();
      const channelName = (channel.name || 'Sans nom').toLowerCase();
      
      if (!channelsByName[channelName]) {
        channelsByName[channelName] = [];
      }
      channelsByName[channelName].push(doc.id);
    });

    // Keep only the first occurrence of each desired channel
    if (channelsByName['salon1'] && channelsByName['salon1'].length > 0) {
      keepIds.add(channelsByName['salon1'][0]);
    }
    if (channelsByName['general'] && channelsByName['general'].length > 0) {
      keepIds.add(channelsByName['general'][0]);
    }

    // Second pass: delete all others
    for (const doc of snapshot.docs) {
      const channel = doc.data();
      const channelName = channel.name || 'Sans nom';

      if (keepIds.has(doc.id)) {
        console.log(`✅ CONSERVÉ: "${channelName}" (ID: ${doc.id})`);
        kept++;
      } else {
        console.log(`❌ SUPPRESSION: "${channelName}" (ID: ${doc.id})`);
        await channelsRef.doc(doc.id).delete();
        deleted++;
      }
    }

    console.log(`\n🎉 Nettoyage terminé!`);
    console.log(`   Conservés: ${kept} salon(s)`);
    console.log(`   Supprimés: ${deleted} salon(s)`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    process.exit(1);
  }
}

cleanupChannels();
