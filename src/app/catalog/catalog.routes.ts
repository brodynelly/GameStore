import { Routes } from '@angular/router';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./catalog-list/catalog-list.component').then(m => m.CatalogListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  }
];