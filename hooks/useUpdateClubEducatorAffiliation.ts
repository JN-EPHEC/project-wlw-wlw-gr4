import { useState } from 'react';

import { updateLessonsGiven } from '@/services/educatorClubService';

type UseUpdateClubEducatorAffiliationResult = {
  loading: boolean;
  error: string | null;
  updateLessonsGiven: (affiliationId: string, newLessonsCount: number) => Promise<boolean>;
};

export function useUpdateClubEducatorAffiliation(): UseUpdateClubEducatorAffiliationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateLessonsGiven = async (
    affiliationId: string,
    newLessonsCount: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await updateLessonsGiven(affiliationId, newLessonsCount);
    } catch (err) {
      console.error('Error updating lessons given:', err);
      setError(err instanceof Error ? err.message : 'Update error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateLessonsGiven: handleUpdateLessonsGiven,
  };
}
