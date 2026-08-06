import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { IndexProductsComponent } from './views/products/index-products/index-products.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: IndexProductsComponent },
];
