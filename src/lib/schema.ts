import { z } from "zod";

const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
const dotRegex = /^(0[1-9]|[1-4][0-9]|5[0-2])\d{2}$/;

const tireSchema = z.object({
  brand: z.string().min(1, "Marka opony jest wymagana"),
  size: z
    .string()
    .min(1, "Rozmiar jest wymagany")
    .regex(/^\d{3}\/\d{2}\s?R\d{2}$/, "Format: 205/55 R16"),
  treadDepth: z
    .string()
    .min(1, "Głębokość bieżnika jest wymagana")
    .refine(
      (v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 14,
      "Podaj wartość w mm (0–14)"
    ),
  dot: z
    .string()
    .min(1, "DOT jest wymagany")
    .regex(dotRegex, "Format DOT: TTRR (tydzień 01-52 + rok, np. 2123)")
    .refine((v) => {
      const year = 2000 + parseInt(v.slice(2), 10);
      return year <= new Date().getFullYear();
    }, "Rok produkcji nie może być z przyszłości"),
  rating: z
    .string()
    .min(1, "Ocena jest wymagana")
    .refine((v) => ["1", "2", "3", "4", "5"].includes(v), "Wybierz ocenę 1-5"),
  notes: z.string().optional(),
});

export const reportSchema = z.object({
  brand: z.string().min(1, "Marka pojazdu jest wymagana"),
  model: z.string().min(1, "Model pojazdu jest wymagany"),
  year: z.string().optional(),
  vin: z
    .string()
    .length(17, "VIN musi mieć dokładnie 17 znaków")
    .regex(vinRegex, "VIN zawiera niedozwolone znaki (I, O, Q są zabronione)"),
  email: z.string().email("Nieprawidłowy format e-mail").optional().or(z.literal("")),
  tires: z.object({
    FL: tireSchema,
    FR: tireSchema,
    RL: tireSchema,
    RR: tireSchema,
  }),
});

export type ReportFormData = z.infer<typeof reportSchema>;
export type TireData = z.infer<typeof tireSchema>;

export const TREAD_WARNING_THRESHOLD = 3;
export const TREAD_LEGAL_MINIMUM = 1.6;

export function getTreadWarning(depth: string): "legal" | "low" | null {
  const val = parseFloat(depth);
  if (isNaN(val)) return null;
  if (val < TREAD_LEGAL_MINIMUM) return "legal";
  if (val < TREAD_WARNING_THRESHOLD) return "low";
  return null;
}

export const TIRE_BRANDS = [
  "Bridgestone",
  "Continental",
  "Dunlop",
  "Falken",
  "Firestone",
  "Goodyear",
  "Hankook",
  "Kumho",
  "Maxxis",
  "Michelin",
  "Nexen",
  "Nokian",
  "Pirelli",
  "Toyo",
  "Uniroyal",
  "Yokohama",
  "Inna",
] as const;

export const CURRENT_YEAR = new Date().getFullYear();
export const VEHICLE_YEARS = Array.from(
  { length: CURRENT_YEAR - 1979 },
  (_, i) => String(CURRENT_YEAR - i)
);
