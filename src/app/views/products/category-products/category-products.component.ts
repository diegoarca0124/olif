import { DecimalPipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { Subscription } from 'rxjs';
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

interface CategoryConfig {
  name: string;
  description: string;
}

const CATEGORY_CONFIG: Record<
  string,
  CategoryConfig
> = {
  vitaminas: {
    name: 'Vitaminas',
    description:
      'Vitaminas y suplementos para acompañar tu bienestar diario.'
  },
  'cereales-frutos-secos': {
    name: 'Cereales & frutos secos',
    description:
      'Cereales, semillas y frutos secos para disfrutar cada día.'
  },
  'cuidado-diabetes': {
    name: 'Cuidado diabetes',
    description:
      'Productos para el control y cuidado diario de la diabetes.'
  },
  'cuidado-personal': {
    name: 'Cuidado personal',
    description:
      'Productos esenciales para el cuidado del cuerpo y la piel.'
  },
  limpieza: {
    name: 'Limpieza',
    description:
      'Soluciones prácticas para mantener limpio y cuidado tu hogar.'
  },
  alimentos: {
    name: 'Alimentos',
    description:
      'Opciones saludables y prácticas para disfrutar todos los días.'
  }
};

@Component({
  selector: 'app-category-products',
  imports: [
    DecimalPipe,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl:
    './category-products.component.html',
  styleUrl:
    './category-products.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryProductsComponent
  implements OnInit, OnDestroy {
  private readonly route =
    inject(ActivatedRoute);

  private readonly productsService =
    inject(ProductsService);

  private readonly cartService =
    inject(CartService);

  private readonly pageSize = 20;

  private readonly addButtonTimelines =
    new Map<
      HTMLElement,
      gsap.core.Timeline
    >();

  private routeSubscription?: Subscription;

  products: CatalogProduct[] = [];

  categoryName = '';
  categoryDescription = '';

  loading = true;
  loadingMore = false;
  hasMore = true;
  categoryFound = true;
  errorMessage = '';

  ngOnInit(): void {
    this.routeSubscription =
      this.route.paramMap.subscribe(
        params => {
          const slug =
            params.get('slug') ?? '';

          void this.initializeCategory(
            slug
          );
        }
      );
  }

  async showMore(): Promise<void> {
    if (
      this.loadingMore ||
      !this.hasMore ||
      !this.categoryFound
    ) {
      return;
    }

    this.loadingMore = true;

    try {
      await this.loadProducts();
    } finally {
      this.loadingMore = false;
    }
  }

  addToCart(
    product: CatalogProduct
  ): void {
    this.cartService.add({
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.cover,
      price: product.price
    });
  }

  cartQuantity(
    productId: number
  ): number {
    return this.cartService.quantityOf(
      productId
    );
  }

  showAddButtonEffect(
    event: Event
  ): void {
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

  hideAddButtonEffect(
    event: Event
  ): void {
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
    this.routeSubscription?.unsubscribe();

    this.addButtonTimelines.forEach(
      timeline => {
        timeline.kill();
      }
    );

    this.addButtonTimelines.clear();
  }

  private async initializeCategory(
    slug: string
  ): Promise<void> {
    console.log('slug', slug);
    
    const category =
      CATEGORY_CONFIG[slug];

    this.products = [];
    this.errorMessage = '';
    this.loading = true;
    this.loadingMore = false;
    this.hasMore = true;
    this.categoryFound = Boolean(category);

    if (!category) {
      this.categoryName =
        'Categoría no encontrada';

      this.categoryDescription =
        'La categoría solicitada no está disponible.';

      this.loading = false;
      this.hasMore = false;

      return;
    }

    this.categoryName =
      category.name;

    this.categoryDescription =
      category.description;

    await this.loadProducts();
  }

  private async loadProducts(): Promise<void> {
    this.errorMessage = '';

    try {
      const page =
        await this.productsService
          .getProductsByCategoryPage(
            this.categoryName,
            this.products.length,
            this.pageSize
          );

      const newProducts =
        page.products.map(
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
        'No fue posible cargar los productos de esta categoría.';
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
        row.category?.trim() ||
        this.categoryName,
      cover:
        row.cover ||
        '/products/placeholder.webp',
      price: Number(
        row.discountPrice ||
        row.regularPrice ||
        0
      ),
      label:
        row.label || undefined
    };
  }
}