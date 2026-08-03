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
      image: 'https://images.unsplash.com/photo-1611073061835-e77b1b16d3f3?q=80&w=1742&auto=format&fit=crop',
      alt: 'Vitaminas y suplementos'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1726736525038-66c5306e08b0?q=80&w=1740&auto=format&fit=crop',
      alt: 'Alimentos saludables'
    },
    {
      image: 'https://images.unsplash.com/photo-1635096838726-4e936b59f3c5?q=80&w=1740&auto=format&fit=crop',
      alt: 'Productos de cuidado personal'
    }
  ];
}
