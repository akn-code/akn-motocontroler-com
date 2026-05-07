import { ReportFormData } from "./schema";

export interface HistoryEntry {
  id: string;
  sentAt: string;
  brand: string;
  model: string;
  year?: string;
  vin: string;
}

const STORAGE_KEY = "motocontroler_report_history";
const MAX_ENTRIES = 50;

export function saveToHistory(data: ReportFormData): void {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    sentAt: new Date().toISOString(),
    brand: data.brand,
    model: data.model,
    year: data.year,
    vin: data.vin.toUpperCase(),
  };

  const existing = loadHistory();
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
