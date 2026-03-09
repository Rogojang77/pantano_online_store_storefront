import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx; avoids conflicts (e.g. p-2 vs p-4).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
