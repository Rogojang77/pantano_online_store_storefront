'use client';

import { cn } from '@/lib/utils';

interface TechnicalSpecsTableProps {
  specs: Record<string, unknown>;
  className?: string;
}

export function TechnicalSpecsTable({ specs, className }: TechnicalSpecsTableProps) {
  const entries = extractSpecEntries(specs);

  if (entries.length === 0) return null;

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[280px] border-collapse text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr
              key={key}
              className="border-b border-neutral-200 dark:border-neutral-700"
            >
              <td className="py-3 pr-4 font-medium text-neutral-600 dark:text-neutral-400">
                {formatSpecKey(key)}
              </td>
              <td className="py-3 text-neutral-900 dark:text-neutral-100">
                {formatSpecValue(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatSpecKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
}

function formatSpecValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Da' : 'Nu';
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

type SpecEntry = [string, unknown];

function extractSpecEntries(specs: Record<string, unknown>): SpecEntry[] {
  const prioritized = [
    ...extractIcecatFeatureGroupEntries(specs),
    ...extractOdooDetailEntries(specs),
  ];
  if (prioritized.length > 0) return prioritized;
  return flattenEntries(specs);
}

function extractIcecatFeatureGroupEntries(specs: Record<string, unknown>): SpecEntry[] {
  const icecat = asRecord(specs.icecat);
  const featureGroups = asRecord(icecat?.featureGroups);
  if (!featureGroups) return [];

  const entries: SpecEntry[] = [];
  for (const [groupName, groupValue] of Object.entries(featureGroups)) {
    const group = asRecord(groupValue);
    if (!group) continue;

    for (const [featureName, featureValue] of Object.entries(group)) {
      if (!isDisplayable(featureValue)) continue;
      entries.push([`${groupName} - ${featureName}`, featureValue]);
    }
  }
  return entries;
}

function extractOdooDetailEntries(specs: Record<string, unknown>): SpecEntry[] {
  const odoo = asRecord(specs.odoo);
  const detail = asRecord(odoo?.productDetail);
  if (!detail) return [];

  const blockedKeys = new Set([
    'id',
    'name',
    'description',
    'descriptionSale',
    'websiteMetaTitle',
    'websiteMetaDescription',
    'websiteMetaKeywords',
    'defaultCode',
    'listPrice',
    'standardPrice',
    'taxes',
    'supplierTaxes',
    'sellers',
    'variantSellers',
    'tags',
    'posCategories',
  ]);

  const entries: SpecEntry[] = [];
  for (const [key, value] of Object.entries(detail)) {
    if (blockedKeys.has(key)) continue;
    if (!isDisplayable(value)) continue;

    if (key === 'category' || key === 'uom' || key === 'purchaseUom') {
      const relation = asRecord(value);
      const relationName = relation?.name;
      if (typeof relationName === 'string' && relationName.trim()) {
        entries.push([key, relationName.trim()]);
      }
      continue;
    }

    entries.push([key, value]);
  }

  return entries;
}

function flattenEntries(
  source: Record<string, unknown>,
  prefix = '',
  depth = 0
): SpecEntry[] {
  const entries: SpecEntry[] = [];
  for (const [key, value] of Object.entries(source)) {
    if (!isDisplayable(value)) continue;
    const nextKey = prefix ? `${prefix} - ${key}` : key;

    if (depth < 2) {
      const nested = asRecord(value);
      if (nested) {
        entries.push(...flattenEntries(nested, nextKey, depth + 1));
        continue;
      }
    }

    entries.push([nextKey, value]);
  }
  return entries;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function isDisplayable(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && !value.trim()) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as object).length > 0;
  return true;
}
