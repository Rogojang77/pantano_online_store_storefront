'use client';

import { siteConfig } from '@/config/site';

type AnalyticsEventName =
  | 'view_product'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'checkout_step'
  | 'purchase';

type TrackEventPayload = {
  eventName: AnalyticsEventName;
  sessionId?: string;
  productId?: string;
  orderId?: string;
  checkoutStep?: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

const SESSION_STORAGE_KEY = 'pantano:analytics:session-id';

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing && existing.trim()) return existing;
  const created = createSessionId();
  window.localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}

export async function trackEvent(payload: TrackEventPayload): Promise<void> {
  if (typeof window === 'undefined') return;

  const body: TrackEventPayload = {
    ...payload,
    sessionId: payload.sessionId ?? getOrCreateSessionId(),
    source: payload.source ?? window.location.pathname,
  };

  try {
    await fetch(`${siteConfig.apiUrl}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      keepalive: true,
      body: JSON.stringify(body),
    });
  } catch {
    // Fire-and-forget analytics; do not impact UX flow.
  }
}
