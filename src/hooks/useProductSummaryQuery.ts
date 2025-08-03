import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { GiftItem } from '@/constants/GiftItem';
import { useNavigate } from 'react-router-dom';

interface ApiResponse<T> {
  data: T;
}

const fetchProductSummary = async (productId: number): Promise<GiftItem> => {
  const res = await apiClient.get<ApiResponse<GiftItem>>(
    `/api/products/${productId}`
  );
  return res.data.data;
};

export const useProductSummaryQuery = (productId: number) => {
  const navigate = useNavigate();

  return useQuery<GiftItem, Error, GiftItem, ['productSummary', number]>({
    queryKey: ['productSummary', productId],
    queryFn: () => fetchProductSummary(productId),
    enabled: !!productId,
    meta: {
      onError: (error: Error) => {
        console.error('상품 요약 정보 불러오기 실패:', error);
        navigate('/');
      },
    },
  });
};
