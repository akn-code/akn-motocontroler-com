"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, ReportFormData } from "@/lib/schema";
import { VehicleSection } from "./VehicleSection";
import { TireSection } from "./TireSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Loader2, RotateCcw, Send } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

const TIRE_POSITIONS = ["FL", "FR", "RL", "RR"] as const;

const TIRE_LABELS_SHORT: Record<string, string> = {
  FL: "P-L",
  FR: "P-P",
  RL: "T-L",
  RR: "T-P",
};

export function TireReportForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState("vehicle");

  const methods = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    mode: "onTouched",
    defaultValues: {
      brand: "",
      model: "",
      vin: "",
      email: "",
      tires: {
        FL: { brand: "", size: "", treadDepth: "", dot: "", rating: "", notes: "" },
        FR: { brand: "", size: "", treadDepth: "", dot: "", rating: "", notes: "" },
        RL: { brand: "", size: "", treadDepth: "", dot: "", rating: "", notes: "" },
        RR: { brand: "", size: "", treadDepth: "", dot: "", rating: "", notes: "" },
      },
    },
  });

  const { handleSubmit, reset } = methods;

  async function onSubmit(data: ReportFormData) {
    setFormState("loading");
    setErrorMessage("");

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setErrorMessage(json.error ?? "Wystąpił błąd podczas wysyłania raportu.");
      setFormState("error");
    } else {
      setFormState("success");
    }
  }

  function handleReset() {
    reset();
    setFormState("idle");
    setErrorMessage("");
    setActiveTab("vehicle");
  }

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Raport wysłany!</h2>
          <p className="text-muted-foreground max-w-sm">
            Dziękujemy. Raport opon został pomyślnie zapisany w systemie Motocontroler.
          </p>
        </div>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Dodaj kolejny raport
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="vehicle" className="text-xs sm:text-sm">
              Pojazd
            </TabsTrigger>
            {TIRE_POSITIONS.map((pos) => (
              <TabsTrigger key={pos} value={pos} className="text-xs sm:text-sm">
                <span className="sm:hidden">{TIRE_LABELS_SHORT[pos]}</span>
                <span className="hidden sm:inline">{pos}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="vehicle">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Dane pojazdu
              </h2>
              <VehicleSection />
              <div className="flex justify-end pt-2">
                <Button type="button" onClick={() => setActiveTab("FL")}>
                  Dalej: Opony
                </Button>
              </div>
            </div>
          </TabsContent>

          {TIRE_POSITIONS.map((pos, idx) => (
            <TabsContent key={pos} value={pos}>
              <div className="space-y-4">
                <TireSection position={pos} />
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setActiveTab(idx === 0 ? "vehicle" : TIRE_POSITIONS[idx - 1])
                    }
                  >
                    Wstecz
                  </Button>
                  {idx < TIRE_POSITIONS.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setActiveTab(TIRE_POSITIONS[idx + 1])}
                    >
                      Dalej
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={formState === "loading"}
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      {formState === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Wysyłanie...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Wyślij raport
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {formState === "error" && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <strong>Błąd:</strong> {errorMessage}
          </div>
        )}
      </form>
    </FormProvider>
  );
}
