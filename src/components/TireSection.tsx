"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ReportFormData, getTreadWarning } from "@/lib/schema";
import { AlertTriangle, XCircle } from "lucide-react";
import { useWatch } from "react-hook-form";

const TIRE_LABELS: Record<string, string> = {
  FL: "Przód Lewy (FL)",
  FR: "Przód Prawy (FR)",
  RL: "Tył Lewy (RL)",
  RR: "Tył Prawy (RR)",
};

interface TireSectionProps {
  position: "FL" | "FR" | "RL" | "RR";
}

export function TireSection({ position }: TireSectionProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ReportFormData>();

  const treadDepth = useWatch({ name: `tires.${position}.treadDepth` });
  const treadWarning = getTreadWarning(treadDepth ?? "");

  const tireErrors = errors.tires?.[position];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
          {position}
        </div>
        <h3 className="font-semibold text-gray-900">{TIRE_LABELS[position]}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.brand`}>Marka opony</Label>
          <Input
            id={`tires.${position}.brand`}
            placeholder="np. Michelin"
            {...register(`tires.${position}.brand`)}
          />
          {tireErrors?.brand && (
            <p className="text-xs text-destructive">{tireErrors.brand.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.size`}>Rozmiar</Label>
          <Input
            id={`tires.${position}.size`}
            placeholder="205/55 R16"
            {...register(`tires.${position}.size`)}
          />
          {tireErrors?.size && (
            <p className="text-xs text-destructive">{tireErrors.size.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.treadDepth`}>
            Głębokość bieżnika (mm)
          </Label>
          <Input
            id={`tires.${position}.treadDepth`}
            type="number"
            step="0.1"
            min="0"
            placeholder="np. 5.5"
            {...register(`tires.${position}.treadDepth`)}
          />
          {tireErrors?.treadDepth && (
            <p className="text-xs text-destructive">{tireErrors.treadDepth.message}</p>
          )}
          {treadWarning === "legal" && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 mt-1">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Poniżej prawnego minimum 1,6 mm — opona nie nadaje się do użytku
              </span>
            </div>
          )}
          {treadWarning === "low" && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Poniżej zalecanego minimum 3 mm — zalecana wymiana</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.dot`}>DOT</Label>
          <Input
            id={`tires.${position}.dot`}
            placeholder="np. 2123 (tydzień 21, rok 2023)"
            maxLength={4}
            {...register(`tires.${position}.dot`)}
          />
          {tireErrors?.dot && (
            <p className="text-xs text-destructive">{tireErrors.dot.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor={`tires.${position}.rating`}>Ocena (1-5)</Label>
          <Select
            onValueChange={(val: string | null) =>
              setValue(`tires.${position}.rating`, val ?? "", { shouldValidate: true })
            }
          >
            <SelectTrigger id={`tires.${position}.rating`}>
              <SelectValue placeholder="Wybierz ocenę" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} — {["Bardzo zła", "Zła", "Dostateczna", "Dobra", "Bardzo dobra"][n - 1]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tireErrors?.rating && (
            <p className="text-xs text-destructive">{tireErrors.rating.message}</p>
          )}
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor={`tires.${position}.notes`}>
            Uwagi{" "}
            <Badge variant="secondary" className="text-xs ml-1">
              opcjonalne
            </Badge>
          </Label>
          <Textarea
            id={`tires.${position}.notes`}
            placeholder="Dodatkowe obserwacje dotyczące opony..."
            rows={2}
            {...register(`tires.${position}.notes`)}
          />
        </div>
      </div>
    </div>
  );
}
