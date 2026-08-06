import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../../services/cart.service';

interface HeaderCategory {
  name: string;
  slug: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-header',
  imports: [
    CartComponent,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('desktopCategories')
  private desktopCategories!: ElementRef<HTMLElement>;

  @ViewChild('mobileBackdrop')
  private mobileBackdrop!: ElementRef<HTMLElement>;

  @ViewChild('mobileDrawer')
  private mobileDrawer!: ElementRef<HTMLElement>;

  @ViewChild('mobileCategories')
  private mobileCategories!: ElementRef<HTMLElement>;

  private readonly cartService = inject(CartService);
  private desktopTween?: gsap.core.Tween;
  private mobileTimeline?: gsap.core.Timeline;
  private mobileCategoriesTween?: gsap.core.Tween;
  private previousBodyOverflow = '';

  readonly cartCount = this.cartService.itemCount;

  readonly categories: HeaderCategory[] = [
    {
      name: 'Vitaminas',
      slug: 'vitaminas',
      image: '/categories/image-01-transparent.png',
      description: 'Bienestar para cada día'
    },
    {
      name: 'Cereales y frutos secos',
      slug: 'cereales-frutos-secos',
      image: '/categories/image-02-transparent.png',
      description: 'Nutrición natural'
    },
    {
      name: 'Cuidado de la diabetes',
      slug: 'cuidado-diabetes',
      image: '/categories/image-03-transparent.png',
      description: 'Control y confianza'
    },
    {
      name: 'Cuidado personal',
      slug: 'cuidado-personal',
      image: '/categories/image-04-transparent.png',
      description: 'Cuida cuerpo y piel'
    },
    {
      name: 'Limpieza',
      slug: 'limpieza',
      image: '/categories/image-05-transparent.png',
      description: 'Un hogar más limpio'
    },
    {
      name: 'Alimentos',
      slug: 'alimentos',
      image: '/categories/image-06-transparent.png',
      description: 'Opciones más saludables'
    }
  ];

  desktopCategoriesOpen = false;
  mobileMenuOpen = false;
  mobileCategoriesOpen = false;

  ngAfterViewInit(): void {
    gsap.set(this.desktopCategories.nativeElement, {
      autoAlpha: 0,
      y: 12,
      scale: 0.98,
      pointerEvents: 'none'
    });

    gsap.set(this.mobileBackdrop.nativeElement, {
      autoAlpha: 0,
      pointerEvents: 'none'
    });

    gsap.set(this.mobileDrawer.nativeElement, {
      xPercent: -100
    });

    gsap.set(this.mobileCategories.nativeElement, {
      height: 0,
      autoAlpha: 0
    });
  }

  toggleDesktopCategories(event: MouseEvent): void {
    event.stopPropagation();

    if (this.desktopCategoriesOpen) {
      this.closeDesktopCategories();
      return;
    }

    this.openDesktopCategories();
  }

  openDesktopCategories(): void {
    if (window.innerWidth < 992) {
      return;
    }

    this.desktopTween?.kill();
    this.desktopCategoriesOpen = true;

    const menu = this.desktopCategories.nativeElement;
    const items = menu.querySelectorAll('.desktop-category-link');

    this.desktopTween = gsap.to(menu, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      pointerEvents: 'auto',
      duration: 0.4,
      ease: 'power3.out'
    });

    gsap.fromTo(
      items,
      {
        opacity: 0,
        x: -8
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.045,
        ease: 'power2.out'
      }
    );
  }

  closeDesktopCategories(): void {
    if (!this.desktopCategories) {
      return;
    }

    this.desktopTween?.kill();
    this.desktopCategoriesOpen = false;

    this.desktopTween = gsap.to(
      this.desktopCategories.nativeElement,
      {
        autoAlpha: 0,
        y: 10,
        scale: 0.985,
        pointerEvents: 'none',
        duration: 0.24,
        ease: 'power2.in'
      }
    );
  }

  toggleMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
      return;
    }

    this.openMobileMenu();
  }

  openMobileMenu(): void {
    if (window.innerWidth >= 992) {
      return;
    }

    this.mobileTimeline?.kill();
    this.mobileMenuOpen = true;

    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const backdrop = this.mobileBackdrop.nativeElement;
    const drawer = this.mobileDrawer.nativeElement;
    const items = drawer.querySelectorAll('.mobile-animate');

    this.mobileTimeline = gsap.timeline();

    this.mobileTimeline
      .to(
        backdrop,
        {
          autoAlpha: 1,
          pointerEvents: 'auto',
          duration: 0.3,
          ease: 'power2.out'
        },
        0
      )
      .to(
        drawer,
        {
          xPercent: 0,
          duration: 0.55,
          ease: 'power4.out'
        },
        0
      )
      .fromTo(
        items,
        {
          opacity: 0,
          x: -18
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.055,
          ease: 'power3.out'
        },
        0.18
      );
  }

  closeMobileMenu(): void {
    if (!this.mobileDrawer || !this.mobileBackdrop) {
      return;
    }

    this.mobileTimeline?.kill();
    this.mobileMenuOpen = false;
    document.body.style.overflow = this.previousBodyOverflow;

    this.closeMobileCategories(false);

    this.mobileTimeline = gsap.timeline();

    this.mobileTimeline
      .to(
        this.mobileDrawer.nativeElement,
        {
          xPercent: -100,
          duration: 0.42,
          ease: 'power3.inOut'
        },
        0
      )
      .to(
        this.mobileBackdrop.nativeElement,
        {
          autoAlpha: 0,
          pointerEvents: 'none',
          duration: 0.28,
          ease: 'power2.in'
        },
        0.12
      );
  }

  toggleMobileCategories(): void {
    if (this.mobileCategoriesOpen) {
      this.closeMobileCategories();
      return;
    }

    this.openMobileCategories();
  }

  openMobileCategories(): void {
    this.mobileCategoriesTween?.kill();
    this.mobileCategoriesOpen = true;

    const container = this.mobileCategories.nativeElement;
    const items = container.querySelectorAll('.mobile-category-link');

    this.mobileCategoriesTween = gsap.to(container, {
      height: 'auto',
      autoAlpha: 1,
      duration: 0.42,
      ease: 'power3.out'
    });

    gsap.fromTo(
      items,
      {
        opacity: 0,
        x: -10
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.04,
        delay: 0.06,
        ease: 'power2.out'
      }
    );
  }

  closeMobileCategories(animate = true): void {
    if (!this.mobileCategories) {
      return;
    }

    this.mobileCategoriesTween?.kill();
    this.mobileCategoriesOpen = false;

    if (!animate) {
      gsap.set(this.mobileCategories.nativeElement, {
        height: 0,
        autoAlpha: 0
      });

      return;
    }

    this.mobileCategoriesTween = gsap.to(
      this.mobileCategories.nativeElement,
      {
        height: 0,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      }
    );
  }

  closeAfterNavigation(): void {
    this.closeDesktopCategories();

    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.desktop-category-control')) {
      this.closeDesktopCategories();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeDesktopCategories();

    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (window.innerWidth >= 992 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }

    if (window.innerWidth < 992) {
      this.closeDesktopCategories();
    }
  }

  ngOnDestroy(): void {
    this.desktopTween?.kill();
    this.mobileTimeline?.kill();
    this.mobileCategoriesTween?.kill();
    document.body.style.overflow = this.previousBodyOverflow;
  }
}