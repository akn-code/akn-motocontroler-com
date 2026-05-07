"use client";

import { useFormContext } from "react-hook-form";
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
  "Suzuki", "Toyota", "Volkswagen", "Volvo", "Inna",
] as const;

export function VehicleSection() {
  const { t } = useI18n();
  const { register, setValue, formState: { errors } } = useFormContext<ReportFormData>();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">

        <div className="space-y-1">
          <Label htmlFor="brand">{t("vehicleBrand")}</Label>
          <Select onValueChange={(v: string | null) => setValue("brand", v ?? "", { shouldValidate: true })}>
            <SelectTrigger id="brand">
              <SelectValue placeholder={t("vehicleBrandPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_BRANDS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select onValueChange={(v: string | null) => setValue("year", v ?? "")}>
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
