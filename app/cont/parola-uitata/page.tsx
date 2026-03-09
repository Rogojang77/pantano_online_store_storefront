'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';

const schema = z.object({
  email: z.string().email('Email invalid'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await authApi.forgotPassword(data.email);
      setSuccess(true);
    } catch {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="container-narrow mx-auto max-w-md py-16">
        <h1 className="heading-page mb-8 text-center">Parolă uitată</h1>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
          Dacă există un cont cu acest email, vei primi un link pentru resetarea parolei. Verifică și folderul Spam.
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/cont" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Înapoi la autentificare
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container-narrow mx-auto max-w-md py-16">
      <h1 className="heading-page mb-8 text-center">Parolă uitată</h1>
      <p className="mb-6 text-center text-sm text-neutral-500">
        Introdu adresa de email asociată contului și îți vom trimite un link pentru resetarea parolei.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1"
            {...register('email')}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Se trimite...' : 'Trimite link resetare'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500">
        <Link href="/cont" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Înapoi la autentificare
        </Link>
      </p>
    </div>
  );
}
