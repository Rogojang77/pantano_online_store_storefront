'use client';

import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const [prefs, setPrefs] = useState({
    newsletterConsent: false,
    notifyOrderStatus: true,
    language: 'ro',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    authApi.profile()
      .then((profile) => {
        setPrefs({
          newsletterConsent: profile.newsletterConsent ?? false,
          notifyOrderStatus: profile.notifyOrderStatus ?? true,
          language: profile.language ?? 'ro',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await authApi.updateProfile({
        newsletterConsent: prefs.newsletterConsent,
        notifyOrderStatus: prefs.notifyOrderStatus,
        language: prefs.language,
      });
      setSuccess(true);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-neutral-500">Se încarcă...</p>;

  return (
    <div className="space-y-6">
      <h1 className="heading-page">Notificări și preferințe</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div>
            <Label className="font-medium">Buletin de știri</Label>
            <p className="text-sm text-neutral-500">Primești oferte și noutăți pe email.</p>
          </div>
          <input
            type="checkbox"
            checked={prefs.newsletterConsent}
            onChange={(e) => setPrefs((p) => ({ ...p, newsletterConsent: e.target.checked }))}
            className="h-4 w-4 rounded border-neutral-300"
          />
        </div>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div>
            <Label className="font-medium">Notificări status comandă</Label>
            <p className="text-sm text-neutral-500">Alertă email când comanda își schimbă statusul.</p>
          </div>
          <input
            type="checkbox"
            checked={prefs.notifyOrderStatus}
            onChange={(e) => setPrefs((p) => ({ ...p, notifyOrderStatus: e.target.checked }))}
            className="h-4 w-4 rounded border-neutral-300"
          />
        </div>
        <div>
          <Label htmlFor="language">Limbă</Label>
          <select
            id="language"
            value={prefs.language}
            onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
          >
            <option value="ro">Română</option>
            <option value="en">English</option>
          </select>
        </div>
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">Preferințele au fost salvate.</p>
        )}
        <Button type="submit" disabled={saving}>{saving ? 'Se salvează...' : 'Salvează'}</Button>
      </form>
    </div>
  );
}
