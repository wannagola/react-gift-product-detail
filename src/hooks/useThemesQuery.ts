import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { Theme, ApiResponse } from '@/api/themes';

const fetchThemes = async (): Promise<Theme[]> => {
  const response = await apiClient.get<ApiResponse<Theme[]>>('/api/themes');
  return response.data.data;
};

export const useThemesQuery = () => {
  return useQuery<Theme[], Error>({
    queryKey: ['themes'],
    queryFn: fetchThemes,
  });
};
