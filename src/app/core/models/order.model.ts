export interface IOrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id: string;
  userId: string;
  addressSnapshot: {
    title: string;
    street: string;
    city: string;
  };
  mobileSnapshot: string;
  orderItems: IOrderItem[];
  totalPrice: number;
  status:
    | 'pending'
    | 'preparing'
    | 'shipped'
    | 'delivered'
    | 'received'
    | 'cancelled by admin'
    | 'cancelled by client'
    | 'rejected'
    | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

export interface IOrderResponse {
  status: string;
  message?: string;
  data: IOrder;
}

export interface IOrderListResponse {
  status: string;
  results?: number;
  totalResults?: number;
  data: IOrder[];
}

