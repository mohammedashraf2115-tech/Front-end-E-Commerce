import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '../services/product.service';
import { IProduct } from '../models/product.model';
import { map, of } from 'rxjs';

export const productDetailsResolver: ResolveFn<IProduct | null> = (route) => {
  const productService = inject(ProductService);
  const slug = route.paramMap.get('slug');

  if (!slug) return of(null);

  return productService.getProductBySlug(slug).pipe(
    map((res) => res.data)
  );
};

