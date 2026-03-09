'use client';

import type { CheckoutAddress } from '@/store/checkout-store';
import { Input, Label } from '@/components/ui';

interface AddressFormProps {
  value: Partial<CheckoutAddress>;
  onChange: (data: Partial<CheckoutAddress>) => void;
  errors?: Partial<Record<keyof CheckoutAddress, string>>;
  showPersonal?: boolean;
}

export function AddressForm({ value, onChange, errors = {}, showPersonal = false }: AddressFormProps) {
  return (
    <div className="space-y-4">
      {showPersonal && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prenume</Label>
              <Input
                id="firstName"
                value={value.firstName ?? ''}
                onChange={(e) => onChange({ firstName: e.target.value })}
                className="mt-1"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Nume</Label>
              <Input
                id="lastName"
                value={value.lastName ?? ''}
                onChange={(e) => onChange({ lastName: e.target.value })}
                className="mt-1"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={value.email ?? ''}
              onChange={(e) => onChange({ email: e.target.value })}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={value.phone ?? ''}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="mt-1"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
            )}
          </div>
        </>
      )}
      <div>
        <Label htmlFor="addressLine1">Strada, număr *</Label>
        <Input
          id="addressLine1"
          value={value.addressLine1 ?? ''}
          onChange={(e) => onChange({ addressLine1: e.target.value })}
          className="mt-1"
          placeholder="Strada, număr bloc"
        />
        {errors.addressLine1 && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.addressLine1}</p>
        )}
      </div>
      <div>
        <Label htmlFor="addressLine2">Apartament, etaj (opțional)</Label>
        <Input
          id="addressLine2"
          value={value.addressLine2 ?? ''}
          onChange={(e) => onChange({ addressLine2: e.target.value })}
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="city">Oraș *</Label>
          <Input
            id="city"
            value={value.city ?? ''}
            onChange={(e) => onChange({ city: e.target.value })}
            className="mt-1"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>
          )}
        </div>
        <div>
          <Label htmlFor="postalCode">Cod poștal *</Label>
          <Input
            id="postalCode"
            value={value.postalCode ?? ''}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            className="mt-1"
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.postalCode}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="county">Județ</Label>
        <Input
          id="county"
          value={value.county ?? ''}
          onChange={(e) => onChange({ county: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="country">Țara *</Label>
        <Input
          id="country"
          value={value.country ?? 'RO'}
          onChange={(e) => onChange({ country: e.target.value })}
          className="mt-1"
        />
        {errors.country && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.country}</p>
        )}
      </div>
    </div>
  );
}
