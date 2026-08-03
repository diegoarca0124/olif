import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FooterComponent {
  private context?: gsap.Context;
  private resizeObserver?: ResizeObserver;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const footer = this.host.nativeElement.querySelector<HTMLElement>('.site-footer');
    if (!footer) return;

    const updateFooterSpace = (): void => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      document.body.style.paddingBottom = isDesktop ? `${footer.offsetHeight}px` : '0px';
      ScrollTrigger.refresh();
    };

    updateFooterSpace();
    this.resizeObserver = new ResizeObserver(updateFooterSpace);
    this.resizeObserver.observe(footer);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'bottom bottom+=300',
          toggleActions: 'play none none reverse'
        }
      });

      timeline
        .from('.site-footer__newsletter-copy', {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        })
        .from('.site-footer__benefits > div', {
          y: 30,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out'
        }, '-=0.55')
        .from('.site-footer__divider', {
          scaleX: 0,
          duration: 0.9,
          ease: 'power3.inOut',
          transformOrigin: 'left center'
        }, '-=0.45')
        .from('.site-footer__identity, .site-footer__group', {
          y: 35,
          opacity: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power3.out'
        }, '-=0.4')
        .from('.site-footer__bottom', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.35');

      gsap.to('.site-footer__wordmark', {
        xPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'bottom bottom+=700',
          end: 'bottom bottom',
          scrub: 1.5
        }
      });

      gsap.to('.site-footer__glow', {
        xPercent: 12,
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'bottom bottom+=700',
          end: 'bottom bottom',
          scrub: 2
        }
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, footer);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.context?.revert();
    document.body.style.paddingBottom = '';
  }
}
