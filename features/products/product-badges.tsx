'use client';

import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

const BADGE_LABELS: Record<string, string> = {
  bestseller: 'Bestseller',
  new: 'Nou',
  eco: 'Eco',
  professional: 'Calitate profesională',
};

interface ProductBadgesProps {
  badges: string[];
  className?: string;
}

export function ProductBadges({ badges, className }: ProductBadgesProps) {
  if (!badges?.length) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges.map((slug) => (
        <Badge
          key={slug}
          variant={slug === 'eco' ? 'success' : slug === 'new' ? 'warning' : 'default'}
          className="text-xs"
        >
          {BADGE_LABELS[slug] ?? slug}
        </Badge>
      ))}
    </div>
  );
}
