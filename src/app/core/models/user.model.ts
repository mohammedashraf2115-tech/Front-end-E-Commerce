export interface IAddress {
  _id?: string;
  title: string;
  street: string;
  city: string;
  isDefault: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  mobile?: string;
  addresses: IAddress[];
  isBlocked: boolean;
  createdAt?: string;
}

export interface IUserResponse {
  status: string;
  data: IUser;
}

