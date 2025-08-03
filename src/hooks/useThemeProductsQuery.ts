import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { fetchThemeProducts, ThemeProductsResponse } from '@/api/themes';
import { GiftItem } from '@/constants/GiftItem';

const PRODUCTS_LIMIT = 10;

export const useThemeProductsQuery = (themeId: number) => {
  return useInfiniteQuery<
    ThemeProductsResponse,
    Error,
    GiftItem[],
    ['themeProducts', number],
    number
  >({
    queryKey: ['themeProducts', themeId],
    queryFn: ({ pageParam = 0 }) =>
      fetchThemeProducts(themeId, pageParam, PRODUCTS_LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMoreList ? lastPage.cursor : undefined;
    },
    select: (data: InfiniteData<ThemeProductsResponse, number>) => {
      return data.pages.flatMap((page) => page.list);
    },
    enabled: !!themeId,
  });
};
