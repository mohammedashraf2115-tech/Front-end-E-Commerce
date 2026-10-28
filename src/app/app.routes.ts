import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './layout/home/home';
import { Productslist } from './layout/productslist/productslist';
import { ProductDetails } from './layout/productslist/product-details/product-details';
import { Cart } from './layout/cart/cart';
import { Checkout } from './layout/checkout/checkout';
import { Userprofile } from './layout/userprofile/userprofile';
import { Login } from './layout/login/login';
import { Signup } from './layout/signup/signup';
import { FAQ } from './layout/static-pages/faq/faq';
import { PageView } from './layout/static-pages/page-view/page-view';
import { NotFound } from './shared/not-found/not-found';
import { Dashboard } from './dashboard/dashboard';
import { DashboardHome } from './dashboard/home/home';
import { DashboardOrders } from './dashboard/orders/orders';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { productDetailsResolver } from './core/resolvers/product-details.resolver';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'products', component: Productslist },
      {
        path: 'products/:slug',
        component: ProductDetails,
        resolve: {
          productRes: productDetailsResolver
        }
      },
      { path: 'cart', component: Cart },
      { path: 'checkout', component: Checkout, canActivate: [authGuard] },
      { path: 'profile', component: Userprofile, canActivate: [authGuard] },
      { path: 'login', component: Login },
      { path: 'signup', component: Signup },
      { path: 'faq', component: FAQ },
      { path: 'policies', component: PageView, data: { slug: 'policies' } },
      { path: 'about-us', component: PageView, data: { slug: 'about-us' } },
      { path: 'contact-us', component: PageView, data: { slug: 'contact-us' } }
    ]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHome },
      { path: 'orders', component: DashboardOrders }
    ]
  },
  { path: '**', component: NotFound }
];

