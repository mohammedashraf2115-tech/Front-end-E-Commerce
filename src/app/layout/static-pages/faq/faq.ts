import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html'
})
export class FAQ implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  public faqs: Array<{ _id: string; question: string; answer: string }> = [];
  public loading: boolean = true;

  ngOnInit(): void {
    this.http.get<{ status: string; data: any[] }>(`${environment.apiUrl}/faq`).subscribe({
      next: (res) => {
        this.faqs = res.data || [];
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

