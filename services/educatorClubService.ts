import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '@/firebaseConfig';

export type ClubAffiliation = {
  id: string;
  educatorId: string;
  clubId: string;
  dateJoined: string;
  experienceLevel: string;
  lessonsGiven: number;
  isActive: boolean;
};

export type ClubInfo = {
  id: string;
  name?: string;
  location?: string;
  ownerUserId?: string;
  logoUrl?: string;
  city?: string;
  address?: string;
  services?: string;
};

export type EducatorClubData = {
  club: ClubInfo;
  affiliation: ClubAffiliation;
};

export type EducatorInfo = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  city?: string;
  hourlyRate?: number;
  experienceYears?: number;
  averageRating?: number;
  reviewsCount?: number;
};

export type ClubEducatorData = {
  educator: EducatorInfo;
  affiliation: ClubAffiliation;
};

export type FetchEducatorClubsOptions = {
  onlyActive?: boolean;
};

export async function fetchEducatorClubsData(
  educatorId: string,
  options: FetchEducatorClubsOptions = {},
): Promise<EducatorClubData[]> {
  const constraints = [where('educatorId', '==', educatorId)];
  if (options.onlyActive) {
    constraints.push(where('isActive', '==', true));
  }

  const affiliationsQuery = query(collection(db, 'clubEducators'), ...constraints);
  const affiliationsSnapshot = await getDocs(affiliationsQuery);

  const affiliationDetails: ClubAffiliation[] = affiliationsSnapshot.docs.map((affDoc) => ({
    id: affDoc.id,
    ...(affDoc.data() as Omit<ClubAffiliation, 'id'>),
  }));

  const uniqueClubIds = Array.from(new Set(affiliationDetails.map((aff) => aff.clubId)));

  const clubs = (
    await Promise.all(
      uniqueClubIds.map(async (clubId) => {
        const clubDoc = await getDoc(doc(db, 'club', clubId));
        if (!clubDoc.exists()) return null;
        return { id: clubDoc.id, ...(clubDoc.data() as Omit<ClubInfo, 'id'>) };
      }),
    )
  ).filter((club): club is ClubInfo => club !== null);

  return affiliationDetails
    .map((affiliation) => {
      const club = clubs.find((c) => c.id === affiliation.clubId);
      if (!club) return null;
      return { club, affiliation };
    })
    .filter((item): item is EducatorClubData => item !== null);
}

export type FetchClubEducatorsOptions = {
  onlyActive?: boolean;
};

export async function fetchClubEducatorsData(
  clubId: string,
  options: FetchClubEducatorsOptions = {},
): Promise<ClubEducatorData[]> {
  const constraints = [where('clubId', '==', clubId)];
  if (options.onlyActive) {
    constraints.push(where('isActive', '==', true));
  }

  const affiliationsQuery = query(collection(db, 'clubEducators'), ...constraints);
  const affiliationsSnapshot = await getDocs(affiliationsQuery);

  const affiliationDetails: ClubAffiliation[] = affiliationsSnapshot.docs.map((affDoc) => ({
    id: affDoc.id,
    ...(affDoc.data() as Omit<ClubAffiliation, 'id'>),
  }));

  const uniqueEducatorIds = Array.from(new Set(affiliationDetails.map((aff) => aff.educatorId)));

  const educators = (
    await Promise.all(
      uniqueEducatorIds.map(async (educatorId) => {
        const educatorDoc = await getDoc(doc(db, 'educators', educatorId));
        if (!educatorDoc.exists()) return null;
        return { id: educatorDoc.id, ...(educatorDoc.data() as Omit<EducatorInfo, 'id'>) };
      }),
    )
  ).filter((educator): educator is EducatorInfo => educator !== null);

  return affiliationDetails
    .map((affiliation) => {
      const educator = educators.find((e) => e.id === affiliation.educatorId);
      if (!educator) return null;
      return { educator, affiliation };
    })
    .filter((item): item is ClubEducatorData => item !== null);
}

export async function updateLessonsGiven(
  affiliationId: string,
  newLessonsCount: number,
): Promise<boolean> {
  try {
    const affiliationRef = doc(db, 'clubEducators', affiliationId);
    await updateDoc(affiliationRef, {
      lessonsGiven: newLessonsCount,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (err) {
    console.error('Error updating lessons given:', err);
    return false;
  }
}

export async function removeEducatorFromClub(affiliationId: string): Promise<boolean> {
  try {
    const affiliationRef = doc(db, 'clubEducators', affiliationId);
    const affiliationSnap = await getDoc(affiliationRef);
    if (!affiliationSnap.exists()) {
      return false;
    }

    const affiliation = affiliationSnap.data() as ClubAffiliation;
    await deleteDoc(affiliationRef);

    const now = Timestamp.now();
    await updateDoc(doc(db, 'club', affiliation.clubId), {
      educatorIds: arrayRemove(affiliation.educatorId),
      updatedAt: now,
    });
    await updateDoc(doc(db, 'educators', affiliation.educatorId), {
      clubIds: arrayRemove(affiliation.clubId),
      updatedAt: now,
    });

    return true;
  } catch (err) {
    console.error('Error removing educator from club:', err);
    return false;
  }
}
