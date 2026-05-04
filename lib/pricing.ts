import type { ProductVariant } from '@/types/api';

const DEFAULT_VAT_RATE = 0.19;

function toNumber(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getVatAwarePrices(
  variant: Pick<ProductVariant, 'price' | 'priceWithTax'> | null | undefined
): { net: number | null; gross: number | null } {
  if (!variant) return { net: null, gross: null };
  const net = toNumber(variant.price);
  const gross = toNumber(variant.priceWithTax);
  if (gross != null) return { net, gross };
  if (net == null) return { net: null, gross: null };
  return {
    net,
    gross: Math.round(net * (1 + DEFAULT_VAT_RATE) * 100) / 100,
  };
}

