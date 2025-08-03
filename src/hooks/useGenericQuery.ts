import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';

interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

export function useGenericQuery<T>(
  queryKey: string[],
  endpoint: string,
  params?: Record<string, unknown>
) {
  return useQuery<T, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<T>>(endpoint, { params });
      return res.data.data;
    },
  });
}
