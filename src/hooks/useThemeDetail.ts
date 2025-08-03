import { useThemeDetailQuery } from '@/hooks/useThemeDetailQuery';

export function useThemeDetail(themeId: number) {
  const { data: theme, isLoading: loading, error } = useThemeDetailQuery(themeId);

  return { theme, loading, error };
}
