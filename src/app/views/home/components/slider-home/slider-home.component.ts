import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
interface SliderItem {
  image: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  textPosition?: 'left' | 'center' | 'right';
}


@Component({
  selector: 'app-slider-home',
  imports: [],
  templateUrl: './slider-home.component.html',
  styleUrl: './slider-home.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SliderHomeComponent {
  slides: SliderItem[] = [
    {
      image: 'https://images.unsplash.com/photo-1611073061835-e77b1b16d3f3?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Vitaminas y suplementos',
      eyebrow: 'Bienestar todos los días',
      title: 'Cuida de ti, naturalmente.',
      description: 'Vitaminas y suplementos para acompañar tu rutina.',
      buttonText: 'Ver vitaminas',
      buttonLink: '/productos',
      textPosition: 'left'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1726736525038-66c5306e08b0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Alimentos saludables',
      eyebrow: 'Una elección más simple',
      title: 'Alimentos que se sienten bien.',
      description: 'Opciones saludables seleccionadas para tu día a día.',
      buttonText: 'Ver alimentos',
      buttonLink: '/productos',
      textPosition: 'center'
    },
    {
      image: 'https://images.unsplash.com/photo-1635096838726-4e936b59f3c5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Productos de cuidado personal',

      // Si no colocas textos, este slide mostrará solo la imagen.
      textPosition: 'right'
    }
  ];
}
