'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface TechnicalSpecsTableProps {
  specs: Record<string, unknown>;
  className?: string;
}

export function TechnicalSpecsTable({ specs, className }: TechnicalSpecsTableProps) {
  const entries = extractSpecEntries(specs);
  const groupedEntries = useMemo(() => groupEntriesBySection(entries), [entries]);
  const sectionNames = useMemo(() => Object.keys(groupedEntries), [groupedEntries]);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (entries.length === 0) return null;

  const selectedSection =
    activeSection && groupedEntries[activeSection]
      ? activeSection
      : sectionNames[0] ?? null;
  const visibleEntries = selectedSection ? groupedEntries[selectedSection] : entries;
  const shouldRenderSectionTabs = sectionNames.length > 1;

  return (
    <div className={cn('space-y-4', className)}>
      {shouldRenderSectionTabs && (
        <div className="flex flex-wrap gap-2">
          {sectionNames.map((section) => {
            const isActive = section === selectedSection;
            return (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
              >
                {section}
              </button>
            );
          })}
        </div>
      )}

      <div className="overflow-x-auto">
      <table className="w-full min-w-[280px] border-collapse text-sm">
        <tbody>
          {visibleEntries.map(([key, value]) => (
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
    return value.map((item) => formatSpecValue(item)).join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

type SpecEntry = [string, unknown];

function groupEntriesBySection(entries: SpecEntry[]): Record<string, SpecEntry[]> {
  const grouped: Record<string, SpecEntry[]> = {};
  for (const [key, value] of entries) {
    const { section, label } = splitSpecKey(key);
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push([label, value]);
  }
  return grouped;
}

function splitSpecKey(key: string): { section: string; label: string } {
  const parts = key.split(' - ').map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      section: formatSpecKey(parts[0]),
      label: formatSpecKey(parts.slice(1).join(' - ')),
    };
  }

  return {
    section: 'Specificații',
    label: formatSpecKey(key),
  };
}

/** Rânduri din technicalSpecs.adiana.informationsSuplimentare (Greutate, Brand, EAN, …). */
function extractAdianaInformativeEntries(specs: Record<string, unknown>): SpecEntry[] {
  const ad = asRecord(specs.adiana);
  const inf = asRecord(ad?.informationsSuplimentare);
  if (!inf) return [];
  const entries: SpecEntry[] = [];
  for (const [k, v] of Object.entries(inf)) {
    if (!isDisplayable(v)) continue;
    entries.push([`Informații suplimentare - ${k}`, v]);
  }
  return entries;
}

/** Evită dublarea: obiectul e listat ca rânduri de mai sus, nu ca JSON compact. */
function stripAdianaInformative(
  specs: Record<string, unknown>,
): Record<string, unknown> {
  const ad = asRecord(specs.adiana);
  if (!ad || !('informationsSuplimentare' in ad)) return specs;
  const { informationsSuplimentare: _inf, ...restAd } = ad;
  void _inf;
  return { ...specs, adiana: restAd };
}

/**
 * Technical metadata from imports (source/sourceUrl/sourceCategories) is useful in admin,
 * but should not be shown to shoppers on PDP.
 */
function stripAdianaMetadata(specs: Record<string, unknown>): Record<string, unknown> {
  if (!('adiana' in specs)) return specs;
  const { adiana: _adiana, ...rest } = specs;
  void _adiana;
  return rest;
}

function extractSpecEntries(specs: Record<string, unknown>): SpecEntry[] {
  const informative = extractAdianaInformativeEntries(specs);
  const icecat = extractIcecatFeatureGroupEntries(specs);
  const odoo = extractOdooDetailEntries(specs);
  const prioritized = [...icecat, ...odoo];
  if (prioritized.length > 0) {
    return [...informative, ...prioritized];
  }
  const shopperSpecs = stripAdianaMetadata(stripAdianaInformative(specs));
  if (informative.length > 0) {
    return [...informative, ...flattenEntries(shopperSpecs)];
  }
  return flattenEntries(shopperSpecs);
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
