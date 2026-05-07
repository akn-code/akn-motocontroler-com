"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Locale, translations, TranslationKey, Translations } from "./i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
  tArr: (key: TranslationKey) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pl");

  function t(key: TranslationKey): string {
    const val = (translations[locale] as Translations)[key];
    return Array.isArray(val) ? val.join(", ") : val;
  }

  function tArr(key: TranslationKey): string[] {
    const val = (translations[locale] as Translations)[key];
    return Array.isArray(val) ? val : [val];
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tArr }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
