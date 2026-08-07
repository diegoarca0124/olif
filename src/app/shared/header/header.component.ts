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

  @ViewChild('pageLayer')
  private pageLayer!: ElementRef<HTMLElement>;

  private readonly cartService = inject(CartService);
  private desktopTween?: gsap.core.Tween;
  private mobileTimeline?: gsap.core.Timeline;
  private mobileCategoriesTween?: gsap.core.Tween;
  private previousBodyOverflow = '';
  private closingMobileMenu = false;

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

  private headerEntranceTween?: gsap.core.Tween;
  private headerScrollTween?: gsap.core.Tween;
  private headerScrolled = false;

  desktopCategoriesOpen = false;
  mobileMenuOpen = false;
  mobileCategoriesOpen = false;

  ngAfterViewInit(): void {

    const header = this.pageLayer.nativeElement;

    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      gsap.set(header, {
        y: 0,
        opacity: 1
      });
    } else {
      this.headerEntranceTween = gsap.fromTo(
        header,
        {
          y: -24,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        }
      );
    }

    this.updateHeaderScrollEffect(true);

    gsap.set(this.desktopCategories.nativeElement, {
      autoAlpha: 0,
      y: 12,
      scale: 0.98,
      pointerEvents: 'none'
    });

    gsap.set(this.mobileDrawer.nativeElement, {
      display: 'none',
      visibility: 'hidden',
      xPercent: -100
    });

    gsap.set(this.mobileBackdrop.nativeElement, {
      display: 'none',
      visibility: 'hidden',
      opacity: 0,
      pointerEvents: 'none'
    });

    gsap.set(this.mobileCategories.nativeElement, {
      height: 0,
      autoAlpha: 0
    });
  }

  private updateHeaderScrollEffect(
    force = false
  ): void {
    if (!this.pageLayer) {
      return;
    }

    const isScrolled = window.scrollY > 12;

    if (
      !force &&
      isScrolled === this.headerScrolled
    ) {
      return;
    }

    this.headerScrolled = isScrolled;
    this.headerScrollTween?.kill();

    this.headerScrollTween = gsap.to(
      this.pageLayer.nativeElement,
      {
        boxShadow: isScrolled
          ? '0 14px 35px rgba(11, 31, 22, 0.18)'
          : '0 0 0 rgba(11, 31, 22, 0)',
        duration: 0.38,
        ease: 'power2.out',
        overwrite: 'auto'
      }
    );
  }

  @HostListener('window:scroll')
  handleWindowScroll(): void {
    this.updateHeaderScrollEffect();
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
    if (this.closingMobileMenu) {
      return;
    }

    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
      return;
    }

    this.openMobileMenu();
  }

  openMobileMenu(): void {
    if (
      window.innerWidth >= 992 ||
      this.mobileMenuOpen ||
      this.closingMobileMenu
    ) {
      return;
    }

    this.mobileTimeline?.kill();

    this.mobileMenuOpen = true;
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const backdrop = this.mobileBackdrop.nativeElement;
    const drawer = this.mobileDrawer.nativeElement;
    const items = drawer.querySelectorAll('.mobile-animate');

    gsap.killTweensOf([backdrop, drawer, items]);

    gsap.set(drawer, {
      display: 'flex',
      visibility: 'visible',
      xPercent: -100
    });

    gsap.set(backdrop, {
      display: 'block',
      visibility: 'visible',
      opacity: 0,
      pointerEvents: 'auto'
    });

    this.mobileTimeline = gsap.timeline();

    this.mobileTimeline
      .to(
        backdrop,
        {
          opacity: 1,
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
          ease: 'power4.out',
          overwrite: true
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
    if (
      !this.mobileMenuOpen ||
      this.closingMobileMenu ||
      !this.mobileDrawer ||
      !this.mobileBackdrop
    ) {
      return;
    }

    this.closingMobileMenu = true;
    this.mobileTimeline?.kill();
    this.mobileCategoriesTween?.kill();

    document.body.style.overflow = this.previousBodyOverflow;
    this.closeMobileCategories(false);

    const drawer = this.mobileDrawer.nativeElement;
    const backdrop = this.mobileBackdrop.nativeElement;

    gsap.killTweensOf([drawer, backdrop]);

    this.mobileTimeline = gsap.timeline({
      onComplete: () => {
        this.mobileMenuOpen = false;
        this.closingMobileMenu = false;

        gsap.set(drawer, {
          display: 'none',
          visibility: 'hidden',
          xPercent: -100
        });

        gsap.set(backdrop, {
          display: 'none',
          visibility: 'hidden',
          opacity: 0,
          pointerEvents: 'none'
        });
      }
    });

    this.mobileTimeline
      .to(
        drawer,
        {
          xPercent: -100,
          duration: 0.42,
          ease: 'power3.inOut',
          overwrite: true
        },
        0
      )
      .to(
        backdrop,
        {
          opacity: 0,
          duration: 0.28,
          ease: 'power2.in'
        },
        0.1
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
    if (!this.mobileCategories || !this.mobileMenuOpen) {
      return;
    }

    this.mobileCategoriesTween?.kill();
    this.mobileCategoriesOpen = true;

    const container = this.mobileCategories.nativeElement;
    const items = container.querySelectorAll(
      '.mobile-category-link'
    );

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
    if (window.innerWidth >= 992) {
      this.closeDesktopCategories();

      if (this.mobileMenuOpen) {
        this.mobileTimeline?.kill();
        this.mobileCategoriesTween?.kill();

        this.mobileMenuOpen = false;
        this.mobileCategoriesOpen = false;
        this.closingMobileMenu = false;

        document.body.style.overflow =
          this.previousBodyOverflow;

        gsap.set(this.mobileDrawer.nativeElement, {
          clearProps: 'transform'
        });

        gsap.set(this.mobileBackdrop.nativeElement, {
          clearProps:
            'opacity,visibility,pointerEvents'
        });

        gsap.set(this.mobileCategories.nativeElement, {
          height: 0,
          autoAlpha: 0
        });
      }

      return;
    }

    this.closeDesktopCategories();
  }

  ngOnDestroy(): void {
    this.headerEntranceTween?.kill();
    this.headerScrollTween?.kill();

    this.desktopTween?.kill();
    this.mobileTimeline?.kill();
    this.mobileCategoriesTween?.kill();

    document.body.style.overflow =
      this.previousBodyOverflow;
  }
}