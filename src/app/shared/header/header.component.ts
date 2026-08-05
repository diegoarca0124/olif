import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-header',
  imports: [
    CartComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {

}
