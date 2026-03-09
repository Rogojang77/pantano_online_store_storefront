'use client';

import { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import type { ProductReview, ProductReviewsResponse } from '@/types/api';
import { Button, Stars } from '@/components/ui';
import { productsApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  initialData: ProductReviewsResponse;
  className?: string;
}

export function ProductReviewsSection({
  productId,
  productName,
  initialData,
  className,
}: ProductReviewsSectionProps) {
  const [reviewsData, setReviewsData] = useState(initialData);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const token = useAuthStore((s) => s.token);

  const { data: reviews, summary } = reviewsData;
  const isLoggedIn = !!token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await productsApi.createReview(productId, {
        rating: formRating,
        title: formTitle.trim() || undefined,
        body: formBody.trim() || undefined,
      });
      setSubmitted(true);
      setShowForm(false);
      setFormTitle('');
      setFormBody('');
    } catch {
      // show error in UI if needed
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={className}>
      <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Recenzii
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Stars rating={summary.averageRating} />
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {summary.averageRating.toFixed(1)} · {summary.totalCount}{' '}
          {summary.totalCount === 1 ? 'recenzie' : 'recenzii'}
        </span>
        {isLoggedIn && !submitted && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? 'Anulează' : 'Scrie o recenzie'}
          </Button>
        )}
        {!isLoggedIn && (
          <Button variant="outline" size="sm" asChild>
            <a href="/cont">Autentifică-te pentru a scrie o recenzie</a>
          </Button>
        )}
      </div>

      {submitted && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">
          Mulțumim! Recenzia ta va fi verificată în curând.
        </p>
      )}

      {showForm && isLoggedIn && (
        <form onSubmit={handleSubmit} className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Rating
          </label>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFormRating(r)}
                className={cn(
                  'rounded p-1',
                  formRating >= r ? 'text-amber-500' : 'text-neutral-300 dark:text-neutral-600'
                )}
              >
                <Star className={cn('h-6 w-6', formRating >= r && 'fill-current')} />
              </button>
            ))}
          </div>
          <label className="mt-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Titlu (opțional)
          </label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            maxLength={200}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
          />
          <label className="mt-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Comentariu (opțional)
          </label>
          <textarea
            value={formBody}
            onChange={(e) => setFormBody(e.target.value)}
            maxLength={2000}
            rows={3}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
          />
          <Button type="submit" className="mt-3" disabled={submitting}>
            {submitting ? 'Se trimite...' : 'Trimite recenzia'}
          </Button>
        </form>
      )}

      <ul className="mt-6 space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-700"
          >
            <div className="flex items-center gap-2">
              <Stars rating={review.rating} />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {review.user
                  ? [review.user.firstName, review.user.lastName].filter(Boolean).join(' ') || 'Utilizator'
                  : 'Anonim'}
                {' · '}
                {new Date(review.createdAt).toLocaleDateString('ro-RO')}
              </span>
            </div>
            {review.title && (
              <p className="mt-1 font-medium text-neutral-900 dark:text-white">
                {review.title}
              </p>
            )}
            {review.body && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {review.body}
              </p>
            )}
          </li>
        ))}
      </ul>

      {reviews.length === 0 && !showForm && (
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
          Nici o recenzie încă. Fii primul care lasă o recenzie.
        </p>
      )}
    </section>
  );
}
