import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IOrder, IOrderListResponse, IOrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/order`;

  public placeOrder(orderData: { addressId?: string; mobile?: string }): Observable<IOrderResponse> {
    return this.http.post<IOrderResponse>(this.apiUrl, orderData);
  }

  public getMyOrders(): Observable<IOrderListResponse> {
    return this.http.get<IOrderListResponse>(`${this.apiUrl}/my-orders`);
  }

  public getOrderById(id: string): Observable<IOrderResponse> {
    return this.http.get<IOrderResponse>(`${this.apiUrl}/${id}`);
  }

  public cancelOrder(id: string): Observable<IOrderResponse> {
    return this.http.patch<IOrderResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }

  public getAllOrders(status?: string, page: number = 1, limit: number = 20): Observable<IOrderListResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<IOrderListResponse>(this.apiUrl, { params });
  }

  public updateOrderStatus(id: string, status: string): Observable<IOrderResponse> {
    return this.http.patch<IOrderResponse>(`${this.apiUrl}/${id}/status`, { status });
  }
}

