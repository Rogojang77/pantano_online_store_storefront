import { siteConfig } from '@/config/site';

/**
 * Rewrites URLs served by this backend's media routes to use the API origin from
 * NEXT_PUBLIC_API_URL. Fixes broken images when the DB still has e.g. http://localhost:3000/...
 * but the API runs on another host/port (Docker publish, staging domain, etc.).
 */
export function resolveBackendMediaUrl(url: string | null | undefined): string {
  if (url == null || url === '') return '';

  let origin: string;
  try {
    const parsed = new URL(siteConfig.apiUrl);
    origin = `${parsed.protocol}//${parsed.host}`;
  } catch {
    return url;
  }

  if (url.startsWith('/')) {
    return `${origin}${url}`;
  }

  try {
    const u = new URL(url);
    if (u.pathname.includes('/media/files/')) {
      return `${origin}${u.pathname}${u.search}`;
    }
  } catch {
    return url;
  }

  return url;
}
