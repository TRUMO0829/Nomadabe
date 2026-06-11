"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  getCopyLocale,
  isLocale,
  UI_COPY,
  type CopyLocale,
  type Locale,
} from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  contentLocale: CopyLocale;
  t: (typeof UI_COPY)[CopyLocale];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "nomadabe-language";
const LANGUAGE_CHANGE_EVENT = "nomadabe-language-change";

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  try {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function subscribeToLocaleChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocaleChanges,
    readStoredLocale,
    () => DEFAULT_LOCALE
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {
      return;
    }

    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const contentLocale = getCopyLocale(locale);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      contentLocale,
      t: UI_COPY[contentLocale],
    }),
    [contentLocale, locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}
