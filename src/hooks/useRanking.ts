import { useRankingQuery } from '@/hooks/useRankingQuery';
import { FilterValue, TabValue } from '@/api/ranking';

export const useRanking = (filter: FilterValue, type: TabValue) => {
  const { data: products, isLoading: loading, error } = useRankingQuery(filter, type);

  return { products, loading, error };
};
