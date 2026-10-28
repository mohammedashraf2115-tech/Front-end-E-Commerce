import { IProduct } from './product.model';

export interface ICartItem {
  product: IProduct;
  quantity: number;
  priceAtAdd: number;
  currentPrice: number;
  isPriceChanged: boolean;
  itemTotal: number;
}

export interface ICartData {
  items: ICartItem[];
  hasPriceChanged: boolean;
  totalPrice: number;
}

export interface ICartResponse {
  status: string;
  data: ICartData;
}

