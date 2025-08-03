import { useThemeProductsQuery } from '@/hooks/useThemeProductsQuery';

export function useThemeProducts(themeId: number) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useThemeProductsQuery(themeId);

  const products = data || [];
  const loading = isLoading || isFetchingNextPage;
  const hasMore = hasNextPage;
  const fetchMore = fetchNextPage;

  return {
    products,
    loading,
    error: isError ? error : null,
    fetchMore,
    hasMore,
  };
}
