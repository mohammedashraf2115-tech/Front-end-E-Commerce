import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProduct } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard implements OnInit, OnDestroy {
  @Input({ required: true }) product!: IProduct;

  public productService = inject(ProductService);
  public cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  public quantityInCart: number = 0;
  public loading: boolean = false;
  private sub = new Subscription();

  ngOnInit(): void {
    this.quantityInCart = this.cartService.getItemQuantity(this.product._id);

    const s = this.cartService.cartItemsMap$.subscribe((map) => {
      this.quantityInCart = map[this.product._id] || 0;
      this.cdr.detectChanges();
    });
    this.sub.add(s);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public increment(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.product.stock === 0) return;
    if (this.quantityInCart >= this.product.stock) return;

    this.loading = true;
    this.cdr.detectChanges();

    if (this.quantityInCart === 0) {
      this.cartService.addToCart(this.product, 1).subscribe({
        next: () => {
          this.quantityInCart = 1;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      const newQty = this.quantityInCart + 1;
      this.cartService.updateQuantity(this.product._id, newQty).subscribe({
        next: () => {
          this.quantityInCart = newQty;
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

  public decrement(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.quantityInCart <= 0) return;

    this.loading = true;
    this.cdr.detectChanges();

    if (this.quantityInCart === 1) {
      this.cartService.removeItem(this.product._id).subscribe({
        next: () => {
          this.quantityInCart = 0;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      const newQty = this.quantityInCart - 1;
      this.cartService.updateQuantity(this.product._id, newQty).subscribe({
        next: () => {
          this.quantityInCart = newQty;
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
}
