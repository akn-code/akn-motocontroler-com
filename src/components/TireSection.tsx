"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ReportFormData, getTreadWarning, TIRE_BRANDS } from "@/lib/schema";
import { useI18n } from "@/lib/i18n-context";
import { AlertTriangle, XCircle } from "lucide-react";

const TIRE_WIDTHS   = ["155","165","175","185","195","205","215","225","235","245","255","265","275","285","295","305","315","325"] as const;
const TIRE_PROFILES = ["25","30","35","40","45","50","55","60","65","70","75","80"] as const;
const TIRE_RIMS     = ["13","14","15","16","17","18","19","20","21","22","23"] as const;

const TIRE_LABEL_KEYS = {
  FL: "tireFL", FR: "tireFR", RL: "tireRL", RR: "tireRR",
} as const;

interface TireSectionProps {
  position: "FL" | "FR" | "RL" | "RR";
}

export function TireSection({ position }: TireSectionProps) {
  const { t, tArr } = useI18n();
  const { register, setValue, formState: { errors } } = useFormContext<ReportFormData>();

  const treadDepth = useWatch({ name: `tires.${position}.treadDepth` });
  const treadWarning = getTreadWarning(treadDepth ?? "");
  const tireErrors = errors.tires?.[position];

  const [width, setWidth]     = useState("");
  const [profile, setProfile] = useState("");
  const [rim, setRim]         = useState("");

  function updateSize(w: string, p: string, r: string) {
    if (w && p && r) {
      setValue(`tires.${position}.size`, `${w}/${p} R${r}`, { shouldValidate: true });
    } else {
      setValue(`tires.${position}.size`, "", { shouldValidate: false });
    }
  }

  function handleWidth(v: string | null)   { const val = v ?? ""; setWidth(val);   updateSize(val, profile, rim); }
  function handleProfile(v: string | null) { const val = v ?? ""; setProfile(val); updateSize(width, val, rim); }
  function handleRim(v: string | null)     { const val = v ?? ""; setRim(val);     updateSize(width, profile, val); }

  const ratings = tArr("ratings");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
          {position}
        </div>
        <h3 className="font-semibold text-[#1f2328]">{t(TIRE_LABEL_KEYS[position])}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">

        {/* Marka */}
        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.brand`}>{t("tireBrand")}</Label>
          <Select onValueChange={(v: string | null) => setValue(`tires.${position}.brand`, v ?? "", { shouldValidate: true })}>
            <SelectTrigger id={`tires.${position}.brand`}>
              <SelectValue placeholder={t("tireBrandPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {TIRE_BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          {tireErrors?.brand && <p className="text-xs text-destructive">{tireErrors.brand.message}</p>}
        </div>

        {/* Rozmiar */}
        <div className="space-y-1">
          <Label>
            {t("tireSize")}
            {width && profile && rim && (
              <span className="ml-2 text-[#636c76] font-normal font-mono text-xs">
                {width}/{profile} R{rim}
              </span>
            )}
          </Label>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="flex-1 min-w-0">
              <Select onValueChange={handleWidth}>
                <SelectTrigger className="px-2 text-sm sm:text-xs">
                  <SelectValue placeholder={t("tireSizeWidth")} />
                </SelectTrigger>
                <SelectContent>
                  {TIRE_WIDTHS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <span className="text-[#636c76] text-base select-none shrink-0">/</span>
            <div className="flex-1 min-w-0">
              <Select onValueChange={handleProfile}>
                <SelectTrigger className="px-2 text-sm sm:text-xs">
                  <SelectValue placeholder={t("tireSizeProfile")} />
                </SelectTrigger>
                <SelectContent>
                  {TIRE_PROFILES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <span className="text-[#636c76] text-base select-none shrink-0">R</span>
            <div className="flex-1 min-w-0">
              <Select onValueChange={handleRim}>
                <SelectTrigger className="px-2 text-sm sm:text-xs">
                  <SelectValue placeholder={t("tireSizeRim")} />
                </SelectTrigger>
                <SelectContent>
                  {TIRE_RIMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {tireErrors?.size && <p className="text-xs text-destructive">{tireErrors.size.message}</p>}
        </div>

        {/* Bieżnik */}
        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.treadDepth`}>{t("treadDepth")}</Label>
          <Input
            id={`tires.${position}.treadDepth`}
            type="number" step="0.1" min="0"
            placeholder={t("treadDepthPlaceholder")}
            {...register(`tires.${position}.treadDepth`)}
          />
          {tireErrors?.treadDepth && <p className="text-xs text-destructive">{tireErrors.treadDepth.message}</p>}
          {treadWarning === "legal" && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 mt-1">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{t("treadLegal")}</span>
            </div>
          )}
          {treadWarning === "low" && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{t("treadLow")}</span>
            </div>
          )}
        </div>

        {/* DOT */}
        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.dot`}>{t("dot")}</Label>
          <Input
            id={`tires.${position}.dot`}
            placeholder={t("dotPlaceholder")} maxLength={4}
            {...register(`tires.${position}.dot`)}
          />
          <p className="text-xs text-muted-foreground">{t("dotHint")}</p>
          {tireErrors?.dot && <p className="text-xs text-destructive">{tireErrors.dot.message}</p>}
        </div>

        {/* Ocena */}
        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.rating`}>{t("rating")}</Label>
          <Select onValueChange={(v: string | null) => setValue(`tires.${position}.rating`, v ?? "", { shouldValidate: true })}>
            <SelectTrigger id={`tires.${position}.rating`}>
              <SelectValue placeholder={t("ratingPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} — {ratings[n - 1]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tireErrors?.rating && <p className="text-xs text-destructive">{tireErrors.rating.message}</p>}
        </div>

        {/* Uwagi */}
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor={`tires.${position}.notes`}>
            {t("notes")}{" "}
            <Badge variant="secondary" className="text-xs ml-1">{t("optional")}</Badge>
          </Label>
          <Textarea
            id={`tires.${position}.notes`}
            placeholder={t("notesPlaceholder")} rows={2}
            {...register(`tires.${position}.notes`)}
          />
        </div>

      </div>
    </div>
  );
}
