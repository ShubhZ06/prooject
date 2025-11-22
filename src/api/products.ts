import type { Product } from '@/types';
import { apiFetch } from './auth';

export interface ProductQuery {
  q?: string;
  status?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function getProducts(params?: ProductQuery) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.status && params.status !== 'All Products') qs.set('status', params.status);
  if (params?.category) qs.set('category', params.category);
  if (params?.minPrice !== undefined) qs.set('minPrice', String(params.minPrice));
  if (params?.maxPrice !== undefined) qs.set('maxPrice', String(params.maxPrice));

  const query = qs.toString();
  return apiFetch<Product[]>(`/products${query ? `?${query}` : ''}`);
}
