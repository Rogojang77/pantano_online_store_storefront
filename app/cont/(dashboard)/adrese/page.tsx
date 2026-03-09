'use client';

import { useState, useEffect } from 'react';
import { addressesApi } from '@/lib/api';
import type { Address } from '@/types/api';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';

const LABELS: Record<string, string> = {
  Home: 'Acasă',
  Work: 'Serviciu',
  Site: 'Șantier',
  Warehouse: 'Depozit',
  Other: 'Altele',
};
const TYPE_LABELS: Record<string, string> = {
  SHIPPING: 'Livrare',
  BILLING: 'Facturare',
};

export default function AddressBookPage() {
  const [list, setList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    type: 'SHIPPING' as 'SHIPPING' | 'BILLING',
    label: 'Other',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postalCode: '',
    country: 'RO',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    addressesApi.list()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      type: 'SHIPPING',
      label: 'Other',
      addressLine1: '',
      addressLine2: '',
      city: '',
      county: '',
      postalCode: '',
      country: 'RO',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    setEditing(null);
    setCreating(false);
    setError(null);
  };

  const openEdit = (a: Address) => {
    setEditing(a);
    setForm({
      type: a.type,
      label: a.label,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2 ?? '',
      city: a.city,
      county: a.county ?? '',
      postalCode: a.postalCode,
      country: a.country,
      isDefaultShipping: a.isDefaultShipping,
      isDefaultBilling: a.isDefaultBilling,
    });
    setCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editing) {
        await addressesApi.update(editing.id, {
          type: form.type,
          label: form.label as 'Home' | 'Work' | 'Site' | 'Warehouse' | 'Other',
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 || undefined,
          city: form.city,
          county: form.county || undefined,
          postalCode: form.postalCode,
          country: form.country,
          isDefaultShipping: form.isDefaultShipping,
          isDefaultBilling: form.isDefaultBilling,
        });
      } else {
        await addressesApi.create({
          type: form.type,
          label: form.label as 'Home' | 'Work' | 'Site' | 'Warehouse' | 'Other',
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 || undefined,
          city: form.city,
          county: form.county || undefined,
          postalCode: form.postalCode,
          country: form.country,
          isDefaultShipping: form.isDefaultShipping,
          isDefaultBilling: form.isDefaultBilling,
        });
      }
      load();
      resetForm();
    } catch {
      setError('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const setDefaultShipping = async (id: string) => {
    try {
      await addressesApi.setDefaultShipping(id);
      load();
    } catch {}
  };

  const setDefaultBilling = async (id: string) => {
    try {
      await addressesApi.setDefaultBilling(id);
      load();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ștergi această adresă?')) return;
    try {
      await addressesApi.delete(id);
      load();
      resetForm();
    } catch {}
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-page">Adrese</h1>
        {!creating && !editing && (
          <Button size="sm" onClick={() => { setCreating(true); setEditing(null); setForm({ type: 'SHIPPING', label: 'Other', addressLine1: '', addressLine2: '', city: '', county: '', postalCode: '', country: 'RO', isDefaultShipping: false, isDefaultBilling: false }); }}>
            Adaugă adresă
          </Button>
        )}
      </div>

      {(creating || editing) && (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="font-semibold">{editing ? 'Editează adresa' : 'Adresă nouă'}</h2>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div>
            <Label>Tip</Label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'SHIPPING' | 'BILLING' }))}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            >
              <option value="SHIPPING">Livrare</option>
              <option value="BILLING">Facturare</option>
            </select>
          </div>
          <div>
            <Label>Etichetă</Label>
            <select
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            >
              {Object.entries(LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Adresă (linia 1)</Label>
            <Input className="mt-1" value={form.addressLine1} onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))} required />
          </div>
          <div>
            <Label>Adresă (linia 2)</Label>
            <Input className="mt-1" value={form.addressLine2} onChange={(e) => setForm((f) => ({ ...f, addressLine2: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Oraș</Label>
              <Input className="mt-1" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
            </div>
            <div>
              <Label>Județ</Label>
              <Input className="mt-1" value={form.county} onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cod poștal</Label>
              <Input className="mt-1" value={form.postalCode} onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} required />
            </div>
            <div>
              <Label>Țară</Label>
              <Input className="mt-1" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isDefaultShipping} onChange={(e) => setForm((f) => ({ ...f, isDefaultShipping: e.target.checked }))} />
              <span className="text-sm">Implicit livrare</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isDefaultBilling} onChange={(e) => setForm((f) => ({ ...f, isDefaultBilling: e.target.checked }))} />
              <span className="text-sm">Implicit facturare</span>
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Se salvează...' : 'Salvează'}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Anulează</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-neutral-500">Se încarcă...</p>
      ) : list.length === 0 && !creating ? (
        <p className="text-neutral-600 dark:text-neutral-400">Nu ai adrese salvate. Adaugă una pentru livrare sau facturare.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((addr) => (
            <li key={addr.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div>
                <p className="font-medium">{LABELS[addr.label] ?? addr.label} · {TYPE_LABELS[addr.type]}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}<br />
                  {addr.postalCode} {addr.city}{addr.county ? `, ${addr.county}` : ''} {addr.country}
                </p>
                {(addr.isDefaultShipping || addr.isDefaultBilling) && (
                  <p className="mt-1 text-xs text-neutral-500">
                    {addr.isDefaultShipping && 'Implicit livrare'}
                    {addr.isDefaultShipping && addr.isDefaultBilling && ' · '}
                    {addr.isDefaultBilling && 'Implicit facturare'}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {!addr.isDefaultShipping && addr.type === 'SHIPPING' && (
                  <Button variant="outline" size="sm" onClick={() => setDefaultShipping(addr.id)}>Implicit livrare</Button>
                )}
                {!addr.isDefaultBilling && addr.type === 'BILLING' && (
                  <Button variant="outline" size="sm" onClick={() => setDefaultBilling(addr.id)}>Implicit facturare</Button>
                )}
                <Button variant="outline" size="sm" onClick={() => openEdit(addr)}>Editează</Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(addr.id)} className="text-red-600 dark:text-red-400">Șterge</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
