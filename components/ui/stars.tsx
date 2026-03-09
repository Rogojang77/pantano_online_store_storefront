'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarsProps {
  rating: number;
  count?: number;
  /** 'sm' for product cards, default for detail/reviews */
  size?: 'sm' | 'default';
  className?: string;
}

export function Stars({ rating, count = 5, size = 'default', className }: StarsProps) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`${rating} din ${count} stele`}
    >
      {Array.from({ length: count }, (_, i) => (
        <Star
          key={i}
          className={cn(
            iconClass,
            i < full
              ? 'fill-amber-400 text-amber-400'
              : i === full && half
                ? 'fill-amber-400/70 text-amber-400'
                : 'text-neutral-200 dark:text-neutral-600'
          )}
        />
      ))}
    </div>
  );
}
