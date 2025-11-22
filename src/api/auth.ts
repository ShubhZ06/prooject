const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export function login(email: string, password: string) {
  return apiFetch<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(fullName: string, email: string, password: string) {
  return apiFetch<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });
}

export function getCurrentUser() {
  return apiFetch<AuthUser>('/auth/me');
}

export function logout() {
  return apiFetch<{ message: string }>('/auth/logout', { method: 'POST' });
}
