import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import { gsap } from 'gsap';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FaqComponent implements AfterViewInit, OnDestroy {
  private animationContext?: gsap.Context;
  private gsapMedia?: gsap.MatchMedia;

  openItemId: string | null = 'faq-01';

  readonly faqItems: FaqItem[] = [
    {
      id: 'faq-01',
      question: '¿Cómo puedo realizar una compra?',
      answer:
        'Explora nuestro catálogo, agrega los productos que deseas al carrito y revisa las cantidades antes de continuar. Cuando tu pedido esté listo, podrás comunicarte con nosotros para confirmar disponibilidad, dirección de entrega y forma de pago.'
    },
    {
      id: 'faq-02',
      question: '¿Los productos son originales?',
      answer:
        'Sí. Seleccionamos productos originales de marcas reconocidas y trabajamos con proveedores confiables. Cada producto conserva su empaque, presentación y rotulado correspondiente.'
    },
    {
      id: 'faq-03',
      question: '¿Cómo sé si un producto está disponible?',
      answer:
        'Los productos publicados forman parte de nuestro catálogo actual, pero el inventario puede cambiar durante el día. Confirmamos la disponibilidad final antes de procesar el pedido.'
    },
    {
      id: 'faq-04',
      question: '¿Puedo solicitar un producto que no aparece en la web?',
      answer:
        'Sí. Escríbenos por WhatsApp con el nombre, marca y presentación que buscas. Revisaremos la disponibilidad con nuestros proveedores y te informaremos el precio y tiempo estimado.'
    },
    {
      id: 'faq-05',
      question: '¿Qué métodos de pago aceptan?',
      answer:
        'Puedes consultar nuestras opciones disponibles al confirmar tu pedido. Te indicaremos los medios de pago habilitados y los datos necesarios para completar la compra de forma segura.'
    },
    {
      id: 'faq-06',
      question: '¿Cuándo queda confirmado mi pedido?',
      answer:
        'El pedido queda confirmado después de validar la disponibilidad de los productos, los datos de entrega y el pago correspondiente.'
    },
    {
      id: 'faq-07',
      question: '¿Los precios incluyen impuestos?',
      answer:
        'Los precios mostrados corresponden al valor final de cada producto. Si tu pedido requiere un comprobante específico, indícalo durante la confirmación.'
    },
    {
      id: 'faq-08',
      question: '¿En qué distritos realizan entregas?',
      answer:
        'Realizamos entregas en los distritos incluidos en nuestra zona de cobertura. Puedes consultar tu ubicación exacta por WhatsApp antes de confirmar el pedido.'
    },
    {
      id: 'faq-09',
      question: '¿Cuánto demora en llegar mi pedido?',
      answer:
        'El tiempo depende del distrito, la disponibilidad y la hora de confirmación. Antes de procesar la compra te proporcionaremos un rango estimado de entrega.'
    },
    {
      id: 'faq-10',
      question: '¿El envío tiene algún costo?',
      answer:
        'El costo se calcula según la ubicación y las condiciones vigentes de entrega. Algunas zonas o pedidos pueden acceder a promociones de envío gratuito.'
    },
    {
      id: 'faq-11',
      question: '¿Cómo puedo hacer seguimiento a mi pedido?',
      answer:
        'Después de confirmar el pedido podrás comunicarte con nosotros por WhatsApp para consultar su estado y recibir actualizaciones sobre la entrega.'
    },
    {
      id: 'faq-12',
      question: '¿Qué hago si recibí un producto incorrecto?',
      answer:
        'Comunícate con nosotros lo antes posible y envíanos una fotografía del producto recibido y del comprobante del pedido. Revisaremos el caso y coordinaremos la solución.'
    },
    {
      id: 'faq-13',
      question: '¿Puedo cambiar o devolver un producto?',
      answer:
        'Por seguridad, los productos de consumo y cuidado personal deben conservarse cerrados, sin uso y en su empaque original. La solicitud será evaluada de acuerdo con el estado del producto y el motivo presentado.'
    },
    {
      id: 'faq-14',
      question: '¿Qué hago si el producto llegó dañado?',
      answer:
        'Conserva el empaque y comunícate con nosotros inmediatamente. Envíanos fotografías claras del producto y del paquete para poder revisar lo ocurrido.'
    },
    {
      id: 'faq-15',
      question: '¿Cómo puedo comunicarme con Olif?',
      answer:
        'Puedes escribirnos directamente por WhatsApp. Nuestro horario de atención es de lunes a sábado, de 9:00 a. m. a 7:00 p. m.'
    }
  ];

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const initiallyOpenAnswer =
      this.host.nativeElement.querySelector<HTMLElement>(
        '.faq-item.is-open .faq-answer'
      );

    if (initiallyOpenAnswer) {
      gsap.set(initiallyOpenAnswer, {
        height: 'auto'
      });
    }

    this.gsapMedia = gsap.matchMedia();

    this.gsapMedia.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        this.animationContext = gsap.context(() => {
          const timeline = gsap.timeline({
            defaults: {
              ease: 'power3.out'
            }
          });

          timeline
            .from('.faq-content__eyebrow', {
              opacity: 0,
              y: 18,
              duration: 0.55
            })
            .from(
              '.faq-content__title-line',
              {
                opacity: 0,
                yPercent: 110,
                duration: 0.85
              },
              '-=0.25'
            )
            .from(
              '.faq-content__description',
              {
                opacity: 0,
                y: 22,
                duration: 0.65
              },
              '-=0.5'
            )
            .from(
              '.faq-item',
              {
                opacity: 0,
                y: 24,
                duration: 0.55,
                stagger: 0.055,
                clearProps: 'transform'
              },
              '-=0.3'
            )
            .from(
              '.faq-help',
              {
                opacity: 0,
                y: 30,
                duration: 0.7
              },
              '-=0.2'
            );
        }, this.host.nativeElement);
      }
    );
  }

  toggleItem(
    itemId: string,
    answer: HTMLElement
  ): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.openItemId =
        this.openItemId === itemId
          ? null
          : itemId;

      return;
    }

    const isClosing =
      this.openItemId === itemId;

    const currentAnswer =
      this.host.nativeElement.querySelector<HTMLElement>(
        '.faq-item.is-open .faq-answer'
      );

    if (
      currentAnswer &&
      currentAnswer !== answer
    ) {
      gsap.killTweensOf(currentAnswer);

      gsap.to(currentAnswer, {
        height: 0,
        duration: 0.42,
        ease: 'power3.inOut'
      });
    }

    if (isClosing) {
      this.openItemId = null;

      gsap.killTweensOf(answer);

      gsap.to(answer, {
        height: 0,
        duration: 0.42,
        ease: 'power3.inOut'
      });

      return;
    }

    this.openItemId = itemId;

    gsap.killTweensOf(answer);

    gsap.set(answer, {
      height: 0
    });

    gsap.to(answer, {
      height: answer.scrollHeight,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(answer, {
          height: 'auto'
        });
      }
    });
  }

  isOpen(itemId: string): boolean {
    return this.openItemId === itemId;
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      const answers =
        this.host.nativeElement.querySelectorAll(
          '.faq-answer'
        );

      gsap.killTweensOf(answers);
    }

    this.animationContext?.revert();
    this.gsapMedia?.revert();
  }
}