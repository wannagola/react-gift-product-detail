import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleProductWish } from '@/api/product';
import { ProductWish } from '@/types/product';
import { toast } from 'react-toastify';

export const useToggleProductWishMutation = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void, { previousWish: ProductWish | undefined }>({ 
    mutationFn: () => toggleProductWish(productId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['productWish', productId] });

      const previousWish = queryClient.getQueryData<ProductWish>(['productWish', productId]);

      queryClient.setQueryData<ProductWish>(['productWish', productId], (old) => {
        if (!old) return undefined;
        return {
          ...old,
          isWished: !old.isWished,
          wishCount: old.isWished ? old.wishCount - 1 : old.wishCount + 1,
        };
      });

      return { previousWish };
    },
    onError: (_err, _newTodo, context) => {
      toast.error('찜하기 상태 변경에 실패했습니다.');
      if (context?.previousWish) {
        queryClient.setQueryData(['productWish', productId], context.previousWish);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['productWish', productId] });
    },
  });
};
