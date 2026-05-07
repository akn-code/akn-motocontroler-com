"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError(t("loginError"));
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa]">
      <header className="bg-[#24292f] text-white border-b border-[#30363d]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
              <circle cx="12" cy="12" r="6.5" stroke="white" strokeWidth="1" strokeDasharray="2 2"/>
            </svg>
            <span className="font-semibold text-sm">
              {t("appName")}
              <span className="text-[#8b949e] font-normal mx-1">/</span>
              <span className="font-semibold">{t("appSub")}</span>
            </span>
          </div>
          <button
            onClick={() => setLocale(locale === "pl" ? "en" : "pl")}
            className="text-xs text-[#8b949e] hover:text-white border border-[#30363d] hover:border-[#8b949e] rounded px-2 py-1 transition-colors"
          >
            {locale === "pl" ? "EN" : "PL"}
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-[#d0d7de] rounded-md shadow-sm p-6">
            <div className="mb-6 text-center">
              <h1 className="text-xl font-semibold text-[#1f2328]">{t("loginTitle")}</h1>
              <p className="text-sm text-[#636c76] mt-1">{t("loginDesc")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("loginEmail")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">{t("loginPassword")}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("loginLoading")}
                  </>
                ) : (
                  t("loginButton")
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#d0d7de] text-[#636c76] text-xs text-center py-4 bg-[#f6f8fa]">
        &copy; {new Date().getFullYear()} Motocontroler
      </footer>
    </div>
  );
}
