import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import {
  ProductRow,
  ProductsService
} from '../../../services/products.service';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderComponent } from '../../../shared/header/header.component';

interface ProductDetail {
  id: number;
  slug: string;
  name: string;
  category: string;
  cover: string;
  images: string[];
  origin: string;
  format: string;
  price: number;
  regularPrice: number | null;
  stock: number;
  description: string;
  excerpt: string;
  label?: string;
}

@Component({
  selector: 'app-detail-product',
  imports: [
    DecimalPipe,
    RouterLink,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailProductComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;
  private entranceContext?: gsap.Context;
  private buttonTimeline?: gsap.core.Timeline;

  product: ProductDetail | null = null;
  selectedImage = '';
  selectedQuantity = 1;
  loading = true;
  notFound = false;
  errorMessage = '';
  addedMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug')?.trim() ?? '';

      if (!slug) {
        this.loading = false;
        this.notFound = true;
        return;
      }

      void this.loadProduct(slug);
    });
  }

  selectImage(image: string): void {
    if (image === this.selectedImage) {
      return;
    }

    this.selectedImage = image;

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const imageElement = this.host.nativeElement.querySelector<HTMLElement>(
      '.product-detail__main-image'
    );

    if (imageElement) {
      gsap.fromTo(
        imageElement,
        { opacity: 0.35, scale: 0.975 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }
      );
    }
  }

  increaseQuantity(): void {
    if (!this.product || this.selectedQuantity >= this.product.stock) {
      return;
    }

    this.selectedQuantity += 1;
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity -= 1;
    }
  }

  addToCart(): void {
    if (!this.product || this.product.stock <= 0) {
      return;
    }

    for (let index = 0; index < this.selectedQuantity; index += 1) {
      this.cartService.add({
        id: this.product.id,
        name: this.product.name,
        category: this.product.category,
        image: this.product.cover,
        price: this.product.price
      });
    }

    this.addedMessage = `${this.selectedQuantity} ${
      this.selectedQuantity === 1 ? 'unidad agregada' : 'unidades agregadas'
    } al carrito`;
    this.selectedQuantity = 1;

    if (isPlatformBrowser(this.platformId)) {
      gsap.fromTo(
        '.product-detail__confirmation',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }

  cartQuantity(): number {
    return this.product
      ? this.cartService.quantityOf(this.product.id)
      : 0;
  }

  showButtonEffect(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const fill = button.querySelector<HTMLElement>('.product-detail__button-fill');
    const label = button.querySelector<HTMLElement>('.product-detail__button-label');
    const icon = button.querySelector<HTMLElement>('.product-detail__button-icon');

    if (!fill || !label || !icon) {
      return;
    }

    this.buttonTimeline?.kill();
    this.buttonTimeline = gsap.timeline();
    this.buttonTimeline
      .to(fill, { scale: 12, duration: 0.55, ease: 'power3.inOut' }, 0)
      .to([label, icon], { color: '#263c31', duration: 0.25 }, 0.16)
      .to(icon, { x: 4, duration: 0.3, ease: 'power2.out' }, 0.16)
      .to(button, { y: -2, duration: 0.3, ease: 'power2.out' }, 0);
  }

  hideButtonEffect(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const fill = button.querySelector<HTMLElement>('.product-detail__button-fill');
    const label = button.querySelector<HTMLElement>('.product-detail__button-label');
    const icon = button.querySelector<HTMLElement>('.product-detail__button-icon');

    if (!fill || !label || !icon) {
      return;
    }

    this.buttonTimeline?.kill();
    this.buttonTimeline = gsap.timeline();
    this.buttonTimeline
      .to(fill, { scale: 0, duration: 0.42, ease: 'power3.inOut' }, 0)
      .to([label, icon], { color: '#ffffff', duration: 0.22 }, 0.06)
      .to(icon, { x: 0, duration: 0.26, ease: 'power2.out' }, 0.06)
      .to(button, { y: 0, duration: 0.26, ease: 'power2.out' }, 0);
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.entranceContext?.revert();
    this.buttonTimeline?.kill();
  }

  private async loadProduct(slug: string): Promise<void> {
    this.loading = true;
    this.notFound = false;
    this.errorMessage = '';
    this.addedMessage = '';
    this.product = null;

    try {
      const row = await this.productsService.getProductBySlug(slug);

      if (!row) {
        this.notFound = true;
        return;
      }

      this.product = this.mapProduct(row);
      this.selectedImage = this.product.images[0];
      this.selectedQuantity = 1;
      this.animateEntrance();
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No fue posible cargar este producto.';
    } finally {
      this.loading = false;
    }
  }

  private animateEntrance(): void {
    if (
      !isPlatformBrowser(this.platformId) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    requestAnimationFrame(() => {
      this.entranceContext?.revert();
      this.entranceContext = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        timeline
          .from('.product-detail__breadcrumbs', { opacity: 0, y: 12, duration: 0.45 })
          .from('.product-detail__gallery', { opacity: 0, x: -28, duration: 0.75 }, '-=0.18')
          .from('.product-detail__info > *', {
            opacity: 0,
            y: 22,
            duration: 0.58,
            stagger: 0.075
          }, '-=0.55')
          .from('.product-detail__benefit', {
            opacity: 0,
            y: 16,
            duration: 0.45,
            stagger: 0.08
          }, '-=0.25');
      }, this.host.nativeElement);
    });
  }

  private mapProduct(row: ProductRow): ProductDetail {
    const cover = row.cover || row.image || '/products/placeholder.webp';
    const images = [cover, row.image]
      .filter((image): image is string => Boolean(image?.trim()))
      .filter((image, index, values) => values.indexOf(image) === index);
    const regularPrice = this.parseNumber(row.regularPrice);
    const discountPrice = this.parseNumber(row.discountPrice);

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category?.trim() || 'Producto',
      cover,
      images,
      origin: row.origin?.trim() || 'No especificado',
      format: row.format?.trim() || 'Presentación individual',
      price: discountPrice || regularPrice,
      regularPrice:
        discountPrice > 0 && regularPrice > discountPrice
          ? regularPrice
          : null,
      stock: Math.max(0, Math.trunc(this.parseNumber(row.stock))),
      excerpt:  row.excerpt?.trim() || '',
      description:
        row.description?.trim() ||
        'Producto seleccionado para acompañar tu rutina de bienestar diario.',
      label: row.label?.trim() || undefined
    };
  }

  private parseNumber(value: string | null): number {
    if (!value) {
      return 0;
    }

    const normalized = value
      .replace(/[^\d,.-]/g, '')
      .replace(',', '.');
    const parsed = Number.parseFloat(normalized);

    return Number.isFinite(parsed) ? parsed : 0;
  }
}
