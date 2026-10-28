import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-page-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="luxury-page-wrapper py-5">
      <div class="container-xl">
        @if(loading){
          <div class="text-center py-5">
            <div class="spinner-border text-dark" role="status"></div>
          </div>
        } @else if(page){
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="luxury-card p-4 p-md-5">
                <div class="luxury-eyebrow mb-2">Maison Journal</div>
                <h1 class="display-6 font-serif mb-4">{{ page.title }}</h1>
                <p class="text-secondary" style="line-height: 1.85; font-size: 1.05rem;">{{ page.content }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PageView implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  public page: { title: string; content: string } | null = null;
  public loading: boolean = true;

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {
        this.http.get<{ status: string; data: any }>(`${environment.apiUrl}/page/${slug}`).subscribe({
          next: (res) => {
            this.page = res.data;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
