import { DecimalPipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { gsap } from 'gsap';
import { CartService } from '../../../services/cart.service';
import {
  ProductRow,
  ProductsService
} from '../../../services/products.service';
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
  imports: [
    DecimalPipe,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './index-products.component.html',
  styleUrl: './index-products.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IndexProductsComponent
  implements OnInit, OnDestroy {
  private readonly productsService =
    inject(ProductsService);

  private readonly cartService =
    inject(CartService);

  private readonly pageSize = 20;

  private readonly addButtonTimelines =
    new Map<HTMLElement, gsap.core.Timeline>();

  products: CatalogProduct[] = [];
  loading = true;
  loadingMore = false;
  hasMore = true;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
  }

  async showMore(): Promise<void> {
    if (this.loadingMore || !this.hasMore) {
      return;
    }

    this.loadingMore = true;

    try {
      await this.loadProducts();
    } finally {
      this.loadingMore = false;
    }
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

  showAddButtonEffect(event: Event): void {
    const button =
      event.currentTarget as HTMLElement;

    const fill =
      button.querySelector<HTMLElement>(
        '.product-card__add-fill'
      );

    const icon =
      button.querySelector<HTMLElement>(
        '.product-card__add-icon'
      );

    if (!fill || !icon) {
      return;
    }

    this.addButtonTimelines
      .get(button)
      ?.kill();

    const timeline = gsap.timeline();

    timeline
      .to(
        fill,
        {
          scale: 4,
          duration: 0.5,
          ease: 'power3.inOut'
        },
        0
      )
      .to(
        icon,
        {
          color: '#18372d',
          rotate: 90,
          scale: 1.08,
          duration: 0.35,
          ease: 'power2.out'
        },
        0.06
      )
      .to(
        button,
        {
          y: -2,
          scale: 1.04,
          duration: 0.35,
          ease: 'power2.out'
        },
        0
      );

    this.addButtonTimelines.set(
      button,
      timeline
    );
  }

  hideAddButtonEffect(event: Event): void {
    const button =
      event.currentTarget as HTMLElement;

    const fill =
      button.querySelector<HTMLElement>(
        '.product-card__add-fill'
      );

    const icon =
      button.querySelector<HTMLElement>(
        '.product-card__add-icon'
      );

    if (!fill || !icon) {
      return;
    }

    this.addButtonTimelines
      .get(button)
      ?.kill();

    const timeline = gsap.timeline();

    timeline
      .to(
        fill,
        {
          scale: 0,
          duration: 0.4,
          ease: 'power3.inOut'
        },
        0
      )
      .to(
        icon,
        {
          color: '#ffffff',
          rotate: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        },
        0
      )
      .to(
        button,
        {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        },
        0
      );

    this.addButtonTimelines.set(
      button,
      timeline
    );
  }

  ngOnDestroy(): void {
    this.addButtonTimelines.forEach(
      timeline => {
        timeline.kill();
      }
    );

    this.addButtonTimelines.clear();
  }

  private async loadProducts(): Promise<void> {
    this.errorMessage = '';

    try {
      const page =
        await this.productsService.getProductsPage(
          this.products.length,
          this.pageSize
        );

      const newProducts = page.products.map(
        row => this.mapProduct(row)
      );

      this.products = [
        ...this.products,
        ...newProducts
      ];

      this.hasMore = page.hasMore;
    } catch (error) {
      console.error(error);

      this.errorMessage =
        'No fue posible cargar los productos.';
    } finally {
      this.loading = false;
    }
  }

  private mapProduct(
    row: ProductRow
  ): CatalogProduct {
    return {
      id: row.id,
      name: row.name,
      category:
        row.category?.trim() || 'Producto',
      cover:
        row.cover ||
        '/products/placeholder.webp',
      price: Number(
        row.discountPrice ||
        row.regularPrice ||
        0
      ),
      label: row.label || undefined
    };
  }
}