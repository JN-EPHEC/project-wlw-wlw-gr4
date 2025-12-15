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
    
    console.log('Looking for events with clubId:', wrongClubId);
    
    const snapshot = await db.collection('events').where('clubId', '==', wrongClubId).get();
    console.log('Found', snapshot.size, 'events with typo clubId');
    
    if (snapshot.size > 0) {
      let updated = 0;
      snapshot.forEach(async (doc) => {
        await doc.ref.update({
          clubId: correctClubId,
          updatedAt: admin.firestore.Timestamp.now()
        });
        updated++;
        console.log('✅ Updated event:', doc.id);
      });
      
      console.log('\n✅ Fixed', updated, 'events');
    } else {
      console.log('No events found with typo clubId');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
