/**
 * Product descriptions may contain HTML from WooCommerce / imports.
 * Strip scripts/styles and event handlers before injecting; use plain-text helper for snippets.
 */
export type StructuredProductDescription = {
  introLabel: string | null;
  summary: string | null;
  heroNote: string | null;
  highlightChips: string[];
  heroStats: Array<{ label: string; value: string }>;
  benefits: Array<{ title: string; body: string }>;
  ingredients: string[];
  analytics: Array<{ label: string; value: string }>;
  attributeImageUrl: string | null;
  additives: Array<{
    title: string;
    subtitle: string | null;
    rows: Array<{ label: string; value: string }>;
  }>;
  feedingGuide:
    | {
        title: string;
        intro: string | null;
        headers: string[];
        rows: string[][];
        note: string | null;
      }
    | null;
  faq: Array<{ question: string; answer: string }>;
  sections: Array<{ title: string; paragraphs: string[] }>;
};

function decodeHtmlEntities(input: string): string {
  const namedEntities: Record<string, string> = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    hellip: '...',
    ndash: '-',
    mdash: '-',
  };

  return input
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
      const normalized = entity.toLowerCase();
      if (normalized.startsWith('#x')) {
        const codePoint = Number.parseInt(normalized.slice(2), 16);
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
      }
      if (normalized.startsWith('#')) {
        const codePoint = Number.parseInt(normalized.slice(1), 10);
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
      }
      return namedEntities[normalized] ?? match;
    })
    .replace(/\u00a0/g, ' ');
}

export function sanitizeProductDescriptionHtml(html: string): string {
  return decodeHtmlEntities(String(html))
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

function htmlToTextLines(html: string): string[] {
  return sanitizeProductDescriptionHtml(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function normalizeHeading(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[:\-–]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isLikelyHeading(line: string): boolean {
  const normalized = normalizeHeading(line.replace(/^-+\s*/, ''));
  return [
    'beneficii',
    'beneficii cheie',
    'caracteristici',
    'caracteristici cheie',
    'avantaje',
    'ingrediente',
    'compozitie',
    'componente analitice',
    'constituenti analitici',
    'analiza nutritionala',
    'recomandari de hranire',
    'mod de administrare',
    'stabilitate si pastrare',
    'mod de pastrare',
    'aditivi',
    'alti aditivi',
    'apa',
    'destinatie',
    'intrebari frecvente',
    'faq',
    'depozitare',
  ].some((heading) => normalized.includes(heading));
}

function splitTitleAndBody(line: string): { title: string; body: string } {
  const clean = line.replace(/^-+\s*/, '').trim();
  const dashMatch = clean.match(/^(.{3,80}?)\s+[–-]\s+(.+)$/);
  if (dashMatch) {
    return { title: dashMatch[1].trim(), body: dashMatch[2].trim() };
  }
  const colonMatch = clean.match(/^(.{3,80}?):\s+(.+)$/);
  if (colonMatch) {
    return { title: colonMatch[1].trim(), body: colonMatch[2].trim() };
  }
  return { title: clean, body: '' };
}

function looksLikeAnalyticsLine(line: string): boolean {
  return /^[-•]?\s*[^:]{2,80}:\s*[^,;%]+[%a-zA-Z0-9.,/ ]*$/.test(line) && /\d/.test(line);
}

function parseAnalyticsLine(line: string): { label: string; value: string } | null {
  const match = line
    .replace(/^-+\s*/, '')
    .match(/^([^:]{2,80}):\s*(.+)$/);
  if (!match) return null;
  return { label: match[1].trim(), value: match[2].trim() };
}

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function looksLikeIngredientLine(line: string): boolean {
  const normalized = normalizeHeading(line);
  if (line.includes(',') || line.includes(';')) return true;
  if (/\b\d+(?:[.,]\d+)?\s*(%|mg\/kg|g\/kg|ui\/kg)\b/i.test(line)) return true;
  return [
    'cereale',
    'carne',
    'derivati',
    'derivați',
    'uleiuri',
    'grasimi',
    'grăsimi',
    'minerale',
    'porumb',
    'orez',
    'grau',
    'grâu',
    'vita',
    'vită',
    'peste',
    'pește',
    'pasare',
    'pasăre',
    'extract',
  ].some((token) => normalized.includes(token));
}

function extractLooseBenefit(line: string): { title: string; body: string } | null {
  const clean = line.replace(/^[A-Z]\s+/, '').trim();
  if (looksLikeIngredientLine(clean) || clean.length < 30) return null;

  const words = clean.split(/\s+/);
  for (let count = 2; count <= Math.min(5, words.length - 3); count++) {
    const title = words.slice(0, count).join(' ');
    const body = words.slice(count).join(' ');
    if (
      body.length >= 18 &&
      /^[A-ZĂÂÎȘȚ]/.test(body) &&
      !/[,:;]/.test(title) &&
      title.length <= 42
    ) {
      return { title, body };
    }
  }

  return null;
}

function stripTagsPreservingText(html: string): string {
  return sanitizeProductDescriptionHtml(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageUrls(html: string): string[] {
  const urls: string[] = [];
  const regex = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(regex)) {
    const src = match[1]?.trim();
    if (src) urls.push(src);
  }
  return dedupeStrings(urls);
}

function extractDetailsFaq(html: string): Array<{ question: string; answer: string }> {
  const items: Array<{ question: string; answer: string }> = [];
  const regex = /<details\b[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*([\s\S]*?)<\/details>/gi;
  for (const match of html.matchAll(regex)) {
    const question = stripTagsPreservingText(match[1] ?? '');
    const answer = stripTagsPreservingText(match[2] ?? '');
    if (question && answer) items.push({ question, answer });
  }
  return items.slice(0, 10);
}

function extractHeadingBeforeIndex(html: string, index: number): string | null {
  const before = html.slice(0, index);
  const headings = Array.from(before.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi));
  const lastHeading = headings.at(-1);
  return lastHeading ? stripTagsPreservingText(lastHeading[1] ?? '') : null;
}

function parseHtmlTable(tableHtml: string): { headers: string[]; rows: string[][] } | null {
  const rowMatches = Array.from(tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi));
  if (!rowMatches.length) return null;

  const parsedRows = rowMatches
    .map((rowMatch) => {
      const cellMatches = Array.from(rowMatch[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi));
      return cellMatches.map((cellMatch) => stripTagsPreservingText(cellMatch[1] ?? ''));
    })
    .filter((row) => row.length > 0);

  if (!parsedRows.length) return null;

  let headers: string[] = [];
  let rows = parsedRows;
  const theadMatch = tableHtml.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
  if (theadMatch) {
    const headRows = parseHtmlTable(theadMatch[1]);
    headers = headRows?.rows[0] ?? [];
  } else if (/<th/i.test(rowMatches[0][1])) {
    headers = parsedRows[0];
    rows = parsedRows.slice(1);
  }

  return { headers, rows };
}

function extractTablesWithContext(html: string): Array<{
  title: string | null;
  textBefore: string | null;
  table: { headers: string[]; rows: string[][] };
}> {
  const items: Array<{
    title: string | null;
    textBefore: string | null;
    table: { headers: string[]; rows: string[][] };
  }> = [];

  for (const match of html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)) {
    const full = match[0];
    const table = parseHtmlTable(full);
    if (!table || !table.rows.length) continue;

    const start = match.index ?? 0;
    const title = extractHeadingBeforeIndex(html, start);
    const snippet = html.slice(Math.max(0, start - 500), start);
    const paragraphs = Array.from(snippet.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
      .map((p) => stripTagsPreservingText(p[1] ?? ''))
      .filter(Boolean);

    items.push({
      title,
      textBefore: paragraphs.at(-1) ?? null,
      table,
    });
  }

  return items;
}

export function parseStructuredProductDescription(html: string): StructuredProductDescription | null {
  const sanitizedHtml = sanitizeProductDescriptionHtml(html);
  const lines = htmlToTextLines(sanitizedHtml);
  if (lines.length < 4) return null;

  const introLines: string[] = [];
  const benefitsRaw: string[] = [];
  const ingredientsRaw: string[] = [];
  const analyticsRaw: string[] = [];
  const extraSections = new Map<string, string[]>();
  const additivesRaw = new Map<string, string[]>();
  const feedingRaw: string[] = [];
  let currentSection: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+/g, ' ').trim();
    if (!line) continue;

    if (isLikelyHeading(line)) {
      currentSection = normalizeHeading(line);
      if (!extraSections.has(currentSection)) extraSections.set(currentSection, []);
      continue;
    }

    if (currentSection == null) {
      introLines.push(line);
      continue;
    }

    if (
      currentSection.includes('beneficii') ||
      currentSection.includes('avantaje') ||
      currentSection.includes('caracteristici')
    ) {
      benefitsRaw.push(line);
      continue;
    }

    if (currentSection.includes('ingrediente') || currentSection.includes('compozitie')) {
      const looseBenefit = extractLooseBenefit(line);
      if (looseBenefit) {
        benefitsRaw.push(`${looseBenefit.title}: ${looseBenefit.body}`);
      } else if (looksLikeIngredientLine(line)) {
        ingredientsRaw.push(line);
      } else {
        extraSections.get(currentSection)?.push(line);
      }
      continue;
    }

    if (
      currentSection.includes('componente analitice') ||
      currentSection.includes('constituenti analitici') ||
      currentSection.includes('analiza nutritionala')
    ) {
      analyticsRaw.push(line);
      continue;
    }

    if (currentSection.includes('aditivi')) {
      if (!additivesRaw.has(currentSection)) additivesRaw.set(currentSection, []);
      additivesRaw.get(currentSection)?.push(line);
      continue;
    }

    if (
      currentSection.includes('hranire') ||
      currentSection.includes('administrare')
    ) {
      feedingRaw.push(line);
      continue;
    }

    extraSections.get(currentSection)?.push(line);
  }

  if (!analyticsRaw.length) {
    for (const line of lines) {
      if (looksLikeAnalyticsLine(line)) analyticsRaw.push(line);
    }
  }

  const introParagraphs = dedupeStrings(
    introLines
      .filter((line) => !looksLikeAnalyticsLine(line))
      .map((line) => line.replace(/^-+\s*/, '').trim())
      .filter((line) => line.length > 2),
  );

  const benefits = dedupeStrings(benefitsRaw)
    .map((line) => splitTitleAndBody(line))
    .map((item) => ({
      title: item.title,
      body: item.body || item.title,
    }))
    .slice(0, 6);

  const analytics = dedupeStrings(analyticsRaw)
    .map((line) => parseAnalyticsLine(line))
    .filter((item): item is { label: string; value: string } => Boolean(item))
    .slice(0, 8);

  const ingredients = dedupeStrings(
    ingredientsRaw
      .map((line) => line.replace(/^-+\s*/, '').trim())
      .filter((line) => line.length > 2)
      .filter((line) => looksLikeIngredientLine(line)),
  );

  const sections = Array.from(extraSections.entries())
    .filter(([title, paragraphs]) => {
      if (!paragraphs.length) return false;
      return !(
        title.includes('beneficii') ||
        title.includes('avantaje') ||
        title.includes('caracteristici') ||
        title.includes('ingrediente') ||
        title.includes('compozitie') ||
        title.includes('componente analitice') ||
        title.includes('constituenti analitici') ||
        title.includes('analiza nutritionala') ||
        title.includes('aditivi') ||
        title.includes('hranire') ||
        title.includes('administrare') ||
        title.includes('pastrare') ||
        title.includes('stabilitate') ||
        title.includes('faq') ||
        title.includes('intrebari frecvente')
      );
    })
    .map(([title, paragraphs]) => ({
      title: title
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
      paragraphs: dedupeStrings(paragraphs),
    }));

  const imageUrls = extractImageUrls(sanitizedHtml);
  const attributeImageUrl = imageUrls[1] ?? null;
  const faq = extractDetailsFaq(sanitizedHtml);
  const tables = extractTablesWithContext(sanitizedHtml);

  const additiveTables = tables
    .filter((item) => normalizeHeading(item.title ?? '').includes('aditivi'))
    .map((item, index) => ({
      title: item.title ?? `Aditivi ${index + 1}`,
      subtitle: item.textBefore && item.textBefore.length < 220 ? item.textBefore : null,
      rows: item.table.rows
        .filter((row) => row.length >= 2)
        .map((row) => ({ label: row[0] ?? '', value: row[1] ?? '' }))
        .filter((row) => row.label && row.value),
    }))
    .filter((group) => group.rows.length);

  const additivesFromText = Array.from(additivesRaw.entries())
    .map(([title, values]) => ({
      title: title
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
      subtitle: null,
      rows: values
        .map((line) => parseAnalyticsLine(line))
        .filter((item): item is { label: string; value: string } => Boolean(item)),
    }))
    .filter((group) => group.rows.length);

  const additives = additiveTables.length ? additiveTables : additivesFromText;

  const feedingTable = tables.find((item) => {
    const title = normalizeHeading(item.title ?? '');
    return title.includes('hranire') || title.includes('administrare');
  });

  const feedingGuide = feedingTable
    ? {
        title: feedingTable.title ?? 'Recomandări de hrănire',
        intro:
          feedingTable.textBefore && feedingTable.textBefore.length < 260
            ? feedingTable.textBefore
            : feedingRaw.find((line) => line.length > 20) ?? null,
        headers: feedingTable.table.headers,
        rows: feedingTable.table.rows,
        note:
          sections.find((section) => normalizeHeading(section.title).includes('hranire'))
            ?.paragraphs.at(-1) ?? null,
      }
    : null;

  const normalizedExtraSections = sections.filter((section) => {
    const title = normalizeHeading(section.title);
    return !(title === 'ingrediente' && ingredients.length > 0);
  });

  const summary =
    introParagraphs.find((line) => line.length >= 50 && line.length <= 220) ??
    introParagraphs[1] ??
    introParagraphs[0] ??
    null;

  const introLabel = introParagraphs[0] && introParagraphs[0].length <= 60 ? introParagraphs[0] : null;
  const heroNote =
    normalizedExtraSections.find((section) => {
      const title = normalizeHeading(section.title);
      return title.includes('pastrare') || title.includes('stabilitate');
    })?.paragraphs[0] ?? null;
  const highlightChips = dedupeStrings(
    [
      ...benefits.slice(0, 2).map((item) => item.title),
      ...ingredients
        .flatMap((line) => line.split(/[;,]/))
        .map((item) => item.trim())
        .filter((item) => item.length >= 4 && item.length <= 28),
    ].slice(0, 3),
  );

  const heroStats = analytics.slice(0, 3);

  const hasStructuredContent =
    introParagraphs.length >= 2 ||
    benefits.length >= 2 ||
    ingredients.length > 0 ||
    analytics.length >= 2 ||
    additives.length > 0 ||
    Boolean(feedingGuide) ||
    faq.length > 0 ||
    normalizedExtraSections.length > 0;

  if (!hasStructuredContent) return null;

  return {
    introLabel,
    summary,
    heroNote,
    highlightChips,
    heroStats,
    benefits,
    ingredients,
    analytics,
    attributeImageUrl,
    additives,
    feedingGuide,
    faq,
    sections: normalizedExtraSections,
  };
}
