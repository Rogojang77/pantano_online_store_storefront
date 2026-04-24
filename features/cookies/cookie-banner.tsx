'use client';

import { Button } from '@/components/ui/button';

interface CookieBannerProps {
  onAcceptAll: () => void;
  onRejectOptional: () => void;
  onOpenPreferences: () => void;
}

export function CookieBanner({
  onAcceptAll,
  onRejectOptional,
  onOpenPreferences,
}: CookieBannerProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="font-heading text-base font-semibold text-neutral-900 dark:text-white">
            Acest site folosește cookie-uri
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Folosim cookie-uri necesare pentru funcționare și, doar cu acordul tău, cookie-uri
            opționale pentru preferințe, analiză și marketing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onOpenPreferences}>
            Setări cookie-uri
          </Button>
          <Button variant="secondary" size="sm" onClick={onRejectOptional}>
            Respinge opționale
          </Button>
          <Button size="sm" onClick={onAcceptAll}>
            Acceptă toate
          </Button>
        </div>
      </div>
    </div>
  );
}
