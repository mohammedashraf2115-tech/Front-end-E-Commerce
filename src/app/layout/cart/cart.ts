import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { ICartData } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  public cartService = inject(CartService);
  public productService = inject(ProductService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  public cartData: ICartData | null = null;
  public loading: boolean = true;
  public updating: boolean = false;

  ngOnInit(): void {
    this.loadCart();
  }

  public loadCart(): void {
    this.loading = true;
    this.cdr.detectChanges();
    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe({
        next: (res) => {
          this.cartData = res.data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.cartService.getGuestCartData().subscribe({
        next: (data) => {
          this.cartData = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  public updateQty(productId: string, quantity: number): void {
    if (quantity < 1) return;
    this.updating = true;
    this.cdr.detectChanges();
    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: () => {
        this.updating = false;
        this.loadCart();
      },
      error: () => {
        this.updating = false;
        this.cdr.detectChanges();
      }
    });
  }

  public removeItem(productId: string): void {
    this.updating = true;
    this.cdr.detectChanges();
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.updating = false;
        this.loadCart();
      },
      error: () => {
        this.updating = false;
        this.cdr.detectChanges();
      }
    });
  }

  public acceptPrices(): void {
    this.updating = true;
    this.cdr.detectChanges();
    this.cartService.acceptNewPrices().subscribe({
      next: () => {
        this.updating = false;
        this.loadCart();
      },
      error: () => {
        this.updating = false;
        this.cdr.detectChanges();
      }
    });
  }

  public proceedToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}

