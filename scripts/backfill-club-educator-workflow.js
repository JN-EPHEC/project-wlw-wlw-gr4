const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const loadServiceAccount = () => {
  const possiblePaths = [
    path.join(__dirname, '../firebaseConfig.json'),
    path.join(__dirname, '../serviceAccountKey.json'),
    path.join(__dirname, '../firebase-adminsdk.json'),
    path.join(__dirname, '../ephec-smartdogs-firebase-adminsdk-fbsvc-f1f0db8690.json'),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        return require(filePath);
      } catch (err) {
        console.warn(`Could not read service account: ${filePath}`);
      }
    }
  }

  return null;
};

const serviceAccount = loadServiceAccount();
if (!serviceAccount) {
  console.error('No Firebase service account found.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const dryRun = !process.argv.includes('--apply');

const resolveEducatorId = (entry) => {
  if (!entry) return null;
  if (typeof entry === 'string') return entry;
  if (entry.educatorId) return entry.educatorId;
  if (entry.userId && entry.role === 'educator') return entry.userId;
  return null;
};

const backfillInvitesFromPendingMembers = async () => {
  console.log(`\nBackfill invites from club.pendingMembers ${dryRun ? '(DRY RUN)' : '(APPLY)'}\n`);
  const clubsSnap = await db.collection('club').get();
  let created = 0;

  for (const clubDoc of clubsSnap.docs) {
    const clubId = clubDoc.id;
    const clubData = clubDoc.data();
    const pendingMembers = Array.isArray(clubData.pendingMembers) ? clubData.pendingMembers : [];

    for (const pending of pendingMembers) {
      const educatorId = resolveEducatorId(pending);
      if (!educatorId) continue;

      const inviteId = `${clubId}_${educatorId}`;
      const inviteRef = db.collection('clubEducatorInvites').doc(inviteId);
      const inviteSnap = await inviteRef.get();
      if (inviteSnap.exists) continue;

      const createdAt = pending.requestedAt || pending.requestDate || admin.firestore.FieldValue.serverTimestamp();
      const payload = {
        clubId,
        educatorId,
        createdByUid: pending.userId || educatorId,
        createdByRole: 'educator',
        status: 'pending',
        message: pending.message || '',
        createdAt,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (!dryRun) {
        await inviteRef.set(payload);
      }
      created += 1;
      console.log(`Invite ${inviteId} ${dryRun ? 'would be created' : 'created'}`);
    }
  }

  console.log(`\nInvites created: ${created}\n`);
};

const backfillAffiliationsFromEducatorClubId = async () => {
  console.log(`\nBackfill clubEducators from educators.clubID ${dryRun ? '(DRY RUN)' : '(APPLY)'}\n`);
  const educatorsSnap = await db.collection('educators').get();
  let created = 0;

  for (const educatorDoc of educatorsSnap.docs) {
    const educatorId = educatorDoc.id;
    const educatorData = educatorDoc.data();
    const clubId = educatorData.clubID || educatorData.clubId;
    if (!clubId) continue;

    const affiliationId = `${clubId}_${educatorId}`;
    const affiliationRef = db.collection('clubEducators').doc(affiliationId);
    const affiliationSnap = await affiliationRef.get();
    if (affiliationSnap.exists) continue;

    const payload = {
      clubId,
      educatorId,
      dateJoined: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!dryRun) {
      await affiliationRef.set(payload);
    }
    created += 1;
    console.log(`Affiliation ${affiliationId} ${dryRun ? 'would be created' : 'created'}`);
  }

  console.log(`\nAffiliations created: ${created}\n`);
};

const run = async () => {
  try {
    await backfillInvitesFromPendingMembers();
    await backfillAffiliationsFromEducatorClubId();
  } catch (err) {
    console.error('Backfill failed:', err);
  } finally {
    await admin.app().delete();
    process.exit(0);
  }
};

run();
