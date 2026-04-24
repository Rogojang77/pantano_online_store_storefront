export type ConsentStatus = 'unset' | 'partial' | 'accepted_all' | 'rejected_optional';

export interface CookieConsentCategories {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  version: number;
  status: ConsentStatus;
  updatedAt: string;
  categories: CookieConsentCategories;
}

export const COOKIE_CONSENT_VERSION = 1;

export const defaultConsentCategories: CookieConsentCategories = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export const defaultConsentState: CookieConsentState = {
  version: COOKIE_CONSENT_VERSION,
  status: 'unset',
  updatedAt: '',
  categories: defaultConsentCategories,
};
