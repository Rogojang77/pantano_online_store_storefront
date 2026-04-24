'use client';

import { Button } from '@/components/ui/button';
import type { CookieConsentCategories } from './consent-types';

interface CookiePreferencesModalProps {
  open: boolean;
  categories: CookieConsentCategories;
  onClose: () => void;
  onChange: (next: Omit<CookieConsentCategories, 'necessary'>) => void;
  onSave: () => void;
}

interface RowProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

function CategoryRow({ title, description, checked, disabled = false, onChange }: RowProps) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div>
        <p className="font-medium text-neutral-900 dark:text-white">{title}</p>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
      </div>
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-primary-600"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
    </label>
  );
}

export function CookiePreferencesModal({
  open,
  categories,
  onClose,
  onChange,
  onSave,
}: CookiePreferencesModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="cookie-preferences-title"
              className="font-heading text-xl font-semibold text-neutral-900 dark:text-white"
            >
              Preferințe cookie-uri
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              Poți activa doar categoriile opționale pe care le dorești. Cookie-urile necesare
              rămân active pentru funcționarea magazinului.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Închide
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <CategoryRow
            title="Necesare"
            description="Asigură autentificarea, securitatea și funcțiile esențiale ale site-ului."
            checked
            disabled
          />
          <CategoryRow
            title="Preferințe"
            description="Memorează opțiuni precum preferințe de afișare sau selecții utilizator."
            checked={categories.preferences}
            onChange={(preferences) => onChange({ ...categories, preferences })}
          />
          <CategoryRow
            title="Analitice"
            description="Ne ajută să înțelegem utilizarea site-ului pentru îmbunătățirea experienței."
            checked={categories.analytics}
            onChange={(analytics) => onChange({ ...categories, analytics })}
          />
          <CategoryRow
            title="Marketing"
            description="Permit măsurarea campaniilor și afișarea de oferte relevante."
            checked={categories.marketing}
            onChange={(marketing) => onChange({ ...categories, marketing })}
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button onClick={onSave}>Salvează preferințele</Button>
        </div>
      </div>
    </div>
  );
}
