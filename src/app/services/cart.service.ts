import { computed, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface CartProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'olif-cart';
  private readonly itemsState = signal<CartItem[]>(this.loadCart());
  private readonly openRequests = new Subject<void>();

  readonly items = this.itemsState.asReadonly();

  readonly itemCount = computed(() =>
    this.itemsState().reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  readonly subtotal = computed(() =>
    this.itemsState().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );

  readonly openRequested$ = this.openRequests.asObservable();

  add(product: CartProduct): void {
    const currentItems = this.itemsState();
    const existingProduct = currentItems.find(
      item => item.id === product.id
    );

    const updatedItems = existingProduct
      ? currentItems.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      : [
          ...currentItems,
          {
            ...product,
            quantity: 1
          }
        ];

    this.updateCart(updatedItems);
  }

  increase(productId: number): void {
    const updatedItems = this.itemsState().map(item =>
      item.id === productId
        ? {
            ...item,
            quantity: item.quantity + 1
          }
        : item
    );

    this.updateCart(updatedItems);
  }

  decrease(productId: number): void {
    const updatedItems = this.itemsState().flatMap(item => {
      if (item.id !== productId) {
        return [item];
      }

      if (item.quantity <= 1) {
        return [];
      }

      return [
        {
          ...item,
          quantity: item.quantity - 1
        }
      ];
    });

    this.updateCart(updatedItems);
  }

  remove(productId: number): void {
    const updatedItems = this.itemsState().filter(
      item => item.id !== productId
    );

    this.updateCart(updatedItems);
  }

  clear(): void {
    this.updateCart([]);
  }

  requestOpen(): void {
    this.openRequests.next();
  }

  quantityOf(productId: number): number {
    return this.itemsState().find(
      item => item.id === productId
    )?.quantity ?? 0;
  }

  private updateCart(items: CartItem[]): void {
    this.itemsState.set(items);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(items)
      );
    }
  }

  private loadCart(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const storedCart = localStorage.getItem(this.storageKey);

      if (!storedCart) {
        return [];
      }

      const parsedCart = JSON.parse(storedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch {
      return [];
    }
  }
}
