export interface ThemeInfo {
  themeId: number;
  name: string;
  description: string;
  backgroundColor: string;
}

export interface Product {
  id: number;
  name: string;
  imageURL: string;
  price: {
    sellingPrice: number;
  };
}
