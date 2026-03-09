'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuthStore, useCheckoutStore } from '@/store';
import { getAuthToken } from '@/lib/api-client';
import { siteConfig } from '@/config/site';
import { Button, Input, Label } from '@/components/ui';

const loginSchema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(1, 'Introdu parola'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function CheckoutLoginPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setGuestChoice = useCheckoutStore((s) => s.setGuestChoice);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      const res = await authApi.login(data.email, data.password);
      const accessToken = res.accessToken ?? res.access_token ?? '';
      setAuth(accessToken, res.user ?? { id: '', email: data.email, firstName: null, lastName: null });
      if (typeof window !== 'undefined' && accessToken) {
        localStorage.setItem(siteConfig.authTokenKey, accessToken);
      }
      router.push('/checkout/address');
      router.refresh();
    } catch {
      setError('Email sau parolă incorectă.');
    }
  };

  const handleGuestCheckout = () => {
    setGuestChoice('guest');
    router.push('/checkout/address');
  };

  if (token && typeof getAuthToken() === 'string') {
    router.replace('/checkout/address');
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="heading-page mb-8 text-center">Autentificare sau comandă fără cont</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">Ai deja cont</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" className="mt-1" {...register('email')} />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-1"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Se încarcă...' : 'Autentificare'}
            </Button>
          </form>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">Fără cont</h2>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            Poți finaliza comanda fără să creezi un cont. Vei introduce datele la pasul următor.
          </p>
          <Button type="button" variant="outline" className="w-full" onClick={handleGuestCheckout}>
            Continuă ca oaspete
          </Button>
          <p className="mt-4 text-center text-sm text-neutral-500">
            Vrei să ai cont?{' '}
            <Link
              href={`/cont/inregistrare?redirect=${encodeURIComponent('/checkout/address')}`}
              className="font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              Creează cont
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
