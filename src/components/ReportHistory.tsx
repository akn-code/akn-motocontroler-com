"use client";

import { useEffect, useState } from "react";
import { HistoryEntry, loadHistory, clearHistory } from "@/lib/history";
import { useI18n } from "@/lib/i18n-context";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

export function ReportHistory() {
  const { t, locale } = useI18n();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => { setEntries(loadHistory()); }, []);

  function handleClear() { clearHistory(); setEntries([]); }

  if (entries.length === 0) return null;

  return (
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
          <li key={e.id} className="px-4 py-3 hover:bg-[#f6f8fa]">
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
              <span className="text-xs text-[#636c76] shrink-0 pt-0.5">
                {formatDate(e.sentAt, locale)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
