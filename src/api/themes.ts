import { apiClient } from './apiClient';
import { GiftItem } from '@/constants/GiftItem';

export interface Theme {
  themeId: number;
  name: string;
  image: string;
}

export interface ThemeDetail {
  themeId: number;
  name: string;
  title: string;
  description: string;
  backgroundColor: string;
}

export interface ThemeProductsResponse {
  list: GiftItem[];
  cursor: number;
  hasMoreList: boolean;
}

export interface ApiResponse<T> {
  data: T;
}

export const fetchThemes = async (): Promise<Theme[]> => {
  const response = await apiClient.get<ApiResponse<Theme[]>>('/api/themes');
  return response.data.data;
};

export const fetchThemeDetail = async (themeId: number): Promise<ThemeDetail> => {
  const res = await apiClient.get<ApiResponse<ThemeDetail>>(`/api/themes/${themeId}/info`);
  return res.data.data;
};

export const fetchThemeProducts = async (themeId: number, cursor: number, limit: number): Promise<ThemeProductsResponse> => {
  const res = await apiClient.get<ApiResponse<ThemeProductsResponse>>(
    `/api/themes/${themeId}/products`,
    {
      params: { cursor, limit },
    }
  );
  return res.data.data;
};
