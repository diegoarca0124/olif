import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { ProductRow, ProductsService } from '../../../../services/products.service';
interface FeaturedProduct {
  id: number;
  name: string;
  category: string;
  cover: string;
  alt: string;
  origin: string;
  originLabel: string;
  flag: string;
  format: string;
  price: number;
  link: string;
  label?: string;
}

@Component({
  selector: 'app-featured-home',
  imports: [
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './featured-home.component.html',
  styleUrl: './featured-home.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FeaturedHomeComponent {
  private readonly productsService = inject(ProductsService);

  products: FeaturedProduct[] = [];
  loading = true;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    try {
      const rows = await this.productsService.getFeaturedProducts();

      this.products = rows.map(row => this.mapProduct(row));
    } catch (error) {
      console.error(error);
      this.errorMessage = 'No fue posible cargar los productos.';
    } finally {
      this.loading = false;
    }
  }

  private mapProduct(row: ProductRow): FeaturedProduct {
    return {
      id: row.id,
      name: row.name,
      category: row.category?.trim() || 'Producto',
      cover: row.cover || row.cover || '/products/placeholder.webp',
      alt: row.name,
      origin: row.origin || '',
      originLabel: row.origin || 'Origen no especificado',
      flag: this.getCountryFlag(row.origin),
      format: row.format || '',
      price: Number(row.discountPrice || row.regularPrice || 0),
      link: `/productos/${row.id}`,
      label: row.label || undefined
    };
  }

  private getCountryFlag(origin: string | null): string {
    const flags: Record<string, string> = {
      'Estados Unidos': '/flags/united-states.svg',
      'China': '/flags/china.svg',
      'Perú': '/flags/peru.svg',
      'Canadá': '/flags/canada.svg',
      'Alemania': '/flags/germany.svg',
      'Francia': '/flags/france.svg'
    };

    return origin ? flags[origin] ?? '🌎' : '🌎';
  }
}
