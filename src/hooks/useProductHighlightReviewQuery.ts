import { useQuery } from '@tanstack/react-query';
import { fetchProductHighlightReview } from '@/api/product';
import { ProductReview } from '@/types/product';
import { toast } from 'react-toastify';

export const useProductHighlightReviewQuery = (productId: number) => {
  return useQuery<
    ProductReview,
    Error,
    ProductReview,
    ['productHighlightReview', number]
  >({
    queryKey: ['productHighlightReview', productId],
    queryFn: () => fetchProductHighlightReview(productId),
    enabled: !!productId,
    meta: {
      onError: (error: Error) => {
        console.error('상품 하이라이트 리뷰 불러오기 실패:', error);
        toast.error('상품 하이라이트 리뷰를 불러오는 데 실패했습니다.');
      },
    },
  });
};
