const admin = require('firebase-admin');
const serviceAccount = require('./ephec-smartdogs-firebase-adminsdk-fbsvc-f1f0db8690.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

(async () => {
  try {
    const clubId = '12IUbeQluFP9tiQDxJo0';
    console.log('\n=== Checking for events ===');
    console.log('Looking for events with clubId:', clubId);
    
    // Get ALL events first
    const allSnapshot = await db.collection('events').get();
    console.log('\nTotal events in DB:', allSnapshot.size);
    
    // Then filter by clubId
    const snapshot = await db.collection('events').where('clubId', '==', clubId).get();
    console.log('Events found with this clubId:', snapshot.size);
    
    if (snapshot.size > 0) {
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log('\n✅ Event found:');
        console.log('  ID:', doc.id);
        console.log('  Title:', data.title);
        console.log('  ClubId:', data.clubId);
        console.log('  StartDate:', data.startDate);
        console.log('  EducatorId:', data.educatorId);
        console.log('  Address:', data.address);
      });
    } else {
      console.log('\n❌ No events found for this clubId');
      console.log('\nAll events in DB:');
      allSnapshot.forEach(doc => {
        const data = doc.data();
        console.log('  -', doc.id, ':', data.title, '(clubId:', data.clubId + ')');
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
