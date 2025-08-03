export type FilterValue = 'ALL' | 'FEMALE' | 'MALE' | 'TEEN';
export type TabValue = 'MANY_WISH' | 'MANY_RECEIVE' | 'MANY_WISH_RECEIVE';

export interface Product {
  id: number;
  name: string;
  price: {
    basicPrice: number;
    sellingPrice: number;
    discountRate: number;
  };
  imageURL: string;
  brandName: string;
}
