import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../../services/cart.service';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [
    CartComponent,
    RouterLink,
    RouterModule
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);

  readonly cartCount = this.cartService.itemCount;
}
