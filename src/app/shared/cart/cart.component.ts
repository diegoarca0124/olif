import { DecimalPipe, DOCUMENT } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  ViewChild,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent implements OnDestroy {
  @ViewChild('closeButton')
  closeButton?: ElementRef<HTMLButtonElement>;

  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;

  isOpen = false;

  private lastFocusedElement?: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {
    this.cartService.openRequested$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.open();
      });
  }

  open(): void {
    if (this.isOpen) {
      return;
    }

    const activeElement = this.document.activeElement;

    if (activeElement instanceof HTMLElement) {
      this.lastFocusedElement = activeElement;
    }

    this.isOpen = true;
    this.document.body.classList.add('cart-open');

    requestAnimationFrame(() => {
      this.closeButton?.nativeElement.focus();
    });
  }

  close(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.document.body.classList.remove('cart-open');

    requestAnimationFrame(() => {
      this.lastFocusedElement?.focus();
    });
  }

  increase(productId: number): void {
    this.cartService.increase(productId);
  }

  decrease(productId: number): void {
    this.cartService.decrease(productId);
  }

  remove(productId: number): void {
    this.cartService.remove(productId);
  }

  goToProducts(): void {
    this.close();
    void this.router.navigate(['/productos']);
  }

  @HostListener('document:keydown.escape')
  closeWithEscape(): void {
    this.close();
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('cart-open');
  }
}