import { Component, ElementRef } from '@angular/core';
import { gsap } from 'gsap';

interface Brand {
  id: string;
  name: string;
  image: string;
  link: string;
  small?: boolean;
}

@Component({
  selector: 'app-brands-home',
  imports: [],
  templateUrl: './brands-home.component.html',
  styleUrl: './brands-home.component.css'
})
export class BrandsHomeComponent {
   brands: Brand[] = [
    { id: 'now', name: 'NOW Foods', image: '/brands/now.webp', link: '/productos?marca=now', small: true },
    { id: 'natures-bounty', name: "Nature's Bounty", image: '/brands/natures-bounty.webp', link: '/productos?marca=natures-bounty' },
    { id: 'solgar', name: 'Solgar', image: '/brands/solgar.webp', link: '/productos?marca=solgar' },
    { id: 'spring-valley', name: 'Spring Valley', image: '/brands/spring-valley.webp', link: '/productos?marca=spring-valley' },
    { id: 'relion', name: 'ReliOn', image: '/brands/relion.webp', link: '/productos?marca=relion' },
    { id: 'centrum', name: 'Centrum', image: '/brands/centrum.webp', link: '/productos?marca=centrum' },
    { id: 'olly', name: 'OLLY', image: '/brands/olly.webp', link: '/productos?marca=olly', small: true },
    { id: 'nature-made', name: 'Nature Made', image: '/brands/nature-made.webp', link: '/productos?marca=nature-made' },
    { id: 'natures-truth', name: "Nature's Truth", image: '/brands/natures-truth.webp', link: '/productos?marca=natures-truth' }
  ];

  copies = [0, 1];
  private tween?: gsap.core.Tween;
  private resizeObserver?: ResizeObserver;
  private events = new AbortController();

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const track = this.host.nativeElement.querySelector<HTMLElement>('.vitamin-marquee__track');
    const group = this.host.nativeElement.querySelector<HTMLElement>('.vitamin-marquee__group');
    const marquee = this.host.nativeElement.querySelector<HTMLElement>('.vitamin-marquee');
    if (!track || !group || !marquee || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const createAnimation = () => {
      const distance = group.offsetWidth;
      if (!distance) return;
      this.tween?.kill();
      gsap.set(track, { x: 0 });
      this.tween = gsap.to(track, {
        x: -distance,
        duration: distance / 35,
        repeat: -1,
        ease: 'none',
        force3D: true
      });
    };

    requestAnimationFrame(createAnimation);
    this.resizeObserver = new ResizeObserver(createAnimation);
    this.resizeObserver.observe(group);
    marquee.addEventListener('pointerenter', () => this.tween?.pause(), { signal: this.events.signal });
    marquee.addEventListener('pointerleave', () => this.tween?.play(), { signal: this.events.signal });
    marquee.addEventListener('focusin', () => this.tween?.pause(), { signal: this.events.signal });
    marquee.addEventListener('focusout', event => {
      if (!marquee.contains(event.relatedTarget as Node | null)) this.tween?.play();
    }, { signal: this.events.signal });
  }

  ngOnDestroy(): void {
    this.events.abort();
    this.resizeObserver?.disconnect();
    this.tween?.kill();
  }
}
