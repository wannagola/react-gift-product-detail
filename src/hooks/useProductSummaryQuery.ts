import { useQuery } from '@tanstack/react-query';
import { fetchProductSummary } from '@/api/product';
import { GiftItem } from '@/constants/GiftItem';
import { useNavigate } from 'react-router-dom';

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
