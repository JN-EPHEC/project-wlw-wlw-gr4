import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Import your existing Firebase config
// Make sure this file exists and has your firebaseConfig exported
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addEducatorIdsToClubs() {
  try {
    console.log('🚀 Starting to add educatorIds to clubs...');

    // Fetch all clubs (try both 'clubs' and 'club' collections)
    let clubsSnapshot;
    try {
      clubsSnapshot = await getDocs(collection(db, 'clubs'));
      if (clubsSnapshot.empty) {
        console.log('⚠️ No clubs found in "clubs" collection, trying "club"...');
        clubsSnapshot = await getDocs(collection(db, 'club'));
      }
    } catch (error) {
      console.log('⚠️ "clubs" collection not found, trying "club"...');
      clubsSnapshot = await getDocs(collection(db, 'club'));
    }

    if (clubsSnapshot.empty) {
      console.log('❌ No clubs found in either collection');
      process.exit(1);
    }

    console.log(`📊 Found ${clubsSnapshot.size} clubs`);

    let updated = 0;
    let skipped = 0;

    for (const clubDoc of clubsSnapshot.docs) {
      const clubData = clubDoc.data();
      const clubId = clubDoc.id;

      // Check if educatorIds already exists
      if (clubData.educatorIds && Array.isArray(clubData.educatorIds)) {
        console.log(`⏭️  [${clubId}] Already has educatorIds: ${clubData.educatorIds.join(', ')}`);
        skipped++;
        continue;
      }

      // Check if educatorId exists
      if (!clubData.educatorId) {
        console.log(`⚠️  [${clubId}] No educatorId found, skipping...`);
        skipped++;
        continue;
      }

      // Create educatorIds array with the current educatorId
      const educatorIds = [clubData.educatorId];

      // Update the club document
      const clubRef = doc(db, clubsSnapshot.docs[0].ref.path.split('/')[0], clubId);
      await updateDoc(clubRef, {
        educatorIds: educatorIds,
      });

      console.log(`✅ [${clubId}] Updated with educatorIds: ${educatorIds.join(', ')}`);
      updated++;
    }

    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`\n✨ Done!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addEducatorIdsToClubs();
