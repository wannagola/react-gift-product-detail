import { GiftItem } from '@/constants/GiftItem';

export interface ProductDetail extends GiftItem {
  description: string;
  announcement: { name: string; value: string; displayOrder: number }[];
}

export interface ProductWish {
  wishCount: number;
  isWished: boolean;
}

export interface ProductReview {
  totalCount: number;
  reviews: {
    id: string;
    authorName: string;
    content: string;
  }[];
}
