import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { IndexProductsComponent } from './views/products/index-products/index-products.component';
import { CategoryProductsComponent } from './views/products/category-products/category-products.component';

export const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent 
    },
    { 
        path: 'products', 
        component: IndexProductsComponent 
    },
    {
        path: 'products/category/:slug',
        component: CategoryProductsComponent
    }
];
