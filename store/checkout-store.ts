'use client';

import { create } from 'zustand';

export type GuestChoice = 'login' | 'register' | 'guest';
export type CheckoutAccountType = 'INDIVIDUAL' | 'COMPANY';

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postalCode: string;
  country: string;
}

export type DeliveryMethodId = 'STANDARD' | 'EXPRESS';
export type PaymentMethodId = 'CARD' | 'CASH_ON_DELIVERY' | 'BANK_TRANSFER';

interface CheckoutState {
  guestChoice: GuestChoice | null;
  accountType: CheckoutAccountType;
  companyName: string;
  companyVatId: string;
  companyTradeRegister: string;
  shippingAddress: CheckoutAddress | null;
  billingSameAsShipping: boolean;
  billingAddress: CheckoutAddress | null;
  deliveryMethod: DeliveryMethodId | null;
  deliveryFee: number | null;
  paymentMethod: PaymentMethodId | null;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  newsletterSubscribe: boolean;

  setGuestChoice: (choice: GuestChoice) => void;
  setAccountType: (type: CheckoutAccountType) => void;
  setCompanyData: (data: Partial<Pick<CheckoutState, 'companyName' | 'companyVatId' | 'companyTradeRegister'>>) => void;
  setShippingAddress: (address: CheckoutAddress | null) => void;
  setBillingSameAsShipping: (same: boolean) => void;
  setBillingAddress: (address: CheckoutAddress | null) => void;
  setDelivery: (method: DeliveryMethodId, fee: number) => void;
  setPaymentMethod: (method: PaymentMethodId) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  setAcceptedPrivacy: (accepted: boolean) => void;
  setNewsletterSubscribe: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  guestChoice: null,
  accountType: 'INDIVIDUAL' as CheckoutAccountType,
  companyName: '',
  companyVatId: '',
  companyTradeRegister: '',
  shippingAddress: null,
  billingSameAsShipping: true,
  billingAddress: null,
  deliveryMethod: null,
  deliveryFee: null,
  paymentMethod: null,
  acceptedTerms: false,
  acceptedPrivacy: false,
  newsletterSubscribe: false,
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  ...initialState,
  setGuestChoice: (guestChoice) => set({ guestChoice }),
  setAccountType: (accountType) => set({ accountType }),
  setCompanyData: (data) => set((state) => ({ ...state, ...data })),
  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setBillingSameAsShipping: (billingSameAsShipping) => set({ billingSameAsShipping }),
  setBillingAddress: (billingAddress) => set({ billingAddress }),
  setDelivery: (deliveryMethod, deliveryFee) => set({ deliveryMethod, deliveryFee }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setAcceptedTerms: (acceptedTerms) => set({ acceptedTerms }),
  setAcceptedPrivacy: (acceptedPrivacy) => set({ acceptedPrivacy }),
  setNewsletterSubscribe: (newsletterSubscribe) => set({ newsletterSubscribe }),
  reset: () => set(initialState),
}));
