import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAddress, IUser, IUserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user`;

  public getMe(): Observable<IUserResponse> {
    return this.http.get<IUserResponse>(`${this.apiUrl}/me`);
  }

  public updateMe(data: { name?: string; mobile?: string }): Observable<IUserResponse> {
    return this.http.patch<IUserResponse>(`${this.apiUrl}/update-me`, data);
  }

  public addAddress(address: { title: string; street: string; city: string; isDefault?: boolean }): Observable<{ status: string; data: IAddress[] }> {
    return this.http.post<{ status: string; data: IAddress[] }>(`${this.apiUrl}/addresses`, address);
  }

  public updateAddress(addressId: string, address: { title?: string; street?: string; city?: string; isDefault?: boolean }): Observable<{ status: string; data: IAddress[] }> {
    return this.http.put<{ status: string; data: IAddress[] }>(`${this.apiUrl}/addresses/${addressId}`, address);
  }

  public deleteAddress(addressId: string): Observable<{ status: string; data: IAddress[] }> {
    return this.http.delete<{ status: string; data: IAddress[] }>(`${this.apiUrl}/addresses/${addressId}`);
  }

  public setDefaultAddress(addressId: string): Observable<{ status: string; data: IAddress[] }> {
    return this.http.patch<{ status: string; data: IAddress[] }>(`${this.apiUrl}/addresses/${addressId}/default`, {});
  }

  public getAllUsers(): Observable<{ status: string; results: number; data: IUser[] }> {
    return this.http.get<{ status: string; results: number; data: IUser[] }>(this.apiUrl);
  }

  public toggleBlockUser(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/block/${userId}`, {});
  }
}

