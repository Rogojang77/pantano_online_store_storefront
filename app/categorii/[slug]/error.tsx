'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/feedback/error-state';

export default function CategoryRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Category route error:', error);
    }
  }, [error]);

  return (
    <div className="container-wide py-8">
      <ErrorState
        title="Nu am putut încărca această categorie"
        error={error}
        onRetry={reset}
      />
    </div>
  );
}
