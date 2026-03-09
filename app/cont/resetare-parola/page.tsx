'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';

const schema = z
  .object({
    newPassword: z.string().min(8, 'Parola trebuie să aibă minim 8 caractere'),
    confirmPassword: z.string().min(1, 'Confirmă parola'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Parolele nu coincid',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [invalidToken, setInvalidToken] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (token === null && typeof window !== 'undefined') {
      setInvalidToken(true);
    }
  }, [token]);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setInvalidToken(true);
      return;
    }
    setError(null);
    try {
      await authApi.resetPassword(token, data.newPassword);
      router.push('/cont?reset=success');
      router.refresh();
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'status' in e && e.status === 400
        ? 'Linkul a expirat sau este invalid. Solicită un link nou.'
        : 'A apărut o eroare. Încearcă din nou.';
      setError(msg);
    }
  };

  if (invalidToken || !token) {
    return (
      <div className="container-narrow mx-auto max-w-md py-16">
        <h1 className="heading-page mb-8 text-center">Resetare parolă</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Link invalid sau lipsă. Solicită un nou link de resetare a parolei.
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/cont/parola-uitata" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Parolă uitată
          </Link>
          {' · '}
          <Link href="/cont" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Autentificare
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container-narrow mx-auto max-w-md py-16">
      <h1 className="heading-page mb-8 text-center">Setare parolă nouă</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}
        <div>
          <Label htmlFor="newPassword">Parolă nouă *</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="mt-1"
            {...register('newPassword')}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmă parola *</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="mt-1"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Se salvează...' : 'Salvează parola'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container-narrow mx-auto max-w-md py-16 text-center">Se încarcă...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
