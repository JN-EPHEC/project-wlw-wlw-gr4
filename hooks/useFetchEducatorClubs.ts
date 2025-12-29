import { useEffect, useState } from 'react';

import {
  EducatorClubData,
  FetchEducatorClubsOptions,
  fetchEducatorClubsData,
} from '@/services/educatorClubService';

type UseFetchEducatorClubsResult = {
  data: EducatorClubData[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useFetchEducatorClubs(
  educatorId: string | undefined,
  options: FetchEducatorClubsOptions = {},
): UseFetchEducatorClubsResult {
  const [data, setData] = useState<EducatorClubData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const refetch = () => setRefreshToken((prev) => prev + 1);

  useEffect(() => {
    if (!educatorId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchEducatorClubsData(educatorId, options);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Fetch error'));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [educatorId, refreshToken, options.onlyActive]);

  return { data, loading, error, refetch };
}
