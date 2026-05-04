'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/feedback/error-state';

export default function SearchRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Search route error:', error);
    }
  }, [error]);

  return (
    <div className="container-wide py-8">
      <ErrorState
        title="Nu am putut deschide pagina de căutare"
        error={error}
        onRetry={reset}
      />
    </div>
  );
}
