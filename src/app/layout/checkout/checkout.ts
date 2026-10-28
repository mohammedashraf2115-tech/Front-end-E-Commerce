import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { IUser } from '../../core/models/user.model';
import { ICartData } from '../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  private userService = inject(UserService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  public user: IUser | null = null;
  public cartData: ICartData | null = null;
  public loading: boolean = true;
  public placingOrder: boolean = false;
  public errorMessage: string = '';

  public selectedAddressId: string = '';
  public mobile: string = '';

  public showNewAddressForm: boolean = false;
  public newAddress = { title: 'Home', street: '', city: 'Cairo', isDefault: false };

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartData = res.data;
        if (!this.cartData || this.cartData.items.length === 0) {
          this.router.navigate(['/cart']);
          return;
        }

        this.userService.getMe().subscribe({
          next: (userRes) => {
            this.user = userRes.data;
            this.mobile = this.user.mobile || '';

            if (this.user.addresses && this.user.addresses.length > 0) {
              const defaultAddr = this.user.addresses.find((a) => a.isDefault);
              this.selectedAddressId = defaultAddr?._id || this.user.addresses[0]._id || '';
            } else {
              this.showNewAddressForm = true;
            }
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  public addNewAddress(): void {
    if (!this.newAddress.street || !this.newAddress.city) {
      this.errorMessage = 'Please complete the address fields.';
      return;
    }

    this.userService.addAddress(this.newAddress).subscribe({
      next: (res) => {
        if (this.user) this.user.addresses = res.data;
        const added = res.data[res.data.length - 1];
        if (added && added._id) this.selectedAddressId = added._id;
        this.showNewAddressForm = false;
        this.errorMessage = '';
      },
      error: (err) => (this.errorMessage = err.error?.message || 'Error saving address')
    });
  }

  public placeOrder(): void {
    this.errorMessage = '';

    if (!this.mobile.trim()) {
      this.errorMessage = 'Phone number is required for Cash on Delivery delivery.';
      return;
    }

    if (!this.selectedAddressId) {
      this.errorMessage = 'Please select or add a shipping address.';
      return;
    }

    this.placingOrder = true;
    this.orderService
      .placeOrder({
        addressId: this.selectedAddressId,
        mobile: this.mobile.trim()
      })
      .subscribe({
        next: (res) => {
          this.placingOrder = false;
          this.cartService.refreshCartCount();
          this.router.navigate(['/profile'], { queryParams: { orderSuccess: res.data._id } });
        },
        error: (err) => {
          this.placingOrder = false;
          this.errorMessage = err.error?.message || 'Failed to place order. Please try again.';
        }
      });
  }
}

