import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';

import { db } from '@/firebaseConfig';

export type ClubEducatorInviteStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type ClubEducatorInviteRole = 'club' | 'educator';

export type ClubEducatorInviteDoc = {
  id: string;
  clubId: string;
  educatorId: string;
  createdByUid: string;
  createdByRole: ClubEducatorInviteRole;
  status: ClubEducatorInviteStatus;
  message?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export type InviteErrorCode =
  | 'ALREADY_LINKED'
  | 'ALREADY_PENDING'
  | 'INVITE_NOT_FOUND'
  | 'INVITE_NOT_PENDING'
  | 'INVALID_ROLE'
  | 'MISSING_ID'
  | 'OWNER_MISMATCH'
  | 'CLUB_NOT_FOUND'
  | 'EDUCATOR_NOT_FOUND'
  | 'NOT_RECEIVER'
  | 'NOT_SENDER'
  | 'EDUCATOR_ALREADY_IN_CLUB';

const INVITES_COLLECTION = 'clubEducatorInvites';
const AFFILIATIONS_COLLECTION = 'clubEducators';

const createInviteError = (code: InviteErrorCode, message: string) => {
  const error = new Error(message);
  (error as Error & { code: InviteErrorCode }).code = code;
  return error;
};

export const buildInviteId = (clubId: string, educatorId: string) => `${clubId}_${educatorId}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getDisplayName = (userData?: DocumentData, educatorData?: DocumentData) => {
  const profile = isRecord(userData?.profile) ? userData?.profile : {};
  const firstName =
    (profile?.firstName as string) ||
    (userData?.firstName as string) ||
    (educatorData?.firstName as string) ||
    '';
  const lastName =
    (profile?.lastName as string) ||
    (userData?.lastName as string) ||
    (educatorData?.lastName as string) ||
    '';
  const composed = `${firstName} ${lastName}`.trim();
  return (
    composed ||
    (userData?.displayName as string) ||
    (profile?.displayName as string) ||
    (educatorData?.displayName as string) ||
    'Utilisateur'
  );
};

const getEmail = (userData?: DocumentData, educatorData?: DocumentData) =>
  (userData?.email as string) || (educatorData?.email as string) || '';

const normalizeList = (value: unknown) => (Array.isArray(value) ? value : []);

const matchesMember = (entry: unknown, userId: string, educatorId: string) => {
  if (typeof entry === 'string') {
    return entry === userId || entry === educatorId;
  }
  if (!isRecord(entry)) return false;
  return entry.userId === userId || entry.educatorId === educatorId;
};

const upsertPendingMember = (pendingMembers: unknown, entry: Record<string, unknown>) => {
  const list = [...normalizeList(pendingMembers)];
  const exists = list.some((item) =>
    matchesMember(item, String(entry.userId ?? ''), String(entry.educatorId ?? '')),
  );
  return exists ? list : [...list, entry];
};

const removePendingMember = (pendingMembers: unknown, userId: string, educatorId: string) =>
  normalizeList(pendingMembers).filter((item) => !matchesMember(item, userId, educatorId));

const upsertMember = (members: unknown, entry: Record<string, unknown>) => {
  const list = [...normalizeList(members)];
  const exists = list.some((item) =>
    matchesMember(item, String(entry.userId ?? ''), String(entry.educatorId ?? '')),
  );
  return exists ? list : [...list, entry];
};

const addUniqueId = (items: unknown, id: string) => {
  const list = normalizeList(items);
  return list.includes(id) ? list : [...list, id];
};

export const getInviteErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: InviteErrorCode }).code;
    switch (code) {
      case 'ALREADY_LINKED':
        return 'Affiliation deja existante.';
      case 'ALREADY_PENDING':
        return 'Une demande est deja en attente.';
      case 'INVITE_NOT_FOUND':
        return 'Invitation introuvable.';
      case 'INVITE_NOT_PENDING':
        return 'Invitation deja traitee.';
      case 'INVALID_ROLE':
        return 'Role invalide pour cette action.';
      case 'MISSING_ID':
        return 'Identifiant manquant.';
      case 'OWNER_MISMATCH':
        return 'Profil utilisateur incoherent.';
      case 'CLUB_NOT_FOUND':
        return 'Club introuvable.';
      case 'EDUCATOR_NOT_FOUND':
        return 'Educateur introuvable.';
      case 'NOT_RECEIVER':
        return "Vous n'etes pas le destinataire de cette demande.";
      case 'NOT_SENDER':
        return "Vous n'etes pas l'emetteur de cette demande.";
      case 'EDUCATOR_ALREADY_IN_CLUB':
        return 'Cet educateur est deja rattache a un club.';
      default:
        break;
    }
  }
  return error instanceof Error ? error.message : 'Une erreur est survenue.';
};

const getUserDoc = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) {
    throw createInviteError('MISSING_ID', 'Utilisateur introuvable.');
  }
  return snap.data();
};

const assertEducatorOwner = (educatorData: DocumentData | undefined, uid: string) => {
  const ownerUserId = educatorData?.ownerUserId as string | undefined;
  if (ownerUserId && ownerUserId !== uid) {
    throw createInviteError('OWNER_MISMATCH', 'Educateur ownerUserId mismatch.');
  }
};

const assertClubOwner = (clubData: DocumentData | undefined, uid: string) => {
  const ownerUserId = clubData?.ownerUserId as string | undefined;
  if (ownerUserId && ownerUserId !== uid) {
    throw createInviteError('OWNER_MISMATCH', 'Club ownerUserId mismatch.');
  }
};

const getClubIdForAuthUid = async (uid: string) => {
  const userData = await getUserDoc(uid);
  if (userData.role !== 'club') {
    throw createInviteError('INVALID_ROLE', 'Role club requis.');
  }
  const clubId = userData.clubId as string | undefined;
  if (!clubId) {
    throw createInviteError('MISSING_ID', 'clubId manquant.');
  }
  return { clubId, userData };
};

const getEducatorIdForAuthUid = async (uid: string) => {
  const userData = await getUserDoc(uid);
  if (userData.role !== 'educator') {
    throw createInviteError('INVALID_ROLE', 'Role educator requis.');
  }
  const educatorId = userData.educatorId as string | undefined;
  if (!educatorId) {
    throw createInviteError('MISSING_ID', 'educatorId manquant.');
  }
  return { educatorId, userData };
};

export async function educatorRequestJoinClub(input: {
  authUid: string;
  clubId: string;
  message?: string;
}) {
  const { authUid, clubId, message } = input;
  if (!authUid || !clubId) {
    throw createInviteError('MISSING_ID', 'authUid ou clubId manquant.');
  }

  const { educatorId, userData } = await getEducatorIdForAuthUid(authUid);
  const inviteId = buildInviteId(clubId, educatorId);

  await runTransaction(db, async (transaction) => {
    const clubRef = doc(db, 'club', clubId);
    const educatorRef = doc(db, 'educators', educatorId);
    const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
    const affiliationRef = doc(db, AFFILIATIONS_COLLECTION, inviteId);

    const [clubSnap, educatorSnap, inviteSnap, affiliationSnap] = await Promise.all([
      transaction.get(clubRef),
      transaction.get(educatorRef),
      transaction.get(inviteRef),
      transaction.get(affiliationRef),
    ]);

    if (!clubSnap.exists()) {
      throw createInviteError('CLUB_NOT_FOUND', 'Club introuvable.');
    }
    if (!educatorSnap.exists()) {
      throw createInviteError('EDUCATOR_NOT_FOUND', 'Educateur introuvable.');
    }
    assertEducatorOwner(educatorSnap.data(), authUid);

    if (affiliationSnap.exists()) {
      throw createInviteError('ALREADY_LINKED', 'Affiliation deja existante.');
    }

    if (inviteSnap.exists()) {
      const inviteData = inviteSnap.data();
      if (inviteData.status === 'pending') {
        throw createInviteError('ALREADY_PENDING', 'Invitation deja en attente.');
      }
      if (inviteData.status === 'accepted') {
        throw createInviteError('ALREADY_LINKED', 'Affiliation deja acceptee.');
      }
    }

    const now = serverTimestamp();
    const educatorData = educatorSnap.data();
    const displayName = getDisplayName(userData, educatorData);
    const email = getEmail(userData, educatorData);

    const pendingEntry = {
      userId: authUid,
      educatorId,
      name: displayName,
      email,
      requestedAt: now,
      status: 'pending',
      role: 'educator',
    };

    const clubData = clubSnap.data();
    const nextPending = upsertPendingMember(clubData.pendingMembers, pendingEntry);

    transaction.update(clubRef, {
      pendingMembers: nextPending,
      updatedAt: now,
    });

    transaction.set(
      inviteRef,
      {
        clubId,
        educatorId,
        createdByUid: authUid,
        createdByRole: 'educator',
        status: 'pending',
        message: message ?? '',
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  return inviteId;
}

export async function clubInviteEducator(input: {
  authUid: string;
  educatorId: string;
  message?: string;
}) {
  const { authUid, educatorId, message } = input;
  if (!authUid || !educatorId) {
    throw createInviteError('MISSING_ID', 'authUid ou educatorId manquant.');
  }

  const { clubId } = await getClubIdForAuthUid(authUid);
  const inviteId = buildInviteId(clubId, educatorId);

  await runTransaction(db, async (transaction) => {
    const clubRef = doc(db, 'club', clubId);
    const educatorRef = doc(db, 'educators', educatorId);
    const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
    const affiliationRef = doc(db, AFFILIATIONS_COLLECTION, inviteId);

    const [clubSnap, educatorSnap, inviteSnap, affiliationSnap] = await Promise.all([
      transaction.get(clubRef),
      transaction.get(educatorRef),
      transaction.get(inviteRef),
      transaction.get(affiliationRef),
    ]);

    if (!clubSnap.exists()) {
      throw createInviteError('CLUB_NOT_FOUND', 'Club introuvable.');
    }
    if (!educatorSnap.exists()) {
      throw createInviteError('EDUCATOR_NOT_FOUND', 'Educateur introuvable.');
    }
    assertClubOwner(clubSnap.data(), authUid);

    if (affiliationSnap.exists()) {
      throw createInviteError('ALREADY_LINKED', 'Affiliation deja existante.');
    }

    if (inviteSnap.exists()) {
      const inviteData = inviteSnap.data();
      if (inviteData.status === 'pending') {
        throw createInviteError('ALREADY_PENDING', 'Invitation deja en attente.');
      }
      if (inviteData.status === 'accepted') {
        throw createInviteError('ALREADY_LINKED', 'Affiliation deja acceptee.');
      }
    }

    const now = serverTimestamp();
    const educatorData = educatorSnap.data();
    const displayName = getDisplayName(undefined, educatorData);
    const email = getEmail(undefined, educatorData);

    const pendingEntry = {
      userId: (educatorData.ownerUserId as string | undefined) || educatorId,
      educatorId,
      name: displayName,
      email,
      requestedAt: now,
      status: 'pending',
      role: 'educator',
    };

    const clubData = clubSnap.data();
    const nextPending = upsertPendingMember(clubData.pendingMembers, pendingEntry);

    transaction.update(clubRef, {
      pendingMembers: nextPending,
      updatedAt: now,
    });

    transaction.set(
      inviteRef,
      {
        clubId,
        educatorId,
        createdByUid: authUid,
        createdByRole: 'club',
        status: 'pending',
        message: message ?? '',
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  return inviteId;
}

export async function acceptInviteOrRequest(input: {
  authUid: string;
  clubId: string;
  educatorId: string;
}) {
  const { authUid, clubId, educatorId } = input;
  if (!authUid || !clubId || !educatorId) {
    throw createInviteError('MISSING_ID', 'authUid, clubId ou educatorId manquant.');
  }

  const userData = await getUserDoc(authUid);
  const isClubUser = userData.role === 'club' && userData.clubId === clubId;
  const isEducatorUser = userData.role === 'educator' && userData.educatorId === educatorId;

  if (!isClubUser && !isEducatorUser) {
    throw createInviteError('INVALID_ROLE', 'Role non autorise.');
  }

  const inviteId = buildInviteId(clubId, educatorId);

  await runTransaction(db, async (transaction) => {
    const clubRef = doc(db, 'club', clubId);
    const educatorRef = doc(db, 'educators', educatorId);
    const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
    const affiliationRef = doc(db, AFFILIATIONS_COLLECTION, inviteId);

    const [clubSnap, educatorSnap, inviteSnap, affiliationSnap] = await Promise.all([
      transaction.get(clubRef),
      transaction.get(educatorRef),
      transaction.get(inviteRef),
      transaction.get(affiliationRef),
    ]);

    if (!clubSnap.exists()) {
      throw createInviteError('CLUB_NOT_FOUND', 'Club introuvable.');
    }
    if (!educatorSnap.exists()) {
      throw createInviteError('EDUCATOR_NOT_FOUND', 'Educateur introuvable.');
    }
    if (!inviteSnap.exists()) {
      throw createInviteError('INVITE_NOT_FOUND', 'Invitation introuvable.');
    }

    const inviteData = inviteSnap.data();
    if (inviteData.status !== 'pending') {
      throw createInviteError('INVITE_NOT_PENDING', 'Invitation non en attente.');
    }

    const receiverRole: ClubEducatorInviteRole =
      inviteData.createdByRole === 'club' ? 'educator' : 'club';
    if (receiverRole === 'club' && !isClubUser) {
      throw createInviteError('NOT_RECEIVER', 'Club non destinataire.');
    }
    if (receiverRole === 'educator' && !isEducatorUser) {
      throw createInviteError('NOT_RECEIVER', 'Educateur non destinataire.');
    }

    if (isClubUser) {
      assertClubOwner(clubSnap.data(), authUid);
    }
    if (isEducatorUser) {
      assertEducatorOwner(educatorSnap.data(), authUid);
    }

    const educatorData = educatorSnap.data();
    const existingClubId =
      (educatorData.clubID as string | undefined) ||
      (educatorData.clubId as string | undefined) ||
      '';
    if (existingClubId && existingClubId !== clubId) {
      throw createInviteError('EDUCATOR_ALREADY_IN_CLUB', 'Educateur deja rattache.');
    }

    const existingClubIds = normalizeList(educatorData.clubIds);
    const otherClubId = existingClubIds.find((id) => id && id !== clubId);
    if (otherClubId) {
      throw createInviteError('EDUCATOR_ALREADY_IN_CLUB', 'Educateur deja rattache.');
    }

    const now = serverTimestamp();
    const displayName = getDisplayName(undefined, educatorData);
    const email = getEmail(undefined, educatorData);
    const userId = (educatorData.ownerUserId as string | undefined) || educatorId;

    const memberEntry = {
      userId,
      educatorId,
      name: displayName,
      email,
      joinedAt: now,
      role: 'educator',
    };

    const clubData = clubSnap.data();
    const nextPending = removePendingMember(clubData.pendingMembers, userId, educatorId);
    const nextMembers = upsertMember(clubData.members, memberEntry);
    const nextEducatorIds = addUniqueId(clubData.educatorIds, educatorId);

    transaction.update(clubRef, {
      pendingMembers: nextPending,
      members: nextMembers,
      educatorIds: nextEducatorIds,
      updatedAt: now,
    });

    if (!affiliationSnap.exists()) {
      transaction.set(affiliationRef, {
        clubId,
        educatorId,
        dateJoined: now,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    const nextClubIds = addUniqueId(existingClubIds, clubId);
    transaction.update(educatorRef, {
      clubID: clubId,
      clubIds: nextClubIds,
      updatedAt: now,
    });

    transaction.update(inviteRef, {
      status: 'accepted',
      updatedAt: now,
    });
  });

  return inviteId;
}

export async function rejectInviteOrRequest(input: {
  authUid: string;
  clubId: string;
  educatorId: string;
}) {
  const { authUid, clubId, educatorId } = input;
  if (!authUid || !clubId || !educatorId) {
    throw createInviteError('MISSING_ID', 'authUid, clubId ou educatorId manquant.');
  }

  const userData = await getUserDoc(authUid);
  const isClubUser = userData.role === 'club' && userData.clubId === clubId;
  const isEducatorUser = userData.role === 'educator' && userData.educatorId === educatorId;

  if (!isClubUser && !isEducatorUser) {
    throw createInviteError('INVALID_ROLE', 'Role non autorise.');
  }

  const inviteId = buildInviteId(clubId, educatorId);

  await runTransaction(db, async (transaction) => {
    const clubRef = doc(db, 'club', clubId);
    const educatorRef = doc(db, 'educators', educatorId);
    const inviteRef = doc(db, INVITES_COLLECTION, inviteId);

    const [clubSnap, educatorSnap, inviteSnap] = await Promise.all([
      transaction.get(clubRef),
      transaction.get(educatorRef),
      transaction.get(inviteRef),
    ]);

    if (!clubSnap.exists()) {
      throw createInviteError('CLUB_NOT_FOUND', 'Club introuvable.');
    }
    if (!educatorSnap.exists()) {
      throw createInviteError('EDUCATOR_NOT_FOUND', 'Educateur introuvable.');
    }
    if (!inviteSnap.exists()) {
      throw createInviteError('INVITE_NOT_FOUND', 'Invitation introuvable.');
    }

    const inviteData = inviteSnap.data();
    if (inviteData.status !== 'pending') {
      throw createInviteError('INVITE_NOT_PENDING', 'Invitation non en attente.');
    }

    const receiverRole: ClubEducatorInviteRole =
      inviteData.createdByRole === 'club' ? 'educator' : 'club';
    if (receiverRole === 'club' && !isClubUser) {
      throw createInviteError('NOT_RECEIVER', 'Club non destinataire.');
    }
    if (receiverRole === 'educator' && !isEducatorUser) {
      throw createInviteError('NOT_RECEIVER', 'Educateur non destinataire.');
    }

    const now = serverTimestamp();
    const educatorData = educatorSnap.data();
    const userId = (educatorData.ownerUserId as string | undefined) || educatorId;

    const clubData = clubSnap.data();
    const nextPending = removePendingMember(clubData.pendingMembers, userId, educatorId);

    transaction.update(clubRef, {
      pendingMembers: nextPending,
      updatedAt: now,
    });

    transaction.update(inviteRef, {
      status: 'rejected',
      updatedAt: now,
    });
  });

  return inviteId;
}

export async function cancelInviteOrRequest(input: {
  authUid: string;
  clubId: string;
  educatorId: string;
}) {
  const { authUid, clubId, educatorId } = input;
  if (!authUid || !clubId || !educatorId) {
    throw createInviteError('MISSING_ID', 'authUid, clubId ou educatorId manquant.');
  }

  const inviteId = buildInviteId(clubId, educatorId);

  await runTransaction(db, async (transaction) => {
    const clubRef = doc(db, 'club', clubId);
    const educatorRef = doc(db, 'educators', educatorId);
    const inviteRef = doc(db, INVITES_COLLECTION, inviteId);

    const [clubSnap, educatorSnap, inviteSnap] = await Promise.all([
      transaction.get(clubRef),
      transaction.get(educatorRef),
      transaction.get(inviteRef),
    ]);

    if (!clubSnap.exists()) {
      throw createInviteError('CLUB_NOT_FOUND', 'Club introuvable.');
    }
    if (!educatorSnap.exists()) {
      throw createInviteError('EDUCATOR_NOT_FOUND', 'Educateur introuvable.');
    }
    if (!inviteSnap.exists()) {
      throw createInviteError('INVITE_NOT_FOUND', 'Invitation introuvable.');
    }

    const inviteData = inviteSnap.data();
    if (inviteData.status !== 'pending') {
      throw createInviteError('INVITE_NOT_PENDING', 'Invitation non en attente.');
    }
    if (inviteData.createdByUid !== authUid) {
      throw createInviteError('NOT_SENDER', 'Emetteur invalide.');
    }

    const now = serverTimestamp();
    const educatorData = educatorSnap.data();
    const userId = (educatorData.ownerUserId as string | undefined) || educatorId;

    const clubData = clubSnap.data();
    const nextPending = removePendingMember(clubData.pendingMembers, userId, educatorId);

    transaction.update(clubRef, {
      pendingMembers: nextPending,
      updatedAt: now,
    });

    transaction.update(inviteRef, {
      status: 'cancelled',
      updatedAt: now,
    });
  });

  return inviteId;
}

export async function getPendingInvitesForClub(clubId: string): Promise<ClubEducatorInviteDoc[]> {
  const q = query(
    collection(db, INVITES_COLLECTION),
    where('clubId', '==', clubId),
    where('status', '==', 'pending'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<ClubEducatorInviteDoc, 'id'>;
    return { id: docSnap.id, ...data };
  });
}

export async function getPendingInvitesForEducator(
  educatorId: string,
): Promise<ClubEducatorInviteDoc[]> {
  const q = query(
    collection(db, INVITES_COLLECTION),
    where('educatorId', '==', educatorId),
    where('status', '==', 'pending'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<ClubEducatorInviteDoc, 'id'>;
    return { id: docSnap.id, ...data };
  });
}
