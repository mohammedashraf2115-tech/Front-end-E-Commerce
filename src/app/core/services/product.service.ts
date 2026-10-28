import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICategory, IProduct, IProductListResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/product`;
  private categoryUrl = `${environment.apiUrl}/category`;

  public getProducts(filters?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Observable<IProductListResponse> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.sort) params = params.set('sort', filters.sort);
      if (filters.order) params = params.set('order', filters.order);
    }
    return this.http.get<IProductListResponse>(this.apiUrl, { params });
  }

  public getProductBySlug(slug: string): Observable<{ status: string; data: IProduct }> {
    return this.http.get<{ status: string; data: IProduct }>(`${this.apiUrl}/${slug}`);
  }

  public getRelatedProducts(slug: string): Observable<{ status: string; results: number; data: IProduct[] }> {
    return this.http.get<{ status: string; results: number; data: IProduct[] }>(`${this.apiUrl}/related/${slug}`);
  }

  public getCategories(): Observable<{ status: string; results: number; data: ICategory[] }> {
    return this.http.get<{ status: string; results: number; data: ICategory[] }>(this.categoryUrl);
  }

  public getCategoryBySlug(slug: string): Observable<{ status: string; data: ICategory }> {
    return this.http.get<{ status: string; data: ICategory }>(`${this.categoryUrl}/${slug}`);
  }

  public addProduct(formData: FormData): Observable<{ status: string; message: string; data: IProduct }> {
    return this.http.post<{ status: string; message: string; data: IProduct }>(this.apiUrl, formData);
  }

  public updateProduct(id: string, formData: FormData): Observable<{ status: string; message: string; data: IProduct }> {
    return this.http.put<{ status: string; message: string; data: IProduct }>(`${this.apiUrl}/${id}`, formData);
  }

  public deleteProduct(id: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/${id}`);
  }

  public getImageUrl(imageName?: string): string {
    if (!imageName) return 'assets/placeholder.png';
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
      return imageName;
    }
    return `${environment.filesUrl}/${imageName}`;
  }
}

