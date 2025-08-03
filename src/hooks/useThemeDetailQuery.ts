import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';

interface ThemeDetail {
  themeId: number;
  name: string;
  title: string;
  description: string;
  backgroundColor: string;
}

interface ApiResponse<T> {
  data: T;
}

const fetchThemeDetail = async (themeId: number): Promise<ThemeDetail> => {
  const res = await apiClient.get<ApiResponse<ThemeDetail>>(
    `/api/themes/${themeId}/info`
  );
  return res.data.data;
};

export const useThemeDetailQuery = (themeId: number) => {
  return useQuery<ThemeDetail, Error>({
    queryKey: ['themeDetail', themeId],
    queryFn: () => fetchThemeDetail(themeId),
    enabled: !!themeId,
  });
};
