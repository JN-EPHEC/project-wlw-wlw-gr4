import { useEffect, useState } from 'react';

import {
  ClubEducatorData,
  FetchClubEducatorsOptions,
  fetchClubEducatorsData,
} from '@/services/educatorClubService';

type UseFetchClubEducatorsResult = {
  data: ClubEducatorData[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useFetchClubEducatorsFromAffiliations(
  clubId: string | undefined,
  options: FetchClubEducatorsOptions = {},
): UseFetchClubEducatorsResult {
  const [data, setData] = useState<ClubEducatorData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const refetch = () => setRefreshToken((prev) => prev + 1);

  useEffect(() => {
    if (!clubId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchClubEducatorsData(clubId, options);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Fetch error'));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubId, refreshToken, options.onlyActive]);

  return { data, loading, error, refetch };
}
