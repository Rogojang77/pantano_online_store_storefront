'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';

const registerSchema = z
  .object({
    accountType: z.enum(['INDIVIDUAL', 'COMPANY']),
    email: z.string().email('Email invalid'),
    password: z.string().min(8, 'Parola trebuie să aibă minim 8 caractere'),
    confirmPassword: z.string().min(1, 'Confirmă parola'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    companyVatId: z.string().optional(),
    companyTradeRegister: z.string().optional(),
    billingAddressLine1: z.string().optional(),
    billingAddressLine2: z.string().optional(),
    billingCity: z.string().optional(),
    billingCounty: z.string().optional(),
    billingPostalCode: z.string().optional(),
    billingCountry: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Parolele nu coincid',
        path: ['confirmPassword'],
      });
    }
    if (data.accountType === 'COMPANY') {
      if (!data.companyName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Introdu denumirea firmei',
          path: ['companyName'],
        });
      }
      if (!data.companyVatId?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Introdu CUI/CIF',
          path: ['companyVatId'],
        });
      }
      if (!data.billingAddressLine1?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Introdu adresa de facturare',
          path: ['billingAddressLine1'],
        });
      }
      if (!data.billingCity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Introdu orașul',
          path: ['billingCity'],
        });
      }
      if (!data.billingPostalCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Introdu codul poștal',
          path: ['billingPostalCode'],
        });
      }
    }
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: 'INDIVIDUAL',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      companyName: '',
      companyVatId: '',
      companyTradeRegister: '',
      billingAddressLine1: '',
      billingAddressLine2: '',
      billingCity: '',
      billingCounty: '',
      billingPostalCode: '',
      billingCountry: 'RO',
    },
  });
  const accountType = watch('accountType');

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      const res = await authApi.register({
        accountType: data.accountType,
        email: data.email,
        password: data.password,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
        companyName: data.accountType === 'COMPANY' ? data.companyName || undefined : undefined,
        companyVatId: data.accountType === 'COMPANY' ? data.companyVatId || undefined : undefined,
        companyTradeRegister: data.accountType === 'COMPANY' ? data.companyTradeRegister || undefined : undefined,
        billingAddressLine1: data.accountType === 'COMPANY' ? data.billingAddressLine1 || undefined : undefined,
        billingAddressLine2: data.accountType === 'COMPANY' ? data.billingAddressLine2 || undefined : undefined,
        billingCity: data.accountType === 'COMPANY' ? data.billingCity || undefined : undefined,
        billingCounty: data.accountType === 'COMPANY' ? data.billingCounty || undefined : undefined,
        billingPostalCode: data.accountType === 'COMPANY' ? data.billingPostalCode || undefined : undefined,
        billingCountry: data.accountType === 'COMPANY' ? data.billingCountry || undefined : undefined,
      });
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
    <div className="container-narrow mx-auto max-w-xl py-16">
      <h1 className="heading-page mb-8 text-center">Înregistrare cont</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}
        <div>
          <Label className="mb-2 block">Tip cont</Label>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" value="INDIVIDUAL" {...register('accountType')} />
              <span>Persoană fizică</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="radio" value="COMPANY" {...register('accountType')} />
              <span>Persoană juridică</span>
            </label>
          </div>
        </div>
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
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
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
        <div>
          <Label htmlFor="confirmPassword">Confirmă parola *</Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              aria-label={showConfirmPassword ? 'Ascunde parola' : 'Arată parola'}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
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
        {accountType === 'COMPANY' && (
          <>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <h2 className="mb-4 text-base font-semibold">Date firmă</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="companyName">Denumire firmă *</Label>
                  <Input id="companyName" className="mt-1" {...register('companyName')} />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="companyVatId">CUI / CIF *</Label>
                  <Input id="companyVatId" className="mt-1" {...register('companyVatId')} />
                  {errors.companyVatId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyVatId.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="companyTradeRegister">Nr. Reg. Comerțului</Label>
                  <Input id="companyTradeRegister" className="mt-1" {...register('companyTradeRegister')} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <h2 className="mb-4 text-base font-semibold">Adresă facturare</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="billingAddressLine1">Stradă, număr *</Label>
                  <Input id="billingAddressLine1" className="mt-1" {...register('billingAddressLine1')} />
                  {errors.billingAddressLine1 && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.billingAddressLine1.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="billingAddressLine2">Detalii adresă (opțional)</Label>
                  <Input id="billingAddressLine2" className="mt-1" {...register('billingAddressLine2')} />
                </div>
                <div>
                  <Label htmlFor="billingCity">Oraș *</Label>
                  <Input id="billingCity" className="mt-1" {...register('billingCity')} />
                  {errors.billingCity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.billingCity.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billingCounty">Județ</Label>
                  <Input id="billingCounty" className="mt-1" {...register('billingCounty')} />
                </div>
                <div>
                  <Label htmlFor="billingPostalCode">Cod poștal *</Label>
                  <Input id="billingPostalCode" className="mt-1" {...register('billingPostalCode')} />
                  {errors.billingPostalCode && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.billingPostalCode.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billingCountry">Țară</Label>
                  <Input id="billingCountry" className="mt-1" {...register('billingCountry')} />
                </div>
              </div>
            </div>
          </>
        )}
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
