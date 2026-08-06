import { DecimalPipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { gsap } from 'gsap';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../services/cart.service';
import {
  ProductRow,
  ProductsService
} from '../../../../services/products.service';

interface FeaturedProduct {
  id: number;
  name: string;
  category: string;
  cover: string;
  alt: string;
  origin: string;
  originLabel: string;
  flag: string;
  format: string;
  price: number;
  link: string;
  label?: string;
}

@Component({
  selector: 'app-featured-home',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './featured-home.component.html',
  styleUrl: './featured-home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeaturedHomeComponent
  implements OnInit, OnDestroy {
  private readonly productsService =
    inject(ProductsService);

  private readonly cartService =
    inject(CartService);

  private buttonTimeline?: gsap.core.Timeline;

  private addButtonTimelines =
    new Map<HTMLElement, gsap.core.Timeline>();

  products: FeaturedProduct[] = [];
  loading = true;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    try {
      const rows =
        await this.productsService.getFeaturedProducts();

      this.products = rows.map(row =>
        this.mapProduct(row)
      );
    } catch (error) {
      console.error(error);

      this.errorMessage =
        'No fue posible cargar los productos.';
    } finally {
      this.loading = false;
    }
  }

  addToCart(
    product: FeaturedProduct,
    event: Event
  ): void {
    event.preventDefault();
    event.stopPropagation();

    this.cartService.add({
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.cover,
      price: product.price
    });
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
      .to(fill, {
        scale: 4,
        duration: 0.5,
        ease: 'power3.inOut'
      }, 0)
      .to(icon, {
        color: '#18372d',
        rotate: 90,
        scale: 1.08,
        duration: 0.35,
        ease: 'power2.out'
      }, 0.06)
      .to(button, {
        y: -2,
        scale: 1.04,
        duration: 0.35,
        ease: 'power2.out'
      }, 0);

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
      .to(fill, {
        scale: 0,
        duration: 0.4,
        ease: 'power3.inOut'
      }, 0)
      .to(icon, {
        color: '#ffffff',
        rotate: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
      .to(button, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0);

    this.addButtonTimelines.set(
      button,
      timeline
    );
  }

  showButtonEffect(event: Event): void {
    const button = event.currentTarget as HTMLElement;

    const fill =
      button.querySelector<HTMLElement>(
        '.featured__button-fill'
      );

    const label =
      button.querySelector<HTMLElement>(
        '.featured__button-label'
      );

    const arrow =
      button.querySelector<HTMLElement>(
        '.featured__button-arrow'
      );

    if (!fill || !label || !arrow) {
      return;
    }

    this.buttonTimeline?.kill();
    this.buttonTimeline = gsap.timeline();

    this.buttonTimeline
      .to(
        fill,
        {
          scale: 6,
          duration: 0.55,
          ease: 'power3.inOut'
        },
        0
      )
      .to(
        label,
        {
          color: '#18372d',
          duration: 0.25
        },
        0.18
      )
      .to(
        arrow,
        {
          color: '#18372d',
          x: 5,
          duration: 0.35,
          ease: 'power2.out'
        },
        0.18
      )
      .to(
        button,
        {
          y: -2,
          duration: 0.35,
          ease: 'power2.out'
        },
        0
      )
      .set(
        button,
        {
          backgroundColor: '#f6ecc8'
        },
        0.5
      );
  }

  hideButtonEffect(event: Event): void {
    const button = event.currentTarget as HTMLElement;

    const fill =
      button.querySelector<HTMLElement>(
        '.featured__button-fill'
      );

    const label =
      button.querySelector<HTMLElement>(
        '.featured__button-label'
      );

    const arrow =
      button.querySelector<HTMLElement>(
        '.featured__button-arrow'
      );

    if (!fill || !label || !arrow) {
      return;
    }

    this.buttonTimeline?.kill();
    this.buttonTimeline = gsap.timeline();

    this.buttonTimeline
      .set(button, {
        backgroundColor: '#3b5545'
      })
      .to(
        fill,
        {
          scale: 0,
          duration: 0.45,
          ease: 'power3.inOut'
        },
        0
      )
      .to(
        label,
        {
          color: '#ffffff',
          duration: 0.25
        },
        0.08
      )
      .to(
        arrow,
        {
          color: '#ffffff',
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        },
        0.08
      )
      .to(
        button,
        {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        },
        0
      );
  }

  ngOnDestroy(): void {
    this.buttonTimeline?.kill();

    this.addButtonTimelines.forEach(
      timeline => {
        timeline.kill();
      }
    );

    this.addButtonTimelines.clear();
  }

  private mapProduct(
    row: ProductRow
  ): FeaturedProduct {
    return {
      id: row.id,
      name: row.name,
      category:
        row.category?.trim() || 'Producto',
      cover:
        row.cover ||
        '/products/placeholder.webp',
      alt: row.name,
      origin: row.origin || '',
      originLabel:
        row.origin ||
        'Origen no especificado',
      flag: this.getCountryFlag(row.origin),
      format: row.format || '',
      price: Number(
        row.discountPrice ||
        row.regularPrice ||
        0
      ),
      link: `/productos/${row.id}`,
      label: row.label || undefined
    };
  }

  private getCountryFlag(
    origin: string | null
  ): string {
    const flags: Record<string, string> = {
      'Estados Unidos':
        '/flags/united-states.svg',
      China:
        '/flags/china.svg',
      Perú:
        '/flags/peru.svg',
      Canadá:
        '/flags/canada.svg',
      Alemania:
        '/flags/germany.svg',
      Francia:
        '/flags/france.svg'
    };

    return origin
      ? flags[origin] ?? '🌎'
      : '🌎';
  }

  cartQuantity(productId: number): number {
    return this.cartService.quantityOf(productId);
  }
}
