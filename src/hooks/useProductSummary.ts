import { useProductSummaryQuery } from '@/hooks/useProductSummaryQuery';

export const useProductSummary = (productId: number) => {
  const { data: product, isLoading: loading, error } = useProductSummaryQuery(productId);

  return { product, loading, error };
};
