import { apiClient } from './apiClient';
import { GiftItem } from '@/constants/GiftItem';
import { ProductDetail, ProductWish, ProductReview } from '@/types/product';

interface ApiResponse<T> {
  data: T;
}

export const fetchProductSummary = async (
  productId: number
): Promise<GiftItem> => {
  const response = await apiClient.get<ApiResponse<{
    id: number;
    name: string;
    brandName: string;
    price: number;
    imageURL: string;
  }>>(
    `/api/products/${productId}/summary`
  );

  const apiData = response.data.data;

  return {
    id: apiData.id,
    name: apiData.name,
    brandName: apiData.brandName,
    imageURL: apiData.imageURL,
    price: {
      basicPrice: apiData.price,
      sellingPrice: apiData.price,
      discountRate: 0,
    },
  };
};

export const fetchProductDetail = async (
  productId: number
): Promise<ProductDetail> => {
  const response = await apiClient.get<ApiResponse<ProductDetail>>(
    `/api/products/${productId}/detail`
  );
  return response.data.data;
};

export const fetchProductHighlightReview = async (
  productId: number
): Promise<ProductReview> => {
  const response = await apiClient.get<ApiResponse<ProductReview>>(
    `/api/products/${productId}/highlight-review`
  );
  return response.data.data;
};

export const fetchProductWish = async (
  productId: number
): Promise<ProductWish> => {
  const response = await apiClient.get<ApiResponse<ProductWish>>(
    `/api/products/${productId}/wish`
  );
  return response.data.data;
};

export const toggleProductWish = async (productId: number): Promise<void> => {
  await apiClient.get(`/api/products/${productId}/wish`);
};
