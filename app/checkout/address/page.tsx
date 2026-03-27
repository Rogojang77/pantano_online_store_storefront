'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCheckoutStore } from '@/store';
import { addressesApi } from '@/lib/api';
import type { Address } from '@/types/api';
import type { CheckoutAccountType, CheckoutAddress } from '@/store/checkout-store';
import { Button, Input, Label } from '@/components/ui';
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
  const user = useAuthStore((s) => s.user);
  const guestChoice = useCheckoutStore((s) => s.guestChoice);
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress);
  const checkoutAccountType = useCheckoutStore((s) => s.accountType);
  const checkoutCompanyName = useCheckoutStore((s) => s.companyName);
  const checkoutCompanyVatId = useCheckoutStore((s) => s.companyVatId);
  const checkoutCompanyTradeRegister = useCheckoutStore((s) => s.companyTradeRegister);
  const billingSameAsShipping = useCheckoutStore((s) => s.billingSameAsShipping);
  const billingAddress = useCheckoutStore((s) => s.billingAddress);
  const setAccountType = useCheckoutStore((s) => s.setAccountType);
  const setCompanyData = useCheckoutStore((s) => s.setCompanyData);
  const setShippingAddress = useCheckoutStore((s) => s.setShippingAddress);
  const setBillingSameAsShipping = useCheckoutStore((s) => s.setBillingSameAsShipping);
  const setBillingAddress = useCheckoutStore((s) => s.setBillingAddress);

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const isAuthenticated = Boolean(user);
  const [useNewAddress, setUseNewAddress] = useState(!isAuthenticated);
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
  const [accountType, setLocalAccountType] = useState<CheckoutAccountType>(
    checkoutAccountType ?? (user?.accountType === 'COMPANY' ? 'COMPANY' : 'INDIVIDUAL')
  );
  const [companyName, setCompanyName] = useState(
    checkoutCompanyName || user?.companyName || ''
  );
  const [companyVatId, setCompanyVatId] = useState(
    checkoutCompanyVatId || user?.companyVatId || ''
  );
  const [companyTradeRegister, setCompanyTradeRegister] = useState(
    checkoutCompanyTradeRegister || user?.companyTradeRegister || ''
  );
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof CheckoutAddress, string>>>({});
  const [billingErrors, setBillingErrors] = useState<Partial<Record<keyof CheckoutAddress, string>>>({});
  const [companyErrors, setCompanyErrors] = useState<{ companyName?: string; companyVatId?: string }>({});

  const isGuest = guestChoice === 'guest' || !isAuthenticated;

  useEffect(() => {
    if (isAuthenticated) {
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
  }, [isAuthenticated, user?.email, user?.firstName, user?.lastName, shippingAddress]);

  const validate = (): boolean => {
    const shipErrors: Partial<Record<keyof CheckoutAddress, string>> = {};
    const billErrors: Partial<Record<keyof CheckoutAddress, string>> = {};
    const companyValidation: { companyName?: string; companyVatId?: string } = {};

    if (!shipping.addressLine1?.trim()) shipErrors.addressLine1 = 'Introdu strada și numărul';
    if (!shipping.city?.trim()) shipErrors.city = 'Introdu orașul';
    if (!shipping.postalCode?.trim()) shipErrors.postalCode = 'Introdu codul poștal';
    if (isGuest && !shipping.email?.trim()) shipErrors.email = 'Introdu emailul';
    if (accountType === 'COMPANY') {
      if (!companyName.trim()) companyValidation.companyName = 'Introdu denumirea firmei';
      if (!companyVatId.trim()) companyValidation.companyVatId = 'Introdu CUI/CIF';
    }
    if (!billingSameAsShipping) {
      if (!billing.addressLine1?.trim()) billErrors.addressLine1 = 'Introdu adresa de facturare';
      if (!billing.city?.trim()) billErrors.city = 'Introdu orașul (facturare)';
      if (!billing.postalCode?.trim()) billErrors.postalCode = 'Introdu codul poștal (facturare)';
    }
    setShippingErrors(shipErrors);
    setBillingErrors(billErrors);
    setCompanyErrors(companyValidation);
    return (
      Object.keys(shipErrors).length === 0 &&
      Object.keys(billErrors).length === 0 &&
      Object.keys(companyValidation).length === 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setAccountType(accountType);
    setCompanyData({
      companyName: companyName.trim(),
      companyVatId: companyVatId.trim(),
      companyTradeRegister: companyTradeRegister.trim(),
    });
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

      <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
          Tip client
        </h2>
        <div className="mb-4 flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="accountType"
              checked={accountType === 'INDIVIDUAL'}
              onChange={() => setLocalAccountType('INDIVIDUAL')}
            />
            <span>Persoană fizică</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="accountType"
              checked={accountType === 'COMPANY'}
              onChange={() => setLocalAccountType('COMPANY')}
            />
            <span>Persoană juridică</span>
          </label>
        </div>
        {accountType === 'COMPANY' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="companyName">Denumire firmă *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
              />
              {companyErrors.companyName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{companyErrors.companyName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="companyVatId">CUI / CIF *</Label>
              <Input
                id="companyVatId"
                value={companyVatId}
                onChange={(e) => setCompanyVatId(e.target.value)}
                className="mt-1"
              />
              {companyErrors.companyVatId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{companyErrors.companyVatId}</p>
              )}
            </div>
            <div>
              <Label htmlFor="companyTradeRegister">Nr. Reg. Comerțului (opțional)</Label>
              <Input
                id="companyTradeRegister"
                value={companyTradeRegister}
                onChange={(e) => setCompanyTradeRegister(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>

      {isAuthenticated && savedAddresses.length > 0 && (
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

      {(useNewAddress || !isAuthenticated) && (
        <>
          <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Adresă livrare
            </h2>
            <AddressForm
              value={shipping}
              onChange={(upd) => setShipping((s) => ({ ...s, ...upd }))}
              errors={shippingErrors}
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
                  errors={billingErrors}
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
