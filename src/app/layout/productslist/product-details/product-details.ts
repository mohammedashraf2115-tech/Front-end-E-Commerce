import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  public productService = inject(ProductService);
  public cartService = inject(CartService);

  public product: IProduct | null = null;
  public relatedProducts: IProduct[] = [];
  public quantity: number = 1;

  public adding: boolean = false;
  public addedSuccess: boolean = false;

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.product = data['productRes'];
      if (this.product) {
        this.quantity = 1;
        this.loadRelated(this.product.slug);
      }
      this.cdr.detectChanges();
    });
  }

  private loadRelated(slug: string): void {
    this.productService.getRelatedProducts(slug).subscribe({
      next: (res) => {
        this.relatedProducts = res.data || [];
        this.cdr.detectChanges();
      }
    });
  }

  public addToCart(): void {
    if (!this.product || this.product.stock === 0) return;

    if (this.quantity > this.product.stock) {
      this.quantity = this.product.stock;
    }

    this.adding = true;
    this.cdr.detectChanges();
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: () => {
        this.adding = false;
        this.addedSuccess = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.addedSuccess = false;
          this.cdr.detectChanges();
        }, 2000);
      },
      error: () => {
        this.adding = false;
        this.cdr.detectChanges();
      }
    });
  }
}

