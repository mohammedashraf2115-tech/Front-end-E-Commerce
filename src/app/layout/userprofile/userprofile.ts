import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { IUser, IAddress } from '../../core/models/user.model';
import { IOrder } from '../../core/models/order.model';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './userprofile.html',
  styleUrl: './userprofile.css'
})
export class Userprofile implements OnInit {
  private userService = inject(UserService);
  private orderService = inject(OrderService);
  public productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  public user: IUser | null = null;
  public orders: IOrder[] = [];
  public activeTab: 'profile' | 'addresses' | 'orders' = 'profile';

  public loadingUser: boolean = true;
  public loadingOrders: boolean = false;
  public orderSuccessId: string | null = null;

  public editName: string = '';
  public editMobile: string = '';
  public profileMsg: string = '';

  public showAddAddressModal: boolean = false;
  public newAddress: IAddress = { title: 'Home', street: '', city: 'Cairo', isDefault: false };

  ngOnInit(): void {
    this.route.queryParams.subscribe((p) => {
      if (p['orderSuccess']) {
        this.orderSuccessId = p['orderSuccess'];
        this.activeTab = 'orders';
      }
    });

    this.loadProfile();
  }

  public loadProfile(): void {
    this.loadingUser = true;
    this.cdr.detectChanges();
    this.userService.getMe().subscribe({
      next: (res) => {
        this.user = res.data;
        this.editName = this.user.name;
        this.editMobile = this.user.mobile || '';
        this.loadingUser = false;
        this.cdr.detectChanges();
        if (this.activeTab === 'orders') {
          this.loadOrders();
        }
      },
      error: () => {
        this.loadingUser = false;
        this.cdr.detectChanges();
      }
    });
  }

  public loadOrders(): void {
    this.loadingOrders = true;
    this.cdr.detectChanges();
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this.loadingOrders = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingOrders = false;
        this.cdr.detectChanges();
      }
    });
  }

  public updateProfile(): void {
    this.userService.updateMe({ name: this.editName, mobile: this.editMobile }).subscribe({
      next: (res) => {
        this.user = res.data;
        this.profileMsg = 'Profile updated successfully!';
        setTimeout(() => (this.profileMsg = ''), 2500);
      }
    });
  }

  public saveNewAddress(): void {
    if (!this.newAddress.street || !this.newAddress.city) return;

    this.userService.addAddress(this.newAddress).subscribe({
      next: (res) => {
        if (this.user) this.user.addresses = res.data;
        this.showAddAddressModal = false;
        this.newAddress = { title: 'Home', street: '', city: 'Cairo', isDefault: false };
      }
    });
  }

  public deleteAddress(id?: string): void {
    if (!id) return;
    this.userService.deleteAddress(id).subscribe({
      next: (res) => {
        if (this.user) this.user.addresses = res.data;
      }
    });
  }

  public setDefaultAddress(id?: string): void {
    if (!id) return;
    this.userService.setDefaultAddress(id).subscribe({
      next: (res) => {
        if (this.user) this.user.addresses = res.data;
      }
    });
  }

  public cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => this.loadOrders()
      });
    }
  }

  public switchTab(tab: 'profile' | 'addresses' | 'orders'): void {
    this.activeTab = tab;
    if (tab === 'orders' && this.orders.length === 0) {
      this.loadOrders();
    }
  }
}

