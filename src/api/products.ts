const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

import { Product } from '../types';

export interface ProductInput {
  name: string;
  sku: string;
  category: string;
  stock?: number;
  minStock: number;
  price: number;
  status: Product['status'];
  image?: string;
  location?: string;
  unit?: string;
  supplier?: string;
  description?: string;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export function fetchProducts() {
  return apiFetch<Product[]>('/products');
}

export function createProduct(input: ProductInput) {
  return apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateProduct(id: string, input: ProductInput) {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function bulkImportProducts(items: ProductInput[]) {
  return apiFetch<Product[]>('/products/bulk', {
    method: 'POST',
    body: JSON.stringify(items),
  });
}
