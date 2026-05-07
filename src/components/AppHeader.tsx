"use client";

import { signOut } from "next-auth/react";
import { useI18n } from "@/lib/i18n-context";

interface AppHeaderProps {
  user: { name?: string | null; email?: string | null } | null;
}

export function AppHeader({ user }: AppHeaderProps) {
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="bg-[#24292f] text-white border-b border-[#30363d]">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden fill="none">
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" fill="white"/>
            <circle cx="12" cy="12" r="6.5" stroke="white" strokeWidth="1" strokeDasharray="2 2"/>
          </svg>
          <span className="font-semibold text-sm truncate">
            {t("appName")}
            <span className="text-[#8b949e] font-normal mx-1">/</span>
            <span className="font-semibold">{t("appSub")}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {user && (
            <span className="hidden sm:block text-xs text-[#8b949e] truncate max-w-[160px]">
              {user.name ?? user.email}
            </span>
          )}

          <button
            onClick={() => setLocale(locale === "pl" ? "en" : "pl")}
            className="text-xs text-[#8b949e] hover:text-white border border-[#30363d] hover:border-[#8b949e] rounded px-2 py-1 transition-colors"
          >
            {locale === "pl" ? "EN" : "PL"}
          </button>

          {user && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs text-[#8b949e] hover:text-white border border-[#30363d] hover:border-[#8b949e] rounded px-2 py-1 transition-colors"
            >
              {t("logout")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
