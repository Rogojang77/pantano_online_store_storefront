'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { authApi, wishlistApi } from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore, useWishlistStore } from '@/store';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';

const loginSchema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(1, 'Introdu parola'),
});

type LoginForm = z.infer<typeof loginSchema>;

function AccountHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
    if (user) {
      const redirect = searchParams.get('redirect') || '/cont/dashboard';
      router.replace(redirect);
    }
  }, [user, router, searchParams]);

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      const res = await authApi.login(data.email, data.password);
      setAuth({
        id: res.user?.id ?? '',
        email: res.user?.email ?? data.email,
        firstName: res.user?.firstName ?? null,
        lastName: res.user?.lastName ?? null,
        phone: res.user?.phone ?? null,
        accountType: res.user?.accountType,
        companyName: res.user?.companyName ?? null,
        companyVatId: res.user?.companyVatId ?? null,
        companyTradeRegister: res.user?.companyTradeRegister ?? null,
        isVatPayer: res.user?.isVatPayer ?? null,
      });
      const localItems = useWishlistStore.getState().items;
      const variantIds = localItems.filter((i) => i.variantId).map((i) => i.variantId as string);
      if (variantIds.length > 0) {
        wishlistApi.sync(variantIds).catch(() => {
          toast.error('Nu am putut sincroniza lista de dorințe. Poți reîncerca din cont.');
        });
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
    authApi.logout().catch(() => {});
    logout();
    router.push('/');
    router.refresh();
  };

  if (user) {
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
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              aria-label={showPassword ? 'Ascunde parola' : 'Arată parola'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
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
