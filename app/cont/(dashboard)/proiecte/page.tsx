'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { savedCartsApi } from '@/lib/api';
import type { SavedCart } from '@/types/api';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';

export default function SavedCartsPage() {
  const [list, setList] = useState<SavedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [createName, setCreateName] = useState('');
  const [creating, setCreating] = useState(false);
  const [loadingCart, setLoadingCart] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    savedCartsApi.list()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setError(null);
    setCreating(true);
    try {
      await savedCartsApi.create({ name: createName.trim() });
      setCreateName('');
      load();
    } catch (err) {
      setError('Coșul este gol sau a apărut o eroare. Adaugă produse în coș înainte de a salva proiectul.');
    } finally {
      setCreating(false);
    }
  };

  const handleLoadIntoCart = async (id: string) => {
    setLoadingCart(id);
    try {
      await savedCartsApi.loadIntoCart(id);
      window.location.href = '/cart';
    } catch {
      setLoadingCart(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await savedCartsApi.duplicate(id);
      load();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ștergi acest proiect / listă?')) return;
    try {
      await savedCartsApi.delete(id);
      load();
    } catch {}
  };

  const itemCount = (sc: SavedCart) => sc._count?.items ?? sc.items?.length ?? 0;

  return (
    <div className="space-y-8">
      <h1 className="heading-page">Proiecte / Cosuri salvate</h1>

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px]">
          <label htmlFor="project-name" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Salvează coșul curent ca proiect
          </label>
          <Input
            id="project-name"
            placeholder="ex. Renovare baie"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={creating || !createName.trim()}>
          {creating ? 'Se salvează...' : 'Salvează proiect'}
        </Button>
        {error && <p className="w-full text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>

      {loading ? (
        <p className="text-neutral-500">Se încarcă...</p>
      ) : list.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">Nu ai proiecte salvate. Adaugă produse în coș și salvează lista cu un nume.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((sc) => (
            <li
              key={sc.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div>
                <p className="font-medium">{sc.name}</p>
                <p className="text-sm text-neutral-500">
                  {itemCount(sc)} produse · Actualizat {new Date(sc.updatedAt).toLocaleDateString('ro-RO')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => handleLoadIntoCart(sc.id)}
                  disabled={loadingCart === sc.id}
                >
                  {loadingCart === sc.id ? 'Se încarcă...' : 'Încarcă în coș'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDuplicate(sc.id)}>
                  Duplicare
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(sc.id)} className="text-red-600 dark:text-red-400">
                  Șterge
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-neutral-500">
        <Link href="/cart" className="text-primary-600 hover:underline dark:text-primary-400">Mergi la coș</Link> pentru a adăuga produse, apoi revino aici pentru a salva coșul ca proiect.
      </p>
    </div>
  );
}
