import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy
} from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-shipping-home',
  imports: [],
  templateUrl: './shipping-home.component.html',
  styleUrl: './shipping-home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShippingHomeComponent implements OnDestroy {
  private buttonTimeline?: gsap.core.Timeline;

  readonly districts: string[] = [
    'Surco',
    'Barranco',
    'Jesús María',
    'Miraflores',
    'San Isidro',
    'Lince',
    'Pueblo Libre',
    'Magdalena',
    'Surquillo',
    'Cercado de Lima'
  ];

  showButtonEffect(
    event: Event
  ): void {
    const button =
      event.currentTarget as HTMLElement;

    const fill =
      button.querySelector<HTMLElement>(
        '.shipping__button-fill'
      );

    const label =
      button.querySelector<HTMLElement>(
        '.shipping__button-label'
      );

    const arrow =
      button.querySelector<HTMLElement>(
        '.shipping__button-arrow'
      );

    if (!fill || !label || !arrow) {
      return;
    }

    this.buttonTimeline?.kill();

    gsap.killTweensOf([
      fill,
      label,
      arrow,
      button
    ]);

    this.buttonTimeline = gsap.timeline();

    this.buttonTimeline
      .to(
        fill,
        {
          scale: 5.5,
          duration: 0.55,
          ease: 'power3.inOut'
        },
        0
      )
      .to(
        label,
        {
          color: '#18372d',
          duration: 0.25,
          ease: 'power2.out'
        },
        0.12
      )
      .to(
        arrow,
        {
          color: '#18372d',
          x: 5,
          duration: 0.35,
          ease: 'power3.out'
        },
        0.1
      )
      .to(
        button,
        {
          y: -2,
          duration: 0.35,
          ease: 'power3.out'
        },
        0
      );
  }

  hideButtonEffect(
    event: Event
  ): void {
    const button =
      event.currentTarget as HTMLElement;

    const fill =
      button.querySelector<HTMLElement>(
        '.shipping__button-fill'
      );

    const label =
      button.querySelector<HTMLElement>(
        '.shipping__button-label'
      );

    const arrow =
      button.querySelector<HTMLElement>(
        '.shipping__button-arrow'
      );

    if (!fill || !label || !arrow) {
      return;
    }

    this.buttonTimeline?.kill();

    gsap.killTweensOf([
      fill,
      label,
      arrow,
      button
    ]);

    this.buttonTimeline = gsap.timeline();

    this.buttonTimeline
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
          color: '#18372d',
          duration: 0.25
        },
        0.1
      )
      .to(
        arrow,
        {
          color: '#18372d',
          x: 0,
          duration: 0.3,
          ease: 'power3.out'
        },
        0
      )
      .to(
        button,
        {
          y: 0,
          duration: 0.3,
          ease: 'power3.out'
        },
        0
      );
  }

  ngOnDestroy(): void {
    this.buttonTimeline?.kill();
  }
}