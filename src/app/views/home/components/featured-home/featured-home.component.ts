import { CurrencyPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface FeaturedProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  origin: string;
  originLabel: string;
  flag: string;
  format: string;
  price: number;
  link: string;
  tag?: string;
}

@Component({
  selector: 'app-featured-home',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './featured-home.component.html',
  styleUrl: './featured-home.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FeaturedHomeComponent {
  products: FeaturedProduct[] = [
    { id: 'multivitaminico-diario', name: 'Multivitamínico diario', category: 'Vitaminas', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=90', alt: 'Multivitamínico diario', origin: 'Estados Unidos', originLabel: 'Estados Unidos', flag: '🇺🇸', format: '60 cápsulas', price: 69.90, link: '#', tag: 'Más vendido' },
    { id: 'vitamina-c-1000', name: 'Vitamina C 1000 mg', category: 'Vitaminas', image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=800&q=90', alt: 'Vitamina C 1000 mg', origin: 'Estados Unidos', originLabel: 'Estados Unidos', flag: '🇺🇸', format: '180 tabletas', price: 48.90, link: '#' },
    { id: 'omega-3-premium', name: 'Omega 3 premium', category: 'Suplementos', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=90', alt: 'Omega 3 premium', origin: 'Canadá', originLabel: 'Canadá', flag: '🇨🇦', format: '200 cápsulas', price: 74.90, link: '#', tag: 'Nuevo' },
    { id: 'magnesio-zinc', name: 'Magnesio + zinc', category: 'Suplementos', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=90', alt: 'Magnesio y zinc', origin: 'Alemania', originLabel: 'Alemania', flag: '🇩🇪', format: '90 tabletas', price: 57.90, link: '#' },
    { id: 'proteina-vegetal', name: 'Proteína vegetal', category: 'Nutrición', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=90', alt: 'Proteína vegetal', origin: 'Estados Unidos', originLabel: 'Estados Unidos', flag: '🇺🇸', format: '900 g', price: 119.90, link: '#' },
    { id: 'granola-sin-azucar', name: 'Granola sin azúcar', category: 'Cereales', image: 'https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=800&q=90', alt: 'Granola sin azúcar', origin: 'Perú', originLabel: 'Perú', flag: '🇵🇪', format: '400 g', price: 32.90, link: '#', tag: 'Sin azúcar' },
    { id: 'crema-corporal-natural', name: 'Crema corporal natural', category: 'Cuidado personal', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=90', alt: 'Crema corporal natural', origin: 'Francia', originLabel: 'Francia', flag: '🇫🇷', format: '250 ml', price: 45.90, link: '#' },
    { id: 'limpiador-ecologico', name: 'Limpiador ecológico', category: 'Limpieza', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=800&q=90', alt: 'Limpiador ecológico', origin: 'Perú', originLabel: 'Perú', flag: '🇵🇪', format: '500 ml', price: 29.90, link: '#' }
  ];
}
