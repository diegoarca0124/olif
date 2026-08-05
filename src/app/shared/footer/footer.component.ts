import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  private context?: gsap.Context;
  private waveFrame?: number;
  private waveStart = 0;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const footer =
      this.host.nativeElement.querySelector<HTMLElement>('.site-footer');

    const canvas =
      this.host.nativeElement.querySelector<HTMLCanvasElement>(
        '.site-footer__wave'
      );

    if (!footer) return;

    document.body.style.paddingBottom = '';

    if (canvas) {
      this.startWave(canvas);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 85%',
          once: true
        }
      });

      timeline
        .from('.site-footer__newsletter-copy', {
          y: 45,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out'
        })
        .from(
          '.site-footer__divider',
          {
            scaleX: 0,
            duration: 0.8,
            ease: 'power3.inOut',
            transformOrigin: 'left center'
          },
          '-=0.4'
        )
        .from(
          '.site-footer__identity, .site-footer__group',
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.09,
            ease: 'power3.out'
          },
          '-=0.35'
        )
        .from(
          '.site-footer__bottom',
          {
            y: 18,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out'
          },
          '-=0.3'
        );

      gsap.to('.site-footer__glow', {
        xPercent: 12,
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.5
        }
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, footer);
  }

  private startWave(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext('2d');
  if (!context) return;

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  const resize = (): void => {
    const rect = canvas.getBoundingClientRect();

    width = rect.width;
    height = rect.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const realWidth = Math.max(
      1,
      Math.round(width * pixelRatio)
    );

    const realHeight = Math.max(
      1,
      Math.round(height * pixelRatio)
    );

    if (
      canvas.width !== realWidth ||
      canvas.height !== realHeight
    ) {
      canvas.width = realWidth;
      canvas.height = realHeight;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );
    }
  };

  const getWaveY = (
    x: number,
    time: number
  ): number => {
    const base = height * 0.57;

    const mainWave =
      Math.sin(x * 0.0065 + time * 0.72) * 9;

    const secondaryWave =
      Math.sin(x * 0.0125 - time * 0.38) * 3;

    const subtleMovement =
      Math.sin(time * 0.55) * 1.5;

    return (
      base +
      mainWave +
      secondaryWave +
      subtleMovement
    );
  };

  const drawWave = (time: number): void => {
    const resolution = 16;

    context.beginPath();
    context.moveTo(0, height);
    context.lineTo(0, getWaveY(0, time));

    for (let x = 0; x < width; x += resolution) {
      const nextX = Math.min(x + resolution, width);
      const controlX = x + resolution / 2;

      const controlY =
        (
          getWaveY(x, time) +
          getWaveY(nextX, time)
        ) / 2;

      context.quadraticCurveTo(
        controlX,
        controlY,
        nextX,
        getWaveY(nextX, time)
      );
    }

    context.lineTo(width, height);
    context.lineTo(0, height);
    context.closePath();

    context.fillStyle = '#071b15';
    context.fill();
  };

  const render = (timestamp: number): void => {
    if (!this.waveStart) {
      this.waveStart = timestamp;
    }

    resize();

    const time = reducedMotion
      ? 0
      : (timestamp - this.waveStart) / 1000;

    context.clearRect(0, 0, width, height);
    drawWave(time);

    if (!reducedMotion) {
      this.waveFrame = requestAnimationFrame(render);
    }
  };

  this.waveFrame = requestAnimationFrame(render);
}

  ngOnDestroy(): void {
    if (this.waveFrame) {
      cancelAnimationFrame(this.waveFrame);
    }

    this.context?.revert();
    document.body.style.paddingBottom = '';
  }
}