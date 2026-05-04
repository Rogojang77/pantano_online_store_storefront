'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Route error boundary:', error);
    }
  }, [error]);

  return (
    <div className="container-wide flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="heading-page mb-2">A apărut o problemă</h1>
      <p className="mb-6 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
        Nu am putut afișa această pagină. Verifică conexiunea la internet și încearcă din nou.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={reset} size="lg" className="rounded-xl">
          Reîncearcă
        </Button>
        <Button type="button" asChild variant="outline" size="lg" className="rounded-xl">
          <Link href="/">Acasă</Link>
        </Button>
      </div>
    </div>
  );
}
