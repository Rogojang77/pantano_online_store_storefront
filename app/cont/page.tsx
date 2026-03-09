'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi, wishlistApi } from '@/lib/api';
import { useAuthStore, useWishlistStore } from '@/store';
import { getAuthToken } from '@/lib/api-client';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { siteConfig } from '@/config/site';

const loginSchema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(1, 'Introdu parola'),
});

type LoginForm = z.infer<typeof loginSchema>;

function AccountHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const [error, setError] = useState<string | null>(null);
  const resetSuccess = searchParams.get('reset') === 'success';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (token && user) {
      const redirect = searchParams.get('redirect') || '/cont/dashboard';
      router.replace(redirect);
      return;
    }
    const storedToken = typeof window !== 'undefined' ? getAuthToken() : null;
    if (storedToken && !token) {
      authApi.profile()
        .then((profile) => {
          setAuth(storedToken, {
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName ?? null,
            lastName: profile.lastName ?? null,
          });
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once from localStorage
  }, [token, user, router, searchParams]);

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      const res = await authApi.login(data.email, data.password);
      const accessToken = res.accessToken ?? res.access_token ?? '';
      setAuth(accessToken, res.user ?? { id: '', email: data.email, firstName: null, lastName: null });
      if (typeof window !== 'undefined' && accessToken) {
        localStorage.setItem(siteConfig.authTokenKey, accessToken);
        const localItems = useWishlistStore.getState().items;
        const variantIds = localItems.filter((i) => i.variantId).map((i) => i.variantId as string);
        if (variantIds.length > 0) {
          wishlistApi.sync(variantIds).catch(() => {});
        }
      }
      const redirect = searchParams.get('redirect') || '/cont/dashboard';
      router.push(redirect);
      router.refresh();
    } catch (e: unknown) {
      const message = e && typeof e === 'object' && 'status' in e
        ? 'Email sau parolă incorectă.'
        : 'A apărut o eroare. Încearcă din nou.';
      setError(message);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    router.refresh();
  };

  if (token && user) {
    return (
      <div className="container-narrow mx-auto max-w-md py-16">
        <h1 className="heading-page mb-8 text-center">Contul meu</h1>
        <p className="mb-6 text-center text-neutral-600 dark:text-neutral-400">
          Bun venit, {user.firstName || user.email}!
        </p>
        <nav className="flex flex-col gap-2">
          <Link
            href="/cont/setari"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-center font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          >
            Setări cont
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-center font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Deconectare
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className="container-narrow mx-auto max-w-md py-16">
      <h1 className="heading-page mb-8 text-center">Autentificare</h1>
      {resetSuccess && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
          Parola a fost resetată. Poți să te autentifici acum.
        </div>
      )}
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
      <p className="mt-4 text-center text-sm text-neutral-500">
        <Link href="/cont/parola-uitata" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Ai uitat parola?
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-neutral-500">
        Nu ai cont?{' '}
        <Link href="/cont/inregistrare" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Înregistrare
        </Link>
      </p>
    </div>
  );
}

export default function AccountHubPage() {
  return (
    <Suspense fallback={<div className="container-narrow mx-auto max-w-md py-16 text-center">Se încarcă...</div>}>
      <AccountHubContent />
    </Suspense>
  );
}
