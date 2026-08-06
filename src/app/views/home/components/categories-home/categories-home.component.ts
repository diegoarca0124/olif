import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  colorClass: string;
  bg: string;
  color: string;
  link: string;
}

@Component({
  selector: 'app-categories-home',
  imports: [RouterModule],
  templateUrl: './categories-home.component.html',
  styleUrl: './categories-home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoriesHomeComponent implements AfterViewInit, OnDestroy {
  categories: Category[] = [
    {
      id: 'vitaminas',
      name: 'Vitaminas',
      description: 'Bienestar diario para sentirte mejor',
      image: '/categories/image-01-transparent.png',
      alt: 'Vitaminas para el bienestar diario',
      colorClass: 'story-card--coral',
      link: '/productos/categoria/vitaminas',
      bg: '#2B4735',
      color: '#f6ecc8'
    },
    {
      id: 'cereales-frutos-secos',
      name: 'Cereales & frutos secos',
      description: 'Energía natural para todos los días',
      image: '/categories/image-02-transparent.png',
      alt: 'Selección de cereales y frutos secos',
      colorClass: 'story-card--blue',
      link: '/productos/categoria/cereales-frutos-secos',
      bg: '#fed200',
      color: '#0a0a0a'
    },
    {
      id: 'cuidado-diabetes',
      name: 'Cuidado de la diabetes',
      description: 'Control y confianza en tu rutina',
      image: '/categories/image-03-transparent.png',
      alt: 'Productos para el cuidado de la diabetes',
      colorClass: 'story-card--purple',
      link: '/productos/categoria/cuidado-diabetes',
      bg: '#BF8F67',
      color: '#f6ecc8'
    },
    {
      id: 'cuidado-personal',
      name: 'Cuidado personal',
      description: 'Cuidado esencial para cuerpo y piel',
      image: '/categories/image-04-transparent.png',
      alt: 'Productos naturales para el cuidado personal',
      colorClass: 'story-card--green',
      link: '/productos/categoria/cuidado-personal',
      bg: '#E2A1AE',
      color: '#0a0a0a'
    },
    {
      id: 'limpieza',
      name: 'Limpieza',
      description: 'Soluciones prácticas para tu hogar',
      image: '/categories/image-05-transparent.png',
      alt: 'Productos para la limpieza del hogar',
      colorClass: 'story-card--aqua',
      link: '/productos/categoria/limpieza',
      bg: '#f6ecc8',
      color: '#0a0a0a'
    },
    {
      id: 'alimentos',
      name: 'Alimentos',
      description: 'Opciones saludables para disfrutar',
      image: '/categories/image-06-transparent.png',
      alt: 'Alimentos y productos nutricionales',
      colorClass: 'story-card--rose',
      link: '/productos/categoria/alimentos',
      bg: '#9A9E66',
      color: '#f6ecc8'
    }
  ];

  private context?: gsap.Context;
  private events = new AbortController();
  private buttonTimeline?: gsap.core.Timeline;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.context = gsap.context(() => {
      this.initializeCardHover();
    }, this.host.nativeElement);
  }

  showButtonEffect(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const fill = button.querySelector<HTMLElement>('.categories__button-fill');
    const label = button.querySelector<HTMLElement>('.categories__button-label');
    const arrow = button.querySelector<HTMLElement>('.categories__button-arrow');

    if (!fill || !label || !arrow) return;

    this.buttonTimeline?.kill();
    this.buttonTimeline = gsap.timeline();

    this.buttonTimeline
      .to(fill, {
        scale: 5.5,
        duration: 0.55,
        ease: 'power3.inOut'
      }, 0)
      .to(label, {
        color: '#18372d',
        duration: 0.25
      }, 0.08)
      .to(arrow, {
        color: '#18372d',
        x: 5,
        duration: 0.35,
        ease: 'power2.out'
      }, 0.08)
      .to(button, {
        y: -2,
        duration: 0.35,
        ease: 'power2.out'
      }, 0);
  }

  hideButtonEffect(event: Event): void {
    const button = event.currentTarget as HTMLElement;
    const fill = button.querySelector<HTMLElement>('.categories__button-fill');
    const label = button.querySelector<HTMLElement>('.categories__button-label');
    const arrow = button.querySelector<HTMLElement>('.categories__button-arrow');

    if (!fill || !label || !arrow) return;

    this.buttonTimeline?.kill();
    this.buttonTimeline = gsap.timeline();

    this.buttonTimeline
      .to(fill, {
        scale: 0,
        duration: 0.45,
        ease: 'power3.inOut'
      }, 0)
      .to(label, {
        color: '#18372d',
        duration: 0.25
      }, 0)
      .to(arrow, {
        color: '#18372d',
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
      .to(button, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0);
  }

  private initializeCardHover(): void {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>('.story-card')
    );

    cards.forEach(card => {
      const image = card.querySelector<HTMLImageElement>('.story-image');
      const arrow = card.querySelector<HTMLElement>('.story-link span');

      if (!image) return;

      card.addEventListener('pointerenter', () => {
        gsap.timeline({
          defaults: {
            overwrite: 'auto',
            ease: 'power3.out'
          }
        })
          .to(image, {
            scale: 1.2,
            duration: 0.55
          }, 0)
          .to(arrow, {
            x: 4,
            duration: 0.35
          }, 0.04);
      }, {
        signal: this.events.signal
      });

      card.addEventListener('pointerleave', () => {
        gsap.timeline({
          defaults: {
            overwrite: 'auto',
            ease: 'power3.out'
          }
        })
          .to(image, {
            scale: 1,
            duration: 0.6
          }, 0)
          .to(arrow, {
            x: 0,
            duration: 0.35
          }, 0);
      }, {
        signal: this.events.signal
      });
    });
  }

  ngOnDestroy(): void {
    this.events.abort();
    this.buttonTimeline?.kill();
    this.context?.revert();
  }
}