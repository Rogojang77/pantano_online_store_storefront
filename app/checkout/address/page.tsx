'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCheckoutStore } from '@/store';
import { getAuthToken } from '@/lib/api-client';
import { addressesApi } from '@/lib/api';
import type { Address } from '@/types/api';
import type { CheckoutAddress } from '@/store/checkout-store';
import { Button, Label } from '@/components/ui';
import { AddressForm } from '@/features/checkout/address-form';

function toCheckoutAddress(
  a: Address,
  email: string,
  phone?: string,
  firstName?: string | null,
  lastName?: string | null
): CheckoutAddress {
  return {
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    email,
    phone: phone ?? '',
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 ?? undefined,
    city: a.city,
    county: a.county ?? undefined,
    postalCode: a.postalCode,
    country: a.country,
  };
}

export default function CheckoutAddressPage() {
  const router = useRouter();
  const token = getAuthToken();
  const user = useAuthStore((s) => s.user);
  const guestChoice = useCheckoutStore((s) => s.guestChoice);
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress);
  const billingSameAsShipping = useCheckoutStore((s) => s.billingSameAsShipping);
  const billingAddress = useCheckoutStore((s) => s.billingAddress);
  const setShippingAddress = useCheckoutStore((s) => s.setShippingAddress);
  const setBillingSameAsShipping = useCheckoutStore((s) => s.setBillingSameAsShipping);
  const setBillingAddress = useCheckoutStore((s) => s.setBillingAddress);

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(!token);
  const [shipping, setShipping] = useState<Partial<CheckoutAddress>>(
    shippingAddress ?? {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: '',
      country: 'RO',
    }
  );
  const [billing, setBilling] = useState<Partial<CheckoutAddress>>(
    billingAddress ?? { country: 'RO' }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutAddress, string>>>({});

  const isGuest = guestChoice === 'guest' || !token;

  useEffect(() => {
    if (token) {
      addressesApi
        .list()
        .then((list) => {
          setSavedAddresses(list);
          const defaultShipping = list.find((a) => a.isDefaultShipping) ?? list[0];
          if (defaultShipping && !shippingAddress) {
            setSelectedSavedId(defaultShipping.id);
            setUseNewAddress(false);
            setShipping(
              toCheckoutAddress(
                defaultShipping,
                user?.email ?? '',
                undefined,
                user?.firstName,
                user?.lastName
              )
            );
          } else if (list.length === 0) {
            setUseNewAddress(true);
          }
        })
        .catch(() => setUseNewAddress(true));
    }
  }, [token, user?.email, user?.firstName, user?.lastName, shippingAddress]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof CheckoutAddress, string>> = {};
    if (!shipping.addressLine1?.trim()) e.addressLine1 = 'Introdu strada și numărul';
    if (!shipping.city?.trim()) e.city = 'Introdu orașul';
    if (!shipping.postalCode?.trim()) e.postalCode = 'Introdu codul poștal';
    if (isGuest && !shipping.email?.trim()) e.email = 'Introdu emailul';
    if (!billingSameAsShipping) {
      if (!billing.addressLine1?.trim()) e.addressLine1 = 'Introdu adresa de facturare';
      if (!billing.city?.trim()) e.city = 'Introdu orașul (facturare)';
      if (!billing.postalCode?.trim()) e.postalCode = 'Introdu codul poștal (facturare)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useNewAddress || !token) {
      if (!validate()) return;
    }
    const ship: CheckoutAddress = {
      firstName: shipping.firstName ?? user?.firstName ?? '',
      lastName: shipping.lastName ?? user?.lastName ?? '',
      email: shipping.email ?? (user?.email ?? ''),
      phone: shipping.phone ?? '',
      addressLine1: shipping.addressLine1 ?? '',
      addressLine2: shipping.addressLine2,
      city: shipping.city ?? '',
      county: shipping.county,
      postalCode: shipping.postalCode ?? '',
      country: shipping.country ?? 'RO',
    };
    setShippingAddress(ship);
    setBillingSameAsShipping(billingSameAsShipping);
    if (!billingSameAsShipping) {
      setBillingAddress({
        ...ship,
        firstName: billing.firstName ?? ship.firstName,
        lastName: billing.lastName ?? ship.lastName,
        email: billing.email ?? ship.email,
        phone: billing.phone ?? ship.phone,
        addressLine1: billing.addressLine1 ?? '',
        addressLine2: billing.addressLine2,
        city: billing.city ?? '',
        county: billing.county,
        postalCode: billing.postalCode ?? '',
        country: billing.country ?? 'RO',
      });
    } else {
      setBillingAddress(null);
    }
    router.push('/checkout/delivery');
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <h1 className="heading-page mb-8">Adresă livrare și facturare</h1>

      {token && savedAddresses.length > 0 && (
        <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <Label className="mb-2 block">Adrese salvate</Label>
          <div className="space-y-2">
            {savedAddresses.map((a) => (
              <label key={a.id} className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="saved"
                  checked={selectedSavedId === a.id && !useNewAddress}
                  onChange={() => {
                    setSelectedSavedId(a.id);
                    setUseNewAddress(false);
                    setShipping(
                      toCheckoutAddress(
                        a,
                        user?.email ?? '',
                        undefined,
                        user?.firstName,
                        user?.lastName
                      )
                    );
                  }}
                  className="mt-1"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {a.addressLine1}, {a.postalCode} {a.city}, {a.country}
                </span>
              </label>
            ))}
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="saved"
                checked={useNewAddress}
                onChange={() => {
                  setUseNewAddress(true);
                  setSelectedSavedId(null);
                }}
                className="mt-1"
              />
              <span className="text-sm">Introdu o adresă nouă</span>
            </label>
          </div>
        </div>
      )}

      {(useNewAddress || !token) && (
        <>
          <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Adresă livrare
            </h2>
            <AddressForm
              value={shipping}
              onChange={(upd) => setShipping((s) => ({ ...s, ...upd }))}
              errors={errors}
              showPersonal={isGuest}
            />
          </div>

          <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={billingSameAsShipping}
                onChange={(e) => setBillingSameAsShipping(e.target.checked)}
              />
              <span className="font-medium text-neutral-900 dark:text-white">
                Adresa de facturare este aceeași cu cea de livrare
              </span>
            </label>
            {!billingSameAsShipping && (
              <div className="mt-4">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                  Adresă facturare
                </h2>
                <AddressForm
                  value={billing}
                  onChange={(upd) => setBilling((b) => ({ ...b, ...upd }))}
                  showPersonal={false}
                />
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Înapoi
        </Button>
        <Button type="submit">Continuă la livrare</Button>
      </div>
    </form>
  );
}
