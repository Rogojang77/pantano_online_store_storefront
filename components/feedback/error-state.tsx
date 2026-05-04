'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ApiError } from '@/lib/api-client';

type ErrorLike = unknown;

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: ErrorLike;
  retryLabel?: string;
  onRetry?: () => void;
  action?: ReactNode;
}

function extractMessage(error: ErrorLike): string | undefined {
  if (error instanceof ApiError) {
    const body = error.body as { message?: string | string[] } | undefined;
    if (typeof body?.message === 'string') return body.message;
    if (Array.isArray(body?.message)) return body.message.join(', ');
    return error.message;
  }
  if (error instanceof Error && error.message.trim()) return error.message;
  return undefined;
}

function extractRequestId(error: ErrorLike): string | undefined {
  if (error instanceof ApiError && error.requestId) return error.requestId;
  if (
    error &&
    typeof error === 'object' &&
    'body' in error &&
    (error as { body?: { requestId?: string } }).body?.requestId
  ) {
    return (error as { body?: { requestId?: string } }).body?.requestId;
  }
  return undefined;
}

export function ErrorState({
  title = 'A apărut o problemă',
  message,
  error,
  retryLabel = 'Reîncearcă',
  onRetry,
  action,
}: ErrorStateProps) {
  const resolvedMessage =
    message ??
    extractMessage(error) ??
    'Nu am putut încărca datele. Verifică conexiunea și încearcă din nou.';
  const requestId = extractRequestId(error);

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center dark:border-red-900/40 dark:bg-red-950/20">
      <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">{title}</h2>
      <p className="mt-2 text-sm text-red-700/90 dark:text-red-300/90">{resolvedMessage}</p>
      {requestId && (
        <p className="mt-2 text-xs text-red-600/80 dark:text-red-400/80">
          Cod eroare: <code>{requestId}</code>
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {onRetry ? (
          <Button type="button" onClick={onRetry} variant="outline">
            {retryLabel}
          </Button>
        ) : null}
        {action ?? (
          <Button asChild variant="outline">
            <Link href="/">Acasă</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
