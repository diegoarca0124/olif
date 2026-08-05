import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
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
  styleUrl: './categories-home.component.css'
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
      bg: '#116973',
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
      bg: '#000000',
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
      bg: '#8ab1e6',
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
      bg: '#0067e5',
      color: '#f6ecc8'
    }
  ];

  private context?: gsap.Context;
  private events = new AbortController();

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.context = gsap.context(() => {
      this.initializeCardHover();
      this.initializeButtonHover();
    }, this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.events.abort();
    this.context?.revert();
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

      card.addEventListener(
        'pointerenter',
        () => {
          gsap.timeline({
            defaults: {
              overwrite: 'auto',
              ease: 'power3.out'
            }
          })
            .to(
              image,
              {
                scale: 1.04,
                duration: 0.55
              },
              0
            )
            .to(
              arrow,
              {
                x: 4,
                duration: 0.35
              },
              0.04
            );
        },
        {
          signal: this.events.signal
        }
      );

      card.addEventListener(
        'pointerleave',
        () => {
          gsap.timeline({
            defaults: {
              overwrite: 'auto',
              ease: 'power3.out'
            }
          })
            .to(
              image,
              {
                scale: 1,
                duration: 0.6
              },
              0
            )
            .to(
              arrow,
              {
                x: 0,
                duration: 0.35
              },
              0
            );
        },
        {
          signal: this.events.signal
        }
      );
    });
  }

  private initializeButtonHover(): void {
    const button =
      this.host.nativeElement.querySelector<HTMLElement>(
        '.js-circle-button'
      );

    const circle =
      button?.querySelector<HTMLElement>(
        '.button-circle'
      );

    const label =
      button?.querySelector<HTMLElement>(
        '.button-label'
      );

    const arrow =
      button?.querySelector<HTMLElement>(
        '.button-arrow'
      );

    if (!button || !circle || !label || !arrow) return;

    const getPointerPosition = (event: PointerEvent) => {
      const bounds = button.getBoundingClientRect();

      return {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
      };
    };

    button.addEventListener(
      'pointerenter',
      event => {
        const { x, y } = getPointerPosition(event);

        gsap.set(circle, {
          left: x,
          top: y
        });

        gsap.timeline({
          defaults: {
            overwrite: 'auto'
          }
        })
          .to(
            circle,
            {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out'
            },
            0
          )
          .to(
            label,
            {
              color: '#ffffff',
              duration: 0.2
            },
            0.05
          )
          .to(
            arrow,
            {
              x: 4,
              duration: 0.3,
              ease: 'power3.out'
            },
            0
          );
      },
      {
        signal: this.events.signal
      }
    );

    button.addEventListener(
      'pointermove',
      event => {
        const { x, y } = getPointerPosition(event);

        gsap.to(circle, {
          left: x,
          top: y,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      },
      {
        signal: this.events.signal
      }
    );

    button.addEventListener(
      'pointerleave',
      () => {
        gsap.timeline({
          defaults: {
            overwrite: 'auto'
          }
        })
          .to(
            circle,
            {
              scale: 0,
              duration: 0.3,
              ease: 'power2.in'
            },
            0
          )
          .to(
            label,
            {
              color: '#0a0a0a',
              duration: 0.2
            },
            0
          )
          .to(
            arrow,
            {
              x: 0,
              duration: 0.25
            },
            0
          );
      },
      {
        signal: this.events.signal
      }
    );
  }
}