import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ICategory, IProduct } from '../../core/models/product.model';
import { ProductCard } from '../productslist/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  public featuredProducts: IProduct[] = [];
  public categories: ICategory[] = [];
  public loading: boolean = true;

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => this.cdr.detectChanges()
    });

    this.productService.getProducts({ limit: 12, sort: 'createdAt', order: 'desc' }).subscribe({
      next: (res) => {
        this.featuredProducts = res.data || [];
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

