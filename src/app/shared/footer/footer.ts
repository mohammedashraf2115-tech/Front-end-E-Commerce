import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="luxury-footer mt-auto pt-5 pb-4">
      <div class="container-xl">
        <div class="row g-5 pb-5 border-bottom border-secondary border-opacity-25">
          
          <!-- Col 1: Brand Wordmark & Philosophy -->
          <div class="col-lg-5">
            <div class="luxury-footer-logo font-serif mb-2">L'ATELIER</div>
            <div class="luxury-footer-sub mb-3">FINE LEATHER MAISON &bull; CAIRO, EGYPT</div>
            <p class="text-stone-light small mb-4" style="max-width: 380px; line-height: 1.7;">
              Dedicated to the preservation of artisan leathercraft. Every piece is handcrafted from full-grain vegetable-tanned hides with reinforced brass appointments.
            </p>
            <div class="d-flex align-items-center gap-3 text-gold">
              <i class="fa-solid fa-award"></i>
              <span class="small" style="letter-spacing: 0.05em;">Complimentary Cash on Delivery Nationwide</span>
            </div>
          </div>

          <!-- Col 2: The Archive Collections -->
          <div class="col-6 col-lg-3">
            <div class="footer-col-title luxury-eyebrow mb-3">The Collections</div>
            <ul class="list-unstyled footer-links d-flex flex-column gap-2 mb-0">
              <li><a routerLink="/products" class="footer-link">Full Archive</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'briefcases'}" class="footer-link">Briefcases & Folios</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'backpacks'}" class="footer-link">Travel & Backpacks</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'messengers'}" class="footer-link">Executive Messengers</a></li>
            </ul>
          </div>

          <!-- Col 3: Maison Care & Policies -->
          <div class="col-6 col-lg-4">
            <div class="footer-col-title luxury-eyebrow mb-3">Atelier Services</div>
            <ul class="list-unstyled footer-links d-flex flex-column gap-2 mb-0">
              <li><a routerLink="/faq" class="footer-link">Cash on Delivery & Shipping Protocol</a></li>
              <li><a routerLink="/faq" class="footer-link">Leather Care & Restoration</a></li>
              <li><a routerLink="/about-us" class="footer-link">The Egyptian Workshop Story</a></li>
              <li><a routerLink="/profile" class="footer-link">Client Account & Order Archive</a></li>
            </ul>
          </div>

        </div>

        <!-- Sub Footer -->
        <div class="pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div class="footer-copyright small">
            &copy; 2026 L'ATELIER MAISON DE CUIR. ALL RIGHTS RESERVED.
          </div>
          <div class="footer-trust-pill small">
            <i class="fa-solid fa-shield-halved text-gold me-2"></i>
            100% Genuine Full-Grain Leather Guaranteed
          </div>
        </div>

      </div>
    </footer>
  `,
  styles: [`
    .luxury-footer {
      background-color: #121110;
      color: #E7E3DA;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .luxury-footer-logo {
      font-size: 2rem;
      letter-spacing: 0.15em;
      color: #FFFFFF;
    }
    .luxury-footer-sub {
      font-size: 0.65rem;
      letter-spacing: 0.22em;
      color: var(--accent-gold);
      font-weight: 600;
    }
    .text-stone-light {
      color: #A8A29E;
    }
    .text-gold {
      color: var(--accent-gold);
    }
    .footer-col-title {
      color: #FFFFFF;
      font-size: 0.75rem;
    }
    .footer-links {
      font-size: 0.85rem;
    }
    .footer-link {
      color: #A8A29E;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-link:hover {
      color: var(--accent-gold);
    }
    .footer-copyright {
      color: #78716C;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
    }
    .footer-trust-pill {
      color: #A8A29E;
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
    }
  `]
})
export class Footer {}
