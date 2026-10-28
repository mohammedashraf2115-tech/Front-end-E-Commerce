import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ICategory, IProduct } from '../../core/models/product.model';
import { ProductCard } from './product-card/product-card';

@Component({
  selector: 'app-productslist',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './productslist.html',
  styleUrl: './productslist.css'
})
export class Productslist implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public products: IProduct[] = [];
  public categories: ICategory[] = [];
  public loading: boolean = true;

  public search: string = '';
  public selectedCategory: string = '';
  public minPrice: number | null = null;
  public maxPrice: number | null = null;
  public sortBy: string = 'createdAt';
  public sortOrder: 'asc' | 'desc' = 'desc';

  public currentPage: number = 1;
  public totalPages: number = 1;
  public totalResults: number = 0;

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        this.cdr.detectChanges();
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.search = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.minPrice = params['minPrice'] ? Number(params['minPrice']) : null;
      this.maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : null;
      this.currentPage = params['page'] ? Number(params['page']) : 1;
      this.loadProducts();
    });
  }

  public loadProducts(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.productService
      .getProducts({
        search: this.search || undefined,
        category: this.selectedCategory || undefined,
        minPrice: this.minPrice !== null ? this.minPrice : undefined,
        maxPrice: this.maxPrice !== null ? this.maxPrice : undefined,
        page: this.currentPage,
        limit: 12,
        sort: this.sortBy,
        order: this.sortOrder
      })
      .subscribe({
        next: (res) => {
          this.products = res.data || [];
          this.currentPage = res.page;
          this.totalPages = res.totalPages;
          this.totalResults = res.totalResults;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  public applyFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.search || null,
        category: this.selectedCategory || null,
        minPrice: this.minPrice !== null ? this.minPrice : null,
        maxPrice: this.maxPrice !== null ? this.maxPrice : null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  }

  public resetFilters(): void {
    this.search = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.router.navigate(['/products']);
  }

  public changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: 'merge'
      });
    }
  }
}

