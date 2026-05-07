import { describe, it, expect } from "vitest";
import { translations, locales } from "@/lib/i18n";

describe("translations — completeness", () => {
  const plKeys = Object.keys(translations.pl) as string[];
  const enKeys = Object.keys(translations.en) as string[];

  it("all locales are defined", () => {
    for (const locale of locales) {
      expect(translations).toHaveProperty(locale);
    }
  });

  it("EN has all keys that PL has", () => {
    const missing = plKeys.filter((k) => !enKeys.includes(k));
    expect(missing).toEqual([]);
  });

  it("PL has all keys that EN has", () => {
    const missing = enKeys.filter((k) => !plKeys.includes(k));
    expect(missing).toEqual([]);
  });

  it("no translation value is an empty string", () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(translations[locale])) {
        if (Array.isArray(value)) {
          value.forEach((v, i) =>
            expect(v, `${locale}.${key}[${i}]`).not.toBe("")
          );
        } else {
          expect(value, `${locale}.${key}`).not.toBe("");
        }
      }
    }
  });

  it("ratings array has exactly 5 items in each locale", () => {
    for (const locale of locales) {
      const ratings = translations[locale].ratings;
      expect(Array.isArray(ratings)).toBe(true);
      expect((ratings as string[]).length).toBe(5);
    }
  });
});
