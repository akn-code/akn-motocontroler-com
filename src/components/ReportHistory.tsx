"use client";

import { useState } from "react";
import { HistoryEntry, clearHistory } from "@/lib/history";
import { useI18n } from "@/lib/i18n-context";
import { Clock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportFormData } from "@/lib/schema";

function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

const POSITIONS = ["FL", "FR", "RL", "RR"] as const;

interface ReportModalProps {
  entry: HistoryEntry;
  onClose: () => void;
}

function TireRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-[#636c76] min-w-[100px] shrink-0">{label}</span>
      <span className="text-[#1f2328] font-medium">{value}</span>
    </div>
  );
}

function ReportModal({ entry, onClose }: ReportModalProps) {
  const { t, tArr, locale } = useI18n();
  const data: ReportFormData = entry.data;
  const ratings = tArr("ratings");

  const TIRE_LABEL_KEYS = {
    FL: "tireFL", FR: "tireFR", RL: "tireRL", RR: "tireRR",
  } as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-xl border border-[#d0d7de] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d0d7de] sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-[#1f2328]">
              {data.brand} {data.model}
              {data.year && <span className="text-[#636c76] font-normal ml-1.5">({data.year})</span>}
            </h2>
            <p className="text-xs text-[#636c76] mt-0.5">{formatDate(entry.sentAt, locale)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#f6f8fa] text-[#636c76] hover:text-[#1f2328] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Vehicle */}
          <section>
            <h3 className="text-xs font-semibold text-[#636c76] uppercase tracking-wide mb-2">{t("vehicle")}</h3>
            <div className="space-y-1.5">
              <TireRow label={t("vehicleBrand")} value={data.brand} />
              <TireRow label={t("vehicleModel")} value={data.model} />
              {data.year && <TireRow label={t("vehicleYear")} value={data.year} />}
              <TireRow label={t("vin")} value={data.vin} />
              {data.email && <TireRow label={t("email")} value={data.email} />}
            </div>
          </section>

          {/* Tires */}
          <section>
            <h3 className="text-xs font-semibold text-[#636c76] uppercase tracking-wide mb-3">{t("tiresSection")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {POSITIONS.map((pos) => {
                const tire = data.tires[pos];
                const ratingNum = tire.rating ? parseInt(tire.rating) : null;
                return (
                  <div key={pos} className="border border-[#d0d7de] rounded-md p-3 space-y-1.5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {pos}
                      </div>
                      <span className="font-medium text-sm text-[#1f2328]">{t(TIRE_LABEL_KEYS[pos])}</span>
                    </div>
                    <TireRow label={t("tireBrand")} value={tire.brand} />
                    <TireRow label={t("tireSize")} value={tire.size} />
                    <TireRow label={t("treadDepth")} value={tire.treadDepth ? `${tire.treadDepth} mm` : undefined} />
                    <TireRow label={t("dot")} value={tire.dot} />
                    {ratingNum && (
                      <div className="flex gap-2 text-sm">
                        <span className="text-[#636c76] min-w-[100px] shrink-0">{t("rating")}</span>
                        <span className="text-[#1f2328] font-medium">
                          {ratingNum} — {ratings[ratingNum - 1]}
                        </span>
                      </div>
                    )}
                    {tire.notes && (
                      <div className="pt-1 text-xs text-[#636c76] border-t border-[#d0d7de] mt-1">
                        {tire.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface ReportHistoryProps {
  entries: HistoryEntry[];
  onClear: () => void;
}

export function ReportHistory({ entries, onClear }: ReportHistoryProps) {
  const { t, locale } = useI18n();
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  function handleClear() { clearHistory(); onClear(); }

  if (entries.length === 0) return null;

  return (
    <>
      {selected && (
        <ReportModal entry={selected} onClose={() => setSelected(null)} />
      )}

      <div className="mt-6 bg-white border border-[#d0d7de] rounded-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#d0d7de]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1f2328]">
            <Clock className="w-4 h-4 text-[#636c76]" />
            {t("historyTitle")}
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear}
            className="text-xs text-[#636c76] hover:text-destructive gap-1">
            <Trash2 className="w-3.5 h-3.5" />
            {t("historyClear")}
          </Button>
        </div>

        <ul className="divide-y divide-[#d0d7de]">
          {entries.map((e) => (
            <li
              key={e.id}
              className="px-4 py-3 hover:bg-[#f6f8fa] cursor-pointer"
              onClick={() => e.data ? setSelected(e) : undefined}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-medium text-[#1f2328] text-sm">
                    {e.brand} {e.model}
                    {e.year && <span className="text-[#636c76] font-normal ml-1">({e.year})</span>}
                  </span>
                  <code className="block text-xs text-[#636c76] mt-0.5 truncate"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace' }}>
                    {e.vin}
                  </code>
                </div>
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <span className="text-xs text-[#636c76]">{formatDate(e.sentAt, locale)}</span>
                  {e.data && (
                    <Badge variant="secondary" className="text-xs">{t("historyView")}</Badge>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
