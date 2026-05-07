"use client";

import { useI18n } from "@/lib/i18n-context";
import { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <>
      <div className="border-b border-[#d0d7de] bg-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
          <h1 className="text-lg sm:text-xl font-semibold text-[#1f2328]">{t("pageTitle")}</h1>
          <p className="text-sm text-[#636c76] mt-1">{t("pageDesc")}</p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white border border-[#d0d7de] rounded-md shadow-sm p-4 sm:p-6">
          {children}
        </div>
      </main>

      <footer className="border-t border-[#d0d7de] text-[#636c76] text-xs text-center py-4 mt-auto bg-[#f6f8fa]">
        &copy; {new Date().getFullYear()} Motocontroler &mdash; {t("footer")}
      </footer>
    </>
  );
}
