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
      bg: '#f6ecc8',
      color: '#0a0a0a'
    },
    {
      id: 'cereales-frutos-secos',
      name: 'Cereales & frutos secos',
      description: 'Energía natural para todos los días',
      image: '/categories/image-02-transparent.png',
      alt: 'Selección de cereales y frutos secos',
      colorClass: 'story-card--blue',
      link: '/productos/categoria/cereales-frutos-secos',
      bg: '#f6ecc8',
      color: '#0a0a0a'
    },
   
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

    const fill =
      button.querySelector<HTMLElement>(
        '.categories__button-fill'
      );

    const label =
      button.querySelector<HTMLElement>(
        '.categories__button-label'
      );

    const arrow =
      button.querySelector<HTMLElement>(
        '.categories__button-arrow'
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
        '.categories__button-fill'
      );

    const label =
      button.querySelector<HTMLElement>(
        '.categories__button-label'
      );

    const arrow =
      button.querySelector<HTMLElement>(
        '.categories__button-arrow'
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