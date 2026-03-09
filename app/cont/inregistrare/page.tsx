'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { siteConfig } from '@/config/site';

const registerSchema = z
  .object({
    email: z.string().email('Email invalid'),
    password: z.string().min(8, 'Parola trebuie să aibă minim 8 caractere'),
    confirmPassword: z.string().min(1, 'Confirmă parola'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parolele nu coincid',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      const res = await authApi.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
      });
      const token = res.accessToken ?? res.access_token ?? '';
      setAuth(token, res.user ?? { id: '', email: data.email, firstName: null, lastName: null });
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem(siteConfig.authTokenKey, token);
      }
      router.push('/cont/setari');
      router.refresh();
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'body' in e && e.body && typeof e.body === 'object' && 'message' in e.body
        ? Array.isArray((e.body as { message: unknown }).message)
          ? (e.body as { message: string[] }).message.join(', ')
          : String((e.body as { message: string }).message)
        : 'Acest email este deja folosit sau a apărut o eroare. Încearcă din nou.';
      setError(msg);
    }
  };

  return (
    <div className="container-narrow mx-auto max-w-md py-16">
      <h1 className="heading-page mb-8 text-center">Înregistrare cont</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}
        <div>
          <Label htmlFor="email">Email *</Label>
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
          <Label htmlFor="password">Parolă *</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-1"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Prenume</Label>
            <Input id="firstName" className="mt-1" {...register('firstName')} />
          </div>
          <div>
            <Label htmlFor="lastName">Nume</Label>
            <Input id="lastName" className="mt-1" {...register('lastName')} />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" type="tel" className="mt-1" {...register('phone')} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Se încarcă...' : 'Creează cont'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500">
        Ai deja cont?{' '}
        <Link href="/cont" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Autentificare
        </Link>
      </p>
    </div>
  );
}
