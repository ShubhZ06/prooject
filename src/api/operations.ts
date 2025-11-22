const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

import { Operation, OperationType, OperationStatus, OperationItem } from '@/types';

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

export interface OperationInput {
  reference: string;
  type: OperationType;
  status: OperationStatus;
  scheduleDate: string; // yyyy-mm-dd
  contact?: string;
  sourceLocation?: string;
  destinationLocation?: string;
  items: OperationItem[];
}

export function getOperations() {
  return apiFetch<Operation[]>('/operations');
}

export function createOperation(input: OperationInput) {
  return apiFetch<Operation>('/operations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateOperationStatus(id: string, status: OperationStatus) {
  return apiFetch<Operation>(`/operations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
