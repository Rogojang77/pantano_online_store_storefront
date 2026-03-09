'use client';

import { cn } from '@/lib/utils';

interface TechnicalSpecsTableProps {
  specs: Record<string, unknown>;
  className?: string;
}

export function TechnicalSpecsTable({ specs, className }: TechnicalSpecsTableProps) {
  const entries = Object.entries(specs).filter(
    ([_, value]) => value != null && value !== ''
  );

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
  if (typeof value === 'object' && !Array.isArray(value)) {
    return JSON.stringify(value);
  }
  return String(value);
}
