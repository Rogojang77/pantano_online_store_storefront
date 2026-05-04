/**
 * Central API client for the Pantano backend.
 * Uses fetch with NEXT_PUBLIC_API_URL and cookie-based auth.
 */

import { siteConfig } from '@/config/site';

const API_BASE = siteConfig.apiUrl;
const REQUEST_ID_HEADER = 'x-request-id';

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

type RequestInitWithAuth = RequestInit & { token?: string | null };

async function request<T>(
  path: string,
  options: RequestInitWithAuth = {}
): Promise<T> {
  const { token, ...init } = options;
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  (headers as Record<string, string>)[REQUEST_ID_HEADER] =
    (headers as Record<string, string>)[REQUEST_ID_HEADER] ?? createRequestId();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...init, headers, credentials: 'include' });
  const responseRequestId = res.headers.get(REQUEST_ID_HEADER) ?? undefined;
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new ApiError(res.status, res.statusText, errBody, responseRequestId);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    statusText: string,
    public body?: unknown,
    public requestId?: string
  ) {
    super(`${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

// --- Public (no auth) ---

export const api = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'GET', token }),

  post: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined, token }),

  put: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, token }),

  patch: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, token }),

  delete: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'DELETE', token }),
};

