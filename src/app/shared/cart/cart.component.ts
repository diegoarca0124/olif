import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent implements OnDestroy {
  @ViewChild('closeButton')
  closeButton?: ElementRef<HTMLButtonElement>;

  isOpen = false;
  private lastFocusedElement?: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  open(): void {
    if (this.isOpen) return;

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
    if (!this.isOpen) return;

    this.isOpen = false;
    this.document.body.classList.remove('cart-open');

    requestAnimationFrame(() => {
      this.lastFocusedElement?.focus();
    });
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