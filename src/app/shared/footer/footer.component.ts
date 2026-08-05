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
  private waveObserver?: ResizeObserver;
  private waveStart = 0;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const footer =
      this.host.nativeElement.querySelector<HTMLElement>(
        '.site-footer'
      );

    const canvas =
      this.host.nativeElement.querySelector<HTMLCanvasElement>(
        '.site-footer__wave'
      );

    if (!footer || !canvas) return;

    document.body.style.paddingBottom = '';

    this.initializeWave(canvas);

    this.context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 88%',
          once: true
        }
      });

      timeline
        .from('.site-footer__header', {
          opacity: 0,
          y: 35,
          duration: 0.8,
          ease: 'power3.out'
        })
        .from(
          '.site-footer__divider',
          {
            scaleX: 0,
            duration: 0.75,
            ease: 'power3.inOut',
            transformOrigin: 'left center'
          },
          '-=0.4'
        )
        .from(
          '.site-footer__identity, .site-footer__column',
          {
            opacity: 0,
            y: 25,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out'
          },
          '-=0.3'
        )
        .from(
          '.site-footer__bottom',
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: 'power2.out'
          },
          '-=0.25'
        );

      gsap.to('.site-footer__glow', {
        xPercent: 10,
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.5
        }
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, footer);
  }

  private initializeWave(
    canvas: HTMLCanvasElement
  ): void {
    const context = canvas.getContext('2d');

    if (!context) return;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resizeCanvas = (): void => {
      const bounds =
        canvas.getBoundingClientRect();

      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);

      pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      const physicalWidth = Math.max(
        1,
        Math.round(width * pixelRatio)
      );

      const physicalHeight = Math.max(
        1,
        Math.round(height * pixelRatio)
      );

      if (
        canvas.width !== physicalWidth ||
        canvas.height !== physicalHeight
      ) {
        canvas.width = physicalWidth;
        canvas.height = physicalHeight;

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
      const base = height * 0.55;

      const mainWave =
        Math.sin(
          x * 0.007 + time * 1.05
        ) * 11;

      const detailWave =
        Math.sin(
          x * 0.014 - time * 0.58
        ) * 3.5;

      const tide =
        Math.sin(time * 0.7) * 2;

      return (
        base +
        mainWave +
        detailWave +
        tide
      );
    };

    const drawWave = (
      time: number
    ): void => {
      context.clearRect(
        0,
        0,
        width,
        height
      );

      context.beginPath();
      context.moveTo(0, height);
      context.lineTo(
        0,
        getWaveY(0, time)
      );

      for (
        let x = 0;
        x <= width + 4;
        x += 4
      ) {
        context.lineTo(
          x,
          getWaveY(x, time)
        );
      }

      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();

      context.fillStyle = '#f6ecc8';
      context.fill();
    };

    const animate = (
      timestamp: number
    ): void => {
      if (!this.waveStart) {
        this.waveStart = timestamp;
      }

      const elapsed =
        (timestamp - this.waveStart) / 1000;

      drawWave(elapsed);

      this.waveFrame =
        requestAnimationFrame(animate);
    };

    resizeCanvas();

    this.waveObserver =
      new ResizeObserver(() => {
        resizeCanvas();
      });

    this.waveObserver.observe(canvas);

    this.waveFrame =
      requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    if (this.waveFrame !== undefined) {
      cancelAnimationFrame(
        this.waveFrame
      );
    }

    this.waveObserver?.disconnect();
    this.context?.revert();
    document.body.style.paddingBottom = '';
  }
}