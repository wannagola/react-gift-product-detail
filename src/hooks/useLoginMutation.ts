import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { AxiosError } from 'axios';

type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message?: string;
  data?: {
    message?: string;
    email: string;
    name: string;
    authToken: string;
  };
};

const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/login', payload);
  return response.data;
};

export const useLoginMutation = () => {
  return useMutation<LoginResponse, AxiosError<LoginResponse>, LoginPayload>({
    mutationFn: loginUser,
  });
};
