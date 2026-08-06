import { DecimalPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { ProductRow, ProductsService } from '../../../services/products.service';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderComponent } from '../../../shared/header/header.component';

interface CatalogProduct {
  id: number;
  name: string;
  category: string;
  cover: string;
  price: number;
  label?: string;
}

@Component({
  selector: 'app-index-products',
  imports: [DecimalPipe, HeaderComponent, FooterComponent],
  templateUrl: './index-products.component.html',
  styleUrl: './index-products.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IndexProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly pageSize = 20;

  products: CatalogProduct[] = [];
  loading = true;
  loadingMore = false;
  hasMore = true;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
  }

  async showMore(): Promise<void> {
    if (this.loadingMore || !this.hasMore) return;
    this.loadingMore = true;
    await this.loadProducts();
    this.loadingMore = false;
  }

  addToCart(product: CatalogProduct): void {
    this.cartService.add({
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.cover,
      price: product.price
    });
  }

  cartQuantity(productId: number): number {
    return this.cartService.quantityOf(productId);
  }

  private async loadProducts(): Promise<void> {
    this.errorMessage = '';

    try {
      const page = await this.productsService.getProductsPage(
        this.products.length,
        this.pageSize
      );

      const newProducts = page.products.map(row => this.mapProduct(row));
      this.products = [...this.products, ...newProducts];
      this.hasMore = page.hasMore;
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No fue posible cargar los productos.';
    } finally {
      this.loading = false;
    }
  }

  private mapProduct(row: ProductRow): CatalogProduct {
    return {
      id: row.id,
      name: row.name,
      category: row.category?.trim() || 'Producto',
      cover: row.cover || '/products/placeholder.webp',
      price: Number(row.discountPrice || row.regularPrice || 0),
      label: row.label || undefined
    };
  }

}
