import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { IRegisterData } from '../../core/models/auth.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html'
})
export class Signup {
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);

  public loading = false;
  public errorMessage = '';

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this._authService.register(this.signupForm.value as IRegisterData).subscribe({
      next: () => {
        this.loading = false;
        this._cartService.mergeGuestCart().subscribe({
          next: () => this._cartService.refreshCartCount()
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to create account';
      }
    });
  }
}
