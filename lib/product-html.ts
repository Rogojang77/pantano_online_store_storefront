/**
 * Product descriptions may contain HTML from WooCommerce / imports.
 * Strip scripts/styles and event handlers before injecting; use plain-text helper for snippets.
 */
export function sanitizeProductDescriptionHtml(html: string): string {
  return String(html)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

export function htmlToPlainTextExcerpt(html: string, max = 200): string {
  const plain = sanitizeProductDescriptionHtml(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max - 1)}…`;
}
