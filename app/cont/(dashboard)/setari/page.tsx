'use client';

import { useState, useEffect } from 'react';
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

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Introdu parola curentă'),
    newPassword: z.string().min(8, 'Parola trebuie să aibă minim 8 caractere'),
    confirmPassword: z.string().min(1, 'Confirmă parola'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Parolele nu coincid',
    path: ['confirmPassword'],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function AccountSettingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', phone: '' },
  });

  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (typeof window === 'undefined' || user) return;
    const redirect = encodeURIComponent('/cont/setari');
    router.replace(`/cont?redirect=${redirect}`);
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    profileForm.reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
    });
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileForm) => {
    setProfileError(null);
    setProfileSuccess(false);
    if (!user) return;
    try {
      const updated = await authApi.updateProfile({
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
      });
      setAuth({
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName ?? null,
        lastName: updated.lastName ?? null,
        phone: updated.phone ?? null,
        accountType: updated.accountType,
        companyName: updated.companyName ?? null,
        companyVatId: updated.companyVatId ?? null,
        companyTradeRegister: updated.companyTradeRegister ?? null,
      });
      setProfileSuccess(true);
    } catch {
      setProfileError('Nu s-a putut actualiza profilul. Încearcă din nou.');
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordForm) => {
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      setPasswordSuccess(true);
      passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setPasswordError('Parola curentă este incorectă sau a apărut o eroare.');
    }
  };

  if (typeof window !== 'undefined' && !user) {
    return null;
  }

  return (
    <div className="max-w-lg">
      <h1 className="heading-page mb-8">Setări cont</h1>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Date personale</h2>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          {profileError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
              Profil actualizat.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prenume</Label>
              <Input id="firstName" className="mt-1" {...profileForm.register('firstName')} />
            </div>
            <div>
              <Label htmlFor="lastName">Nume</Label>
              <Input id="lastName" className="mt-1" {...profileForm.register('lastName')} />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" type="tel" className="mt-1" {...profileForm.register('phone')} />
          </div>
          <p className="text-sm text-neutral-500">Email: {user?.email ?? '—'}</p>
          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
            Salvează modificările
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Schimbă parola</h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          {passwordError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
              Parola a fost schimbată.
            </div>
          )}
          <div>
            <Label htmlFor="currentPassword">Parola curentă</Label>
            <div className="relative mt-1">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="pr-10"
                {...passwordForm.register('currentPassword')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                aria-label={showCurrentPassword ? 'Ascunde parola' : 'Arată parola'}
              >
                {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="newPassword">Parolă nouă</Label>
            <div className="relative mt-1">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="pr-10"
                {...passwordForm.register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                aria-label={showNewPassword ? 'Ascunde parola' : 'Arată parola'}
              >
                {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmă parola nouă</Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="pr-10"
                {...passwordForm.register('confirmPassword')}
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
            {passwordForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            Schimbă parola
          </Button>
        </form>
      </div>

      <p className="mt-10 text-sm text-neutral-500">
        <Link href="/cont/dashboard" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
          Înapoi la dashboard
        </Link>
      </p>
    </div>
  );
}
