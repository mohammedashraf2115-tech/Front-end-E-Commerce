export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  isActive: boolean;
}

export interface IProduct {
  _id: string;
  title: string;
  description?: string;
  price: number;
  image: string;
  stock: number;
  categoryId: ICategory;
  subcategoryId?: ISubcategory;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
}

export interface IProductListResponse {
  status: string;
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  data: IProduct[];
}

