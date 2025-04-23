import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'catalog',
    loadChildren: () => import('./catalog/catalog.routes').then(r => r.CATALOG_ROUTES)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];