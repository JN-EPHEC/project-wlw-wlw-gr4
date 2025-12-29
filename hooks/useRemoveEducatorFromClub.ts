import { useState } from 'react';

import { removeEducatorFromClub } from '@/services/educatorClubService';

type UseRemoveEducatorFromClubResult = {
  loading: boolean;
  error: string | null;
  removeEducatorFromClub: (affiliationId: string) => Promise<boolean>;
};

export function useRemoveEducatorFromClub(): UseRemoveEducatorFromClubResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async (affiliationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await removeEducatorFromClub(affiliationId);
    } catch (err) {
      console.error('Error removing educator from club:', err);
      setError(err instanceof Error ? err.message : 'Remove error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, removeEducatorFromClub: handleRemove };
}
