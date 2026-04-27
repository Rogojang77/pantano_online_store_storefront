'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CookieBanner } from './cookie-banner';
import { CookiePreferencesModal } from './cookie-preferences-modal';
import { getStoredConsent, saveConsent } from './consent-storage';
import {
  COOKIE_CONSENT_VERSION,
  defaultConsentCategories,
  defaultConsentState,
  type CookieConsentCategories,
  type CookieConsentState,
} from './consent-types';

interface CookieConsentContextValue {
  consent: CookieConsentState;
  hasConsented: boolean;
  isPreferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (categories: Omit<CookieConsentCategories, 'necessary'>) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function buildState(
  status: CookieConsentState['status'],
  categories: Omit<CookieConsentCategories, 'necessary'>
): CookieConsentState {
  return {
    version: COOKIE_CONSENT_VERSION,
    status,
    updatedAt: new Date().toISOString(),
    categories: {
      necessary: true,
      ...categories,
    },
  };
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentState>(defaultConsentState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<CookieConsentCategories, 'necessary'>>({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = getStoredConsent();
    setConsent(stored);
    setDraft({
      preferences: stored.categories.preferences,
      analytics: stored.categories.analytics,
      marketing: stored.categories.marketing,
    });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const showBanner = consent.status === 'unset';
    if (showBanner) {
      document.body.style.setProperty('padding-bottom', '6.5rem');
    } else {
      document.body.style.removeProperty('padding-bottom');
    }
    return () => {
      document.body.style.removeProperty('padding-bottom');
    };
  }, [isHydrated, consent.status]);

  const commitState = useCallback((next: CookieConsentState) => {
    setConsent(next);
    setDraft({
      preferences: next.categories.preferences,
      analytics: next.categories.analytics,
      marketing: next.categories.marketing,
    });
    saveConsent(next);
  }, []);

  const openPreferences = useCallback(() => {
    setDraft({
      preferences: consent.categories.preferences,
      analytics: consent.categories.analytics,
      marketing: consent.categories.marketing,
    });
    setIsPreferencesOpen(true);
  }, [consent.categories.analytics, consent.categories.marketing, consent.categories.preferences]);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    commitState(
      buildState('accepted_all', {
        ...defaultConsentCategories,
        preferences: true,
        analytics: true,
        marketing: true,
      })
    );
    setIsPreferencesOpen(false);
  }, [commitState]);

  const rejectOptional = useCallback(() => {
    commitState(
      buildState('rejected_optional', {
        ...defaultConsentCategories,
        preferences: false,
        analytics: false,
        marketing: false,
      })
    );
    setIsPreferencesOpen(false);
  }, [commitState]);

  const savePreferencesSelection = useCallback(
    (categories: Omit<CookieConsentCategories, 'necessary'>) => {
      const allEnabled = categories.preferences && categories.analytics && categories.marketing;
      const allDisabled = !categories.preferences && !categories.analytics && !categories.marketing;
      const status: CookieConsentState['status'] = allEnabled
        ? 'accepted_all'
        : allDisabled
          ? 'rejected_optional'
          : 'partial';

      commitState(buildState(status, categories));
      setIsPreferencesOpen(false);
    },
    [commitState]
  );

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      hasConsented: consent.status !== 'unset',
      isPreferencesOpen,
      openPreferences,
      closePreferences,
      acceptAll,
      rejectOptional,
      savePreferences: savePreferencesSelection,
    }),
    [
      acceptAll,
      closePreferences,
      consent,
      isPreferencesOpen,
      openPreferences,
      rejectOptional,
      savePreferencesSelection,
    ]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {isHydrated && consent.status === 'unset' ? (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectOptional={rejectOptional}
          onOpenPreferences={openPreferences}
        />
      ) : null}
      <CookiePreferencesModal
        open={isHydrated && isPreferencesOpen}
        categories={{ necessary: true, ...draft }}
        onClose={closePreferences}
        onChange={(next) =>
          setDraft({
            preferences: next.preferences,
            analytics: next.analytics,
            marketing: next.marketing,
          })
        }
        onSave={() => savePreferencesSelection(draft)}
      />
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }

  return context;
}
