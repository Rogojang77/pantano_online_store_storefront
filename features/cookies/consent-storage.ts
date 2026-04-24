import { siteConfig } from '@/config/site';
import {
  COOKIE_CONSENT_VERSION,
  defaultConsentCategories,
  defaultConsentState,
  type ConsentStatus,
  type CookieConsentState,
} from './consent-types';

const CONSENT_COOKIE_NAME = 'pantano_cookie_consent';
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

function isBrowser() {
  return typeof window !== 'undefined';
}

function normalizeConsent(input: unknown): CookieConsentState | null {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const candidate = input as Partial<CookieConsentState>;
  const categories = candidate.categories;

  if (
    !categories ||
    typeof categories !== 'object' ||
    typeof categories.preferences !== 'boolean' ||
    typeof categories.analytics !== 'boolean' ||
    typeof categories.marketing !== 'boolean'
  ) {
    return null;
  }

  const status: ConsentStatus =
    candidate.status === 'partial' ||
    candidate.status === 'accepted_all' ||
    candidate.status === 'rejected_optional'
      ? candidate.status
      : 'unset';

  const version =
    typeof candidate.version === 'number' && Number.isFinite(candidate.version)
      ? candidate.version
      : COOKIE_CONSENT_VERSION;

  return {
    version,
    status,
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : '',
    categories: {
      necessary: true,
      preferences: categories.preferences,
      analytics: categories.analytics,
      marketing: categories.marketing,
    },
  };
}

function parseCookieValue(name: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split('=')[1] ?? '') : null;
}

export function getStoredConsent(): CookieConsentState {
  if (!isBrowser()) {
    return defaultConsentState;
  }

  try {
    const raw = localStorage.getItem(siteConfig.cookieConsentStorageKey);
    if (raw) {
      const parsed = normalizeConsent(JSON.parse(raw));
      if (parsed && parsed.version === COOKIE_CONSENT_VERSION) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed local storage state.
  }

  try {
    const rawCookie = parseCookieValue(CONSENT_COOKIE_NAME);
    if (rawCookie) {
      const parsed = normalizeConsent(JSON.parse(rawCookie));
      if (parsed && parsed.version === COOKIE_CONSENT_VERSION) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed cookie state.
  }

  return defaultConsentState;
}

export function saveConsent(consent: CookieConsentState) {
  if (!isBrowser()) {
    return;
  }

  const payload = {
    ...consent,
    version: COOKIE_CONSENT_VERSION,
    categories: {
      ...defaultConsentCategories,
      ...consent.categories,
      necessary: true,
    },
  };

  const serialized = JSON.stringify(payload);

  localStorage.setItem(siteConfig.cookieConsentStorageKey, serialized);
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(serialized)};path=/;max-age=${CONSENT_COOKIE_MAX_AGE_SECONDS};SameSite=Lax`;
}
