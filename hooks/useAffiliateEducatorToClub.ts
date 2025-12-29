import { useState } from 'react';
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/firebaseConfig';

export type AffiliateEducatorInput = {
  educatorId: string;
  clubId: string;
  experienceLevel: string;
  dateJoined?: Date;
};

export type AffiliateEducatorResult = {
  loading: boolean;
  error: string | null;
  affiliateEducatorToClub: (input: AffiliateEducatorInput) => Promise<string | null>;
};

export const useAffiliateEducatorToClub = (): AffiliateEducatorResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const affiliateEducatorToClub = async (input: AffiliateEducatorInput): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const now = Timestamp.now();
      const joinedAt = (input.dateJoined ?? new Date()).toISOString();
      const affiliationId = `${input.clubId}_${input.educatorId}`;
      const affiliationRef = doc(db, 'clubEducators', affiliationId);
      const existing = await getDoc(affiliationRef);

      if (!existing.exists()) {
        await setDoc(affiliationRef, {
          educatorId: input.educatorId,
          clubId: input.clubId,
          experienceLevel: input.experienceLevel,
          dateJoined: joinedAt,
          lessonsGiven: 0,
          isActive: true,
          createdAt: now,
        });
      }

      const clubRef = doc(db, 'club', input.clubId);
      await updateDoc(clubRef, {
        educatorIds: arrayUnion(input.educatorId),
        updatedAt: now,
      });

      const educatorRef = doc(db, 'educators', input.educatorId);
      await updateDoc(educatorRef, {
        clubIds: arrayUnion(input.clubId),
        updatedAt: now,
      });

      return affiliationId;
    } catch (err) {
      console.error('Error affiliating educator to club:', err);
      setError(err instanceof Error ? err.message : 'Affiliation error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, affiliateEducatorToClub };
};
