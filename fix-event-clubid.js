const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-f1f0db8690.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

(async () => {
  try {
    const wrongClubId = 'l2lUbeGluFP9tiQDxJo0';
    const correctClubId = '12IUbeQluFP9tiQDxJo0';
    
    console.log('\n🔍 Looking for events with clubId:', wrongClubId);
    console.log('Will replace with:', correctClubId);
    
    const snapshot = await db.collection('events').where('clubId', '==', wrongClubId).get();
    console.log('Found', snapshot.size, 'events with typo clubId\n');
    
    if (snapshot.size > 0) {
      const batch = db.batch();
      let updated = 0;
      
      snapshot.forEach((doc) => {
        console.log('  Fixing event:', doc.id, '-', doc.data().title);
        batch.update(doc.ref, {
          clubId: correctClubId,
          updatedAt: admin.firestore.Timestamp.now()
        });
        updated++;
      });
      
      await batch.commit();
      console.log('\n✅ Successfully fixed', updated, 'event(s)!');
    } else {
      console.log('ℹ️  No events found with typo clubId');
      console.log('   Events may already be corrected');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
})();
