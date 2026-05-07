import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/lib/i18n-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raport Opon | Motocontroler",
  description: "Formularz raportu opon dla rzeczoznawców Motocontroler",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className="h-full">
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
