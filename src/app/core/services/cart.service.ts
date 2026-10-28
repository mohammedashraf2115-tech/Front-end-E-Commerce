import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICartData, ICartResponse } from '../models/cart.model';
import { IProduct } from '../models/product.model';
import { AuthService } from './auth.service';

export interface IGuestCartItem {
  productId: string;
  quantity: number;
  product?: IProduct;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/cart`;

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  private cartItemsMapSubject = new BehaviorSubject<{ [productId: string]: number }>({});
  public cartItemsMap$ = this.cartItemsMapSubject.asObservable();

  private guestCartKey = 'guest_cart';

  constructor() {
    this.refreshCartCount();
  }

  public getCart(): Observable<ICartResponse> {
    return this.http.get<ICartResponse>(this.apiUrl).pipe(
      tap((res) => {
        this.updateMapAndCountFromItems(res.data?.items || []);
      })
    );
  }

  public getGuestCartData(): Observable<ICartData> {
    const items = this.getGuestCart();
    const cartItems = items
      .filter((i) => i.product)
      .map((i) => ({
        product: i.product!,
        quantity: i.quantity,
        priceAtAdd: i.product!.price,
        currentPrice: i.product!.price,
        isPriceChanged: false,
        itemTotal: i.product!.price * i.quantity
      }));

    const totalPrice = cartItems.reduce((sum, i) => sum + i.itemTotal, 0);

    return of({
      items: cartItems,
      hasPriceChanged: false,
      totalPrice
    });
  }

  public getItemQuantity(productId: string): number {
    return this.cartItemsMapSubject.value[productId] || 0;
  }

  public addToCart(productOrId: string | IProduct, quantity: number = 1): Observable<any> {
    const productId = typeof productOrId === 'string' ? productOrId : productOrId._id;
    const product = typeof productOrId === 'string' ? undefined : productOrId;

    if (!this.authService.isLoggedIn()) {
      this.addToGuestCart(productId, quantity, product);
      return of({ status: 'success', message: 'Added to guest cart' });
    }

    return this.http.post(`${this.apiUrl}/items`, { productId, quantity }).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  public updateQuantity(productId: string, quantity: number): Observable<any> {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    if (!this.authService.isLoggedIn()) {
      const cart = this.getGuestCart();
      const item = cart.find((i) => i.productId === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
        this.refreshCartCount();
      }
      return of({ status: 'success', message: 'Guest cart updated' });
    }

    return this.http.patch(`${this.apiUrl}/items/${productId}`, { quantity }).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  public removeItem(productId: string): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      let cart = this.getGuestCart();
      cart = cart.filter((i) => i.productId !== productId);
      localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
      this.refreshCartCount();
      return of({ status: 'success', message: 'Item removed from guest cart' });
    }

    return this.http.delete(`${this.apiUrl}/items/${productId}`).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  public clearCart(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      this.clearGuestCart();
      this.cartCountSubject.next(0);
      this.cartItemsMapSubject.next({});
      return of({ status: 'success' });
    }

    return this.http.delete(this.apiUrl).pipe(
      tap(() => {
        this.cartCountSubject.next(0);
        this.cartItemsMapSubject.next({});
      })
    );
  }

  public acceptNewPrices(): Observable<any> {
    return this.http.post(`${this.apiUrl}/accept-prices`, {});
  }

  public mergeGuestCart(): Observable<any> {
    const guestItems = this.getGuestCart();
    if (guestItems.length === 0) {
      return of(null);
    }

    const payload = guestItems.map((i) => ({ productId: i.productId, quantity: i.quantity }));

    return this.http.post(`${this.apiUrl}/merge`, { items: payload }).pipe(
      tap(() => {
        this.clearGuestCart();
        this.refreshCartCount();
      })
    );
  }

  public refreshCartCount(): void {
    if (this.authService.isLoggedIn()) {
      this.getCart().subscribe({
        next: (res) => {
          this.updateMapAndCountFromItems(res.data?.items || []);
        },
        error: () => {
          this.cartCountSubject.next(0);
          this.cartItemsMapSubject.next({});
        }
      });
    } else {
      const items = this.getGuestCart();
      const map: { [id: string]: number } = {};
      let count = 0;
      for (const item of items) {
        map[item.productId] = (map[item.productId] || 0) + item.quantity;
        count += item.quantity;
      }
      this.cartItemsMapSubject.next(map);
      this.cartCountSubject.next(count);
    }
  }

  private updateMapAndCountFromItems(items: any[]): void {
    const map: { [id: string]: number } = {};
    let count = 0;
    for (const item of items) {
      const id = item.product?._id || item.productId || item.product;
      if (id) {
        map[id] = item.quantity;
        count += item.quantity;
      }
    }
    this.cartItemsMapSubject.next(map);
    this.cartCountSubject.next(count);
  }

  public getGuestCart(): IGuestCartItem[] {
    const saved = localStorage.getItem(this.guestCartKey);
    return saved ? JSON.parse(saved) : [];
  }

  private addToGuestCart(productId: string, quantity: number, product?: IProduct): void {
    const cart = this.getGuestCart();
    const existing = cart.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
      if (product) existing.product = product;
    } else {
      cart.push({ productId, quantity, product });
    }
    localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
    this.refreshCartCount();
  }

  private clearGuestCart(): void {
    localStorage.removeItem(this.guestCartKey);
  }
}
