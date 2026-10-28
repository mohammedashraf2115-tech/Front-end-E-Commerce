import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container py-5 my-5 text-center">
      <h1 class="display-1 fw-bold text-muted">404</h1>
      <h3 class="fw-bold mb-3">Page Not Found</h3>
      <p class="text-muted mb-4">The page you are looking for might have been removed or is temporarily unavailable.</p>
      <a routerLink="/" class="btn btn-warning px-4 py-2 fw-semibold">Back to Home</a>
    </div>
  `
})
export class NotFound {}

