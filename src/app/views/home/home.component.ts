import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SliderHomeComponent } from './components/slider-home/slider-home.component';
import { CategoriesHomeComponent } from './components/categories-home/categories-home.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    SliderHomeComponent,
    CategoriesHomeComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
