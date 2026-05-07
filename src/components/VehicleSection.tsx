"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ReportFormData } from "@/lib/schema";

export function VehicleSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReportFormData>();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="brand">Marka pojazdu</Label>
          <Input id="brand" placeholder="np. Toyota" {...register("brand")} />
          {errors.brand && (
            <p className="text-xs text-destructive">{errors.brand.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="model">Model pojazdu</Label>
          <Input id="model" placeholder="np. Corolla" {...register("model")} />
          {errors.model && (
            <p className="text-xs text-destructive">{errors.model.message}</p>
          )}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            placeholder="17-znakowy numer VIN"
            maxLength={17}
            className="uppercase font-mono tracking-widest"
            {...register("vin", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            })}
          />
          <p className="text-xs text-muted-foreground">
            17 znaków, bez liter I, O, Q
          </p>
          {errors.vin && (
            <p className="text-xs text-destructive">{errors.vin.message}</p>
          )}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="email">
            E-mail{" "}
            <Badge variant="secondary" className="text-xs ml-1">
              opcjonalny
            </Badge>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="kontakt@przyklad.pl"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
