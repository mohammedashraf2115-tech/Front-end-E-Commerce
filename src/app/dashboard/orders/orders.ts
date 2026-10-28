import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { IOrder } from '../../core/models/order.model';

@Component({
  selector: 'app-dashboard-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html'
})
export class DashboardOrders implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  public orders: IOrder[] = [];
  public loading: boolean = true;
  public statusFilter: string = '';

  public allowedStatuses = [
    'pending',
    'preparing',
    'shipped',
    'delivered',
    'received',
    'cancelled by admin',
    'rejected',
    'refunded'
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  public loadOrders(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.orderService.getAllOrders(this.statusFilter || undefined).subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  public updateStatus(orderId: string, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => this.loadOrders()
    });
  }
}

