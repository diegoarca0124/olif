import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SliderHomeComponent } from './components/slider-home/slider-home.component';
import { CategoriesHomeComponent } from './components/categories-home/categories-home.component';
import { BrandsHomeComponent } from './components/brands-home/brands-home.component';
import { FounderHomeComponent } from './components/founder-home/founder-home.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    SliderHomeComponent,
    CategoriesHomeComponent,
    BrandsHomeComponent,
    FounderHomeComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
