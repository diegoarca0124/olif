import { Component } from '@angular/core';
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
  imports: [],
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
}
