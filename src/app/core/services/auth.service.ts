import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IAuthResponse, ILoginData, IRegisterData, IToken } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'ecommerce_token';

  private currentUserSubject = new BehaviorSubject<IToken | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkToken();
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      const decoded = this.decode(token);
      if (decoded?.exp && Date.now() < decoded.exp * 1000) {
        this.currentUserSubject.next(decoded);
        return;
      }
    }
    this.clearAuth();
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decode(token);
    return !!decoded?.exp && Date.now() < decoded.exp * 1000;
  }

  public hasRole(role: 'admin' | 'user'): boolean {
    return this.isLoggedIn() && this.currentUserSubject.value?.role === role;
  }

  public getCurrentUser(): IToken | null {
    return this.currentUserSubject.value;
  }

  public login(data: ILoginData) {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        if (res.data?.token) {
          this.saveToken(res.data.token);
          const decoded = this.decode(res.data.token);
          if (decoded) {
            this.currentUserSubject.next(decoded);
            if (decoded.role === 'admin') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          }
        }
      })
    );
  }

  public register(data: IRegisterData) {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        if (res.data?.token) {
          this.saveToken(res.data.token);
          const decoded = this.decode(res.data.token);
          if (decoded) {
            this.currentUserSubject.next(decoded);
            this.router.navigate(['/']);
          }
        }
      })
    );
  }

  public clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  public logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private decode(token: string): IToken | null {
    try {
      return jwtDecode<IToken>(token);
    } catch {
      return null;
    }
  }
}

