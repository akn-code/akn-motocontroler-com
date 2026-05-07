"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ReportFormData, VEHICLE_YEARS } from "@/lib/schema";
import { useI18n } from "@/lib/i18n-context";

const VEHICLE_BRANDS = [
  "Alfa Romeo", "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford",
  "Honda", "Hyundai", "Kia", "Mazda", "Mercedes-Benz", "Mitsubishi",
  "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Skoda", "Subaru",
  "Suzuki", "Toyota", "Volkswagen", "Volvo",
] as const;

const OTHER = "__other__";

export function VehicleSection() {
  const { t } = useI18n();
  const { register, setValue, getValues, formState: { errors } } = useFormContext<ReportFormData>();
  const [selectedBrand, setSelectedBrand] = useState(() => {
    const brand = getValues("brand");
    return VEHICLE_BRANDS.includes(brand as typeof VEHICLE_BRANDS[number]) ? brand : brand ? OTHER : "";
  });
  const [selectedYear, setSelectedYear] = useState(() => getValues("year") ?? "");

  function handleBrandSelect(v: string | null) {
    const val = v ?? "";
    setSelectedBrand(val);
    if (val !== OTHER) {
      setValue("brand", val, { shouldValidate: true });
    } else {
      setValue("brand", "", { shouldValidate: false });
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">

        <div className="space-y-1">
          <Label htmlFor="brand">{t("vehicleBrand")}</Label>
          <Select value={selectedBrand} onValueChange={handleBrandSelect}>
            <SelectTrigger id="brand">
              <SelectValue placeholder={t("vehicleBrandPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_BRANDS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
              <SelectItem value={OTHER}>{t("vehicleBrandOther")}</SelectItem>
            </SelectContent>
          </Select>
          {selectedBrand === OTHER && (
            <Input
              className="mt-1.5"
              placeholder={t("vehicleBrandOtherPlaceholder")}
              autoFocus
              onChange={(e) => setValue("brand", e.target.value, { shouldValidate: true })}
            />
          )}
          {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="model">{t("vehicleModel")}</Label>
          <Input id="model" placeholder="np. Corolla" {...register("model")} />
          {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="year">
            {t("vehicleYear")}{" "}
            <Badge variant="secondary" className="text-xs ml-1">{t("optional")}</Badge>
          </Label>
          <Select value={selectedYear} onValueChange={(v: string | null) => { const val = v ?? ""; setSelectedYear(val); setValue("year", val); }}>
            <SelectTrigger id="year">
              <SelectValue placeholder={t("vehicleYearPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_YEARS.map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">
            {t("email")}{" "}
            <Badge variant="secondary" className="text-xs ml-1">{t("optional")}</Badge>
          </Label>
          <Input id="email" type="email" placeholder={t("emailPlaceholder")} {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="vin">{t("vin")}</Label>
          <Input
            id="vin"
            placeholder="17-znakowy numer VIN"
            maxLength={17}
            className="uppercase tracking-widest"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}
            {...register("vin", { onChange: (e) => { e.target.value = e.target.value.toUpperCase(); } })}
          />
          <p className="text-xs text-muted-foreground">{t("vinHint")}</p>
          {errors.vin && <p className="text-xs text-destructive">{errors.vin.message}</p>}
        </div>

      </div>
    </div>
  );
}
