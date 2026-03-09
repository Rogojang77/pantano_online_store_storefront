'use client';

import { useState, useEffect } from 'react';
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
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', phone: '' },
  });

  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (typeof window === 'undefined' || token) return;
    const redirect = encodeURIComponent('/cont/setari');
    router.replace(`/cont?redirect=${redirect}`);
  }, [token, router]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    authApi.profile()
      .then((profile) => {
        if (cancelled) return;
        setAuth(token, {
          id: profile.id,
          email: profile.email,
          firstName: profile.firstName ?? null,
          lastName: profile.lastName ?? null,
        });
        profileForm.reset({
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          phone: profile.phone ?? '',
        });
      })
      .catch(() => {
        if (!cancelled) router.replace('/cont');
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when token is available
  }, [token]);

  const onProfileSubmit = async (data: ProfileForm) => {
    setProfileError(null);
    setProfileSuccess(false);
    const t = useAuthStore.getState().token;
    if (!t) return;
    try {
      const updated = await authApi.updateProfile({
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
      });
      setAuth(t, {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName ?? null,
        lastName: updated.lastName ?? null,
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

  if (typeof window !== 'undefined' && !token) {
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
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              className="mt-1"
              {...passwordForm.register('currentPassword')}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="newPassword">Parolă nouă</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              className="mt-1"
              {...passwordForm.register('newPassword')}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmă parola nouă</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="mt-1"
              {...passwordForm.register('confirmPassword')}
            />
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
