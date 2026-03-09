'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { api, ApiError } from '@/lib/api-client';

const CONSENT_TEXT_RO =
  'Sunt de acord să primesc comunicări de marketing pe email și accept politica de confidențialitate.';

/**
 * Newsletter signup with GDPR consent and double opt-in.
 * POST to /newsletter/subscribe; user receives confirmation email.
 */
export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (!consent) {
      setErrorMessage('Trebuie să accepți primirea comunicărilor de marketing.');
      return;
    }
    setErrorMessage(null);
    setStatus('loading');
    try {
      await api.post<{ success: boolean; message: string }>('/newsletter/subscribe', {
        email: email.trim().toLowerCase(),
        source: 'HOMEPAGE',
        consent: true,
        consentText: CONSENT_TEXT_RO,
      });
      setStatus('success');
      setEmail('');
      setConsent(false);
    } catch (err) {
      setStatus('error');
      const body = err instanceof ApiError ? err.body : undefined;
      const msg = body && typeof body === 'object' && 'message' in body
        ? (Array.isArray((body as { message: unknown }).message)
            ? (body as { message: string[] }).message[0]
            : (body as { message: string }).message)
        : undefined;
      setErrorMessage(typeof msg === 'string' ? msg : 'A apărut o eroare. Încearcă din nou.');
    }
  }

  return (
    <section
      className="container-wide py-12"
      aria-labelledby="home-newsletter-heading"
    >
      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-primary-50 px-6 py-10 text-center dark:border-primary-900/50 dark:bg-primary-950/30">
        <h2 id="home-newsletter-heading" className="heading-section m-0 mb-2">
          Ține-te la curent
        </h2>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          Abonează-te la newsletter și primești 10% reducere la prima comandă.
        </p>
        {status === 'success' ? (
          <p className="text-primary-700 dark:text-primary-300">
            Mulțumim pentru abonare! Verifică emailul pentru confirmare.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex-1">
              <Label htmlFor="newsletter-email" className="sr-only">
                Adresă email
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="email@exemplu.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full"
                required
              />
            </div>
            <div className="flex items-start gap-2 text-left">
              <input
                id="newsletter-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                disabled={status === 'loading'}
                className="mt-1 h-4 w-4 rounded border-neutral-300"
                required
              />
              <Label htmlFor="newsletter-consent" className="text-sm text-neutral-600 dark:text-neutral-400">
                {CONSENT_TEXT_RO}
              </Label>
            </div>
            <Button type="submit" disabled={status === 'loading'} className="shrink-0">
              {status === 'loading' ? 'Se trimite...' : 'Abonează-te'}
            </Button>
          </form>
        )}
        {(status === 'error' || errorMessage) && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errorMessage ?? 'A apărut o eroare. Încearcă din nou.'}
          </p>
        )}
      </div>
    </section>
  );
}
