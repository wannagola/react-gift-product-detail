import { useProductSummaryQuery } from '@/hooks/useProductSummaryQuery';

export const useProductDetail = (productId: number) => {
  const {
    data: product,
    isLoading: loading,
    error,
  } = useProductSummaryQuery(productId);

  return { product, loading, error };
};
