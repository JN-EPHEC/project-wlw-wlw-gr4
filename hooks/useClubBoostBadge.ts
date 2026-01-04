import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';

interface BoostBadge {
  label: string | null;
  color: string | null;
  bgColor: string | null;
  isActive: boolean;
}

const PLAN_BADGE_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
  'boost-basic': {
    label: 'Boost',
    color: '#F97316',
    bgColor: '#FEF3C7',
  },
  'boost-premium': {
    label: 'Premium',
    color: '#A855F7',
    bgColor: '#F3E8FF',
  },
  'boost-pro': {
    label: 'Pro',
    color: '#D97706',
    bgColor: '#FEF3C7',
  },
};

export function useClubBoostBadge(clubId: string | null): BoostBadge {
  const [boostBadge, setBoostBadge] = useState<BoostBadge>({
    label: null,
    color: null,
    bgColor: null,
    isActive: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }

    const fetchBoostBadge = async () => {
      try {
        const q = query(
          collection(db, 'clubSubscriptions'),
          where('clubId', '==', clubId),
          where('type', '==', 'boost'),
          where('status', '==', 'active')
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setBoostBadge({
            label: null,
            color: null,
            bgColor: null,
            isActive: false,
          });
          setLoading(false);
          return;
        }

        // Vérifier si le boost est encore actif (endDate > now)
        const now = new Date();
        let activeBoost = null;

        for (const doc of snapshot.docs) {
          const data = doc.data();
          let endDate: Date;

          if (data.endDate instanceof Timestamp) {
            endDate = data.endDate.toDate();
          } else {
            endDate = new Date(data.endDate);
          }

          if (endDate > now) {
            activeBoost = data;
            break;
          }
        }

        if (!activeBoost) {
          setBoostBadge({
            label: null,
            color: null,
            bgColor: null,
            isActive: false,
          });
          setLoading(false);
          return;
        }

        const planId = activeBoost.planId;
        const badgeInfo = PLAN_BADGE_MAP[planId];

        if (badgeInfo) {
          setBoostBadge({
            label: badgeInfo.label,
            color: badgeInfo.color,
            bgColor: badgeInfo.bgColor,
            isActive: true,
          });
        } else {
          setBoostBadge({
            label: null,
            color: null,
            bgColor: null,
            isActive: false,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du boost badge:', error);
        setBoostBadge({
          label: null,
          color: null,
          bgColor: null,
          isActive: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBoostBadge();
  }, [clubId]);

  return boostBadge;
}
