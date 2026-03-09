'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { ProductQuestionItem } from '@/types/api';
import { Button } from '@/components/ui';
import { productsApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

interface ProductQASectionProps {
  productId: string;
  initialQuestions: ProductQuestionItem[];
  className?: string;
}

function formatUser(user: { firstName: string | null; lastName: string | null } | null) {
  if (!user) return 'Anonim';
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Utilizator';
}

export function ProductQASection({
  productId,
  initialQuestions,
  className,
}: ProductQASectionProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [expandedId, setExpandedId] = useState<string | null>(
    initialQuestions[0]?.id ?? null
  );
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = !!token;

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !questionText.trim()) return;
    setSubmitting(true);
    try {
      await productsApi.createQuestion(productId, questionText.trim());
      setSubmitted(true);
      setShowForm(false);
      setQuestionText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={className}>
      <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
        <HelpCircle className="h-5 w-5" />
        Întrebări și răspunsuri
      </h2>

      {isLoggedIn && !submitted && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? 'Anulează' : 'Pune o întrebare'}
          </Button>
          {showForm && (
            <form onSubmit={handleSubmitQuestion} className="mt-3">
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Scrie întrebarea ta..."
                maxLength={1000}
                rows={3}
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800"
              />
              <Button type="submit" className="mt-2" disabled={submitting}>
                {submitting ? 'Se trimite...' : 'Trimite întrebarea'}
              </Button>
            </form>
          )}
        </div>
      )}
      {!isLoggedIn && (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          <a href="/cont" className="text-primary-600 hover:underline dark:text-primary-400">
            Autentifică-te
          </a>{' '}
          pentru a pune întrebări.
        </p>
      )}
      {submitted && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">
          Mulțumim! Întrebarea ta va fi verificată și va primi răspuns în curând.
        </p>
      )}

      <div className="mt-6 space-y-2">
        {questions.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className="rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
              >
                <span className="font-medium text-neutral-900 dark:text-white">
                  {q.question}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                )}
              </button>
              {isExpanded && (
                <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatUser(q.user)} ·{' '}
                    {new Date(q.createdAt).toLocaleDateString('ro-RO')}
                  </p>
                  {q.answers.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {q.answers.map((a) => (
                        <li key={a.id} className="pl-2 border-l-2 border-primary-200 dark:border-primary-800">
                          <p className="text-sm text-neutral-700 dark:text-neutral-300">
                            {a.answer}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {formatUser(a.user)} ·{' '}
                            {new Date(a.createdAt).toLocaleDateString('ro-RO')}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      Încă nu există răspuns. Verifică din nou mai târziu.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {questions.length === 0 && (
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
          Nici o întrebare încă. Fii primul care pune o întrebare.
        </p>
      )}
    </section>
  );
}
