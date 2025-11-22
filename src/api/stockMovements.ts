const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

import { StockMovement, OperationStatus } from '@/types';

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

export function getStockMovements() {
  return apiFetch<StockMovement[]>('/stock-movements');
}

export function updateStockMovementStatus(id: string, status: OperationStatus) {
  return apiFetch<StockMovement>(`/stock-movements/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
