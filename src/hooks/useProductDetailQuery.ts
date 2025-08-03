import { useQuery } from '@tanstack/react-query';
import { fetchProductDetail, fetchProductSummary } from '@/api/product';
import { ProductDetail } from '@/types/product';
import { GiftItem } from '@/constants/GiftItem';
import { toast } from 'react-toastify';

interface CombinedProductDetail extends GiftItem, ProductDetail {}

export const useProductDetailQuery = (productId: number) => {
  return useQuery<
    CombinedProductDetail,
    Error,
    CombinedProductDetail,
    ['productDetail', number]
  >({
    queryKey: ['productDetail', productId],
    queryFn: async () => {
      const [summary, detail] = await Promise.all([
        fetchProductSummary(productId),
        fetchProductDetail(productId),
      ]);
      return { ...summary, ...detail };
    },
    enabled: !!productId,
    meta: {
      onError: (error: Error) => {
        console.error('상품 상세 정보 불러오기 실패:', error);
        toast.error('상품 상세 정보를 불러오는 데 실패했습니다.');
      },
    },
  });
};
