import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { AxiosError } from 'axios';
import { API_PATH } from '@/constants/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type OrderParams = {
  productId: number;
  message: string;
  messageCardId: string;
  ordererName: string;
  receivers: {
    name: string;
    phoneNumber: string;
    quantity: number;
  }[];
};

type OrderErrorResponse = {
  message?: string;
};

const submitOrder = async ({
  order,
  token,
}: {
  order: OrderParams;
  token: string;
}) => {
  const res = await apiClient.post(API_PATH.ORDER, order, {
    headers: {
      Authorization: token,
    },
  });
  return res.data;
};

export const useOrderMutation = () => {
  const navigate = useNavigate();

  return useMutation<
    unknown,
    AxiosError<OrderErrorResponse>,
    { order: OrderParams; token: string }
  >({
    mutationFn: submitOrder,
    onSuccess: () => {
      toast.success('주문이 성공적으로 완료되었습니다.');
      navigate('/');
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        navigate('/login');
        toast.error('로그인이 필요합니다.');
      } else {
        toast.error(error.response?.data?.message ?? '주문에 실패했습니다.');
      }
    },
  });
};
