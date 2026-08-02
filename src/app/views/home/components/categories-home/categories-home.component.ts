import { Component, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
interface Category {
  id: string;
  name: string;
  image: string;
  alt: string;
  colorClass: string;
  link: string;
}

@Component({
  selector: 'app-categories-home',
  imports: [
    RouterModule
  ],
  templateUrl: './categories-home.component.html',
  styleUrl: './categories-home.component.css'
})
export class CategoriesHomeComponent {
  categories: Category[] = [
    {
      id: 'vitaminas',
      name: 'Vitaminas',
      image: '/categories/image-01.webp',
      alt: 'Vitaminas para el bienestar diario',
      colorClass: 'story-card--coral',
      link: '/productos/categoria/vitaminas'
    },
    {
      id: 'cereales-frutos-secos',
      name: 'Cereales & frutos secos',
      image: '/categories/image-02.webp',
      alt: 'Selección de cereales y frutos secos',
      colorClass: 'story-card--blue',
      link: '/productos/categoria/cereales-frutos-secos'
    },
    {
      id: 'cuidado-diabetes',
      name: 'Cuidado de la diabetes',
      image: '/categories/image-03.webp',
      alt: 'Productos para el cuidado de la diabetes',
      colorClass: 'story-card--purple',
      link: '/productos/categoria/cuidado-diabetes'
    },
    {
      id: 'cuidado-personal',
      name: 'Cuidado personal',
      image: '/categories/image-04.webp',
      alt: 'Productos naturales para el cuidado personal',
      colorClass: 'story-card--green',
      link: '/productos/categoria/cuidado-personal'
    },
    {
      id: 'limpieza',
      name: 'Limpieza',
      image: '/categories/image-05.webp',
      alt: 'Productos para la limpieza del hogar',
      colorClass: 'story-card--aqua',
      link: '/productos/categoria/limpieza'
    },
    {
      id: 'alimentos',
      name: 'Alimentos',
      image: '/categories/image-06.webp',
      alt: 'Alimentos y productos nutricionales',
      colorClass: 'story-card--rose',
      link: '/productos/categoria/alimentos'
    }
  ];

  private context?: gsap.Context;
  private events = new AbortController();

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.context = gsap.context(() => {
      this.animateCards();
      this.animateButton();
    }, this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.events.abort();
    this.context?.revert();
  }

  private animateCards(): void {
    const section = this.host.nativeElement.querySelector<HTMLElement>('.discover-section');
    const cards = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.story-card'));
    if (!section || !cards.length) return;

    gsap.from(cards, {
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true
      },
      opacity: 0,
      y: 60,
      scale: 0.95,
      rotation: index => index % 2 === 0 ? -2 : 2,
      duration: 1,
      stagger: 0.08,
      ease: 'power4.out',
      clearProps: 'opacity,transform'
    });

    if (!window.matchMedia('(pointer: fine)').matches) return;

    cards.forEach(card => {
      const image = card.querySelector<HTMLImageElement>('img');
      if (!image) return;

      const rotateX = gsap.quickTo(image, 'rotationX', {
        duration: 0.5,
        ease: 'power3.out'
      });

      const rotateY = gsap.quickTo(image, 'rotationY', {
        duration: 0.5,
        ease: 'power3.out'
      });

      card.addEventListener('pointerenter', () => {
        gsap.to(image, {
          scale: 1.035,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: true
        });
      }, { signal: this.events.signal });

      card.addEventListener('pointermove', event => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        gsap.set(image, { transformPerspective: 900 });
        rotateY(x * 5);
        rotateX(y * -5);
      }, { signal: this.events.signal });

      card.addEventListener('pointerleave', () => {
        gsap.to(image, {
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: true
        });
      }, { signal: this.events.signal });
    });
  }

  private animateButton(): void {
    const button = this.host.nativeElement.querySelector<HTMLElement>('.js-circle-button');
    const circle = button?.querySelector<HTMLElement>('.button-circle');
    const label = button?.querySelector<HTMLElement>('.button-label');
    const arrow = button?.querySelector<HTMLElement>('.button-arrow');
    if (!button || !circle || !label || !arrow) return;

    const position = (event: PointerEvent) => {
      const bounds = button.getBoundingClientRect();
      return {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
      };
    };

    button.addEventListener('pointerenter', event => {
      const { x, y } = position(event);
      gsap.set(circle, { left: x, top: y });
      gsap.timeline({ defaults: { overwrite: 'auto' } })
        .to(circle, { scale: 1, duration: 0.4, ease: 'power2.out' }, 0)
        .to(label, { color: '#ffffff', duration: 0.2 }, 0.05)
        .to(arrow, { x: 4, duration: 0.3, ease: 'power3.out' }, 0);
    }, { signal: this.events.signal });

    button.addEventListener('pointermove', event => {
      const { x, y } = position(event);
      gsap.to(circle, {
        left: x,
        top: y,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }, { signal: this.events.signal });

    button.addEventListener('pointerleave', () => {
      gsap.timeline({ defaults: { overwrite: 'auto' } })
        .to(circle, { scale: 0, duration: 0.3, ease: 'power2.in' }, 0)
        .to(label, { color: '#0a0a0a', duration: 0.2 }, 0)
        .to(arrow, { x: 0, duration: 0.25 }, 0);
    }, { signal: this.events.signal });
  }
}
