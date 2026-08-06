import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

export interface ProductRow {
  id: number;
  name: string;
  category: string | null;
  cover: string | null;
  origin: string | null;
  format: string | null;
  regularPrice: string | null;
  discountPrice: string | null;
  stock: string | null;
  image: string;
  description: string | null;
  label: string | null;
}

export interface ProductsPage {
  products: ProductRow[];
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  private readonly supabase = createClient(
    'https://uflciifbfkmrnydqvzfn.supabase.co',
    'sb_publishable_cWKlozbuyW_0QWxlTkp92Q_xLPsVlEa'
  );

  async getFeaturedProducts(): Promise<ProductRow[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('status', true)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error consultando productos:', error);
      throw error;
    }

    return data ?? [];
  }

  async getProductsPage(offset: number, limit = 20): Promise<ProductsPage> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('status', true)
      .order('id', { ascending: true })
      .range(offset, offset + limit);

    if (error) {
      console.error('Error consultando productos:', error);
      throw error;
    }

    const rows = data ?? [];

    return {
      products: rows.slice(0, limit),
      hasMore: rows.length > limit
    };
  }
}
