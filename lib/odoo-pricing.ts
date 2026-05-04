import type { Product } from '@/types/api';

const ODOO_NEW_PRICE_KEYS = [
  'odooNewPrice',
  'odoo_new_price',
  'newPrice',
  'new_price',
  'priceNew',
  'price_new',
  'priceWithTax',
  'price_with_tax',
  'priceTtc',
  'price_ttc',
  'listPriceWithTax',
  'list_price_with_tax',
] as const;

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readFromRecord(record: Record<string, unknown>): number | null {
  for (const key of ODOO_NEW_PRICE_KEYS) {
    const parsed = toFiniteNumber(record[key]);
    if (parsed != null) return parsed;
  }
  return null;
}

export function getOdooNewPrice(product: Product | null | undefined): number | null {
  if (!product) return null;

  const technicalSpecs = product.technicalSpecs;
  if (technicalSpecs && typeof technicalSpecs === 'object' && !Array.isArray(technicalSpecs)) {
    const specsRecord = technicalSpecs as Record<string, unknown>;
    const directMatch = readFromRecord(specsRecord);
    if (directMatch != null) return directMatch;

    const nestedOdoo = specsRecord.odoo;
    if (nestedOdoo && typeof nestedOdoo === 'object' && !Array.isArray(nestedOdoo)) {
      const nestedMatch = readFromRecord(nestedOdoo as Record<string, unknown>);
      if (nestedMatch != null) return nestedMatch;
    }
  }

  return null;
}
