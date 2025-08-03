import { useThemesQuery } from '@/hooks/useThemesQuery';

export const useThemes = () => {
  const { data: themes, isLoading: loading, error } = useThemesQuery();

  return { themes, loading, error };
};
