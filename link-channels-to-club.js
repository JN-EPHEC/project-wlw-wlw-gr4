const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyD0t6-eSS5TnfUaANBrdlqvQvk1vXnYPJM",
  authDomain: "ephec-smartdogs.firebaseapp.com",
  projectId: "ephec-smartdogs",
  storageBucket: "ephec-smartdogs.appspot.com",
  messagingSenderId: "1022913048387",
  appId: "1:1022913048387:web:2fed7c1221d0fbe19af62c"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CLUB_ID = '12IUbeQluFP9tiQDxJo0'; // Puppy Paradise
const USER_ID = 'PTH1bGmQ5IXYPkLALSQ0ZLantyT2'; // Utilisateur actuel

async function linkChannelsToClub() {
  console.log(`\n🔗 Linking channels to club: ${CLUB_ID}`);
  console.log(`👤 Adding user as member: ${USER_ID}\n`);

  try {
    console.log('✅ Firebase initialized');

    // Récupérer tous les salons
    const channelsCollection = collection(db, 'channels');
    const channelsSnap = await getDocs(channelsCollection);
    
    if (channelsSnap.empty) {
      console.log('❌ No channels found');
      process.exit(0);
    }

    console.log(`📊 Found ${channelsSnap.size} channels\n`);

    let updated = 0;
    let errors = 0;

    // Mettre à jour chaque salon
    for (const docSnap of channelsSnap.docs) {
      try {
        const channelData = docSnap.data();
        const channelId = docSnap.id;
        const channelName = channelData.name || 'Unnamed';

        // Préparer les données à mettre à jour
        const updateData = {
          clubId: CLUB_ID,
        };

        // Ajouter l'utilisateur aux membres s'il ne l'est pas déjà
        const members = channelData.members || [];
        if (!members.includes(USER_ID)) {
          updateData.members = arrayUnion(USER_ID);
        }

        // Mettre à jour le document
        const channelRef = doc(db, 'channels', channelId);
        await updateDoc(channelRef, updateData);
        
        const memberCount = members.length + (members.includes(USER_ID) ? 0 : 1);
        
        console.log(`✅ Updated channel: "${channelName}"`);
        console.log(`   └─ ID: ${channelId}`);
        console.log(`   └─ clubId: ${CLUB_ID}`);
        console.log(`   └─ members: ${memberCount}`);
        console.log(`   └─ type: ${channelData.type || 'chat'}\n`);

        updated++;
      } catch (err) {
        console.error(`❌ Error updating channel ${docSnap.id}:`, err.message);
        errors++;
      }
    }

    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);
    
    if (updated > 0) {
      console.log(`\n🎉 All channels are now linked to club!`);
      console.log(`✅ Channels are ready to be queried in the app!\n`);
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

linkChannelsToClub();
