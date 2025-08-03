import { useQuery } from '@tanstack/react-query';
import { fetchProductWish } from '@/api/product';
import { ProductWish } from '@/types/product';
import { toast } from 'react-toastify';

export const useProductWishQuery = (productId: number) => {
  return useQuery<ProductWish, Error, ProductWish, ['productWish', number]>({ 
    queryKey: ['productWish', productId],
    queryFn: () => fetchProductWish(productId),
    enabled: !!productId,
    meta: {
      onError: (error: Error) => {
        console.error('상품 찜 정보 불러오기 실패:', error);
        toast.error('상품 찜 정보를 불러오는 데 실패했습니다.');
      },
    },
  });
};

