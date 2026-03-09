'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { api } from '@/lib/api-client';

const schema = z.object({
  name: z.string().min(1, 'Introdu numele'),
  email: z.string().email('Introdu o adresă de email validă'),
  question: z.string().min(1, 'Introdu întrebarea'),
});

type FormData = z.infer<typeof schema>;

export function FaqForm() {
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', question: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      await api.post('/faq/submit', data);
      setSuccess(true);
      reset();
    } catch {
      setSubmitError('A apărut o eroare. Te rugăm să încerci din nou.');
    }
  };

  if (success) {
    return (
      <div
        className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20"
        role="status"
      >
        <p className="font-medium text-green-800 dark:text-green-200">
          Întrebarea a fost trimisă. Te vom contacta în curând.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          {submitError}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="faq-name">Nume</Label>
          <Input
            id="faq-name"
            {...register('name')}
            placeholder="Numele tău"
            autoComplete="name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="faq-email">Email</Label>
          <Input
            id="faq-email"
            type="email"
            {...register('email')}
            placeholder="email@exemplu.ro"
            autoComplete="email"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="faq-question">Întrebarea ta</Label>
        <textarea
          id="faq-question"
          {...register('question')}
          placeholder="Scrie întrebarea ta..."
          rows={5}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400 ${
            errors.question
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:focus:border-primary-400 dark:focus:ring-primary-400'
          }`}
        />
        {errors.question && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.question.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Se trimite...' : 'Trimite întrebarea'}
      </Button>
    </form>
  );
}
