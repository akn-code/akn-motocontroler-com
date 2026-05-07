import { describe, it, expect, beforeEach } from "vitest";
import { saveToHistory, loadHistory, clearHistory } from "@/lib/history";
import type { ReportFormData } from "@/lib/schema";

const makeReport = (vin: string, brand = "Toyota", model = "Corolla"): ReportFormData => ({
  brand,
  model,
  vin,
  email: "",
  tires: {
    FL: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
    FR: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
    RL: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
    RR: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
  },
});

describe("history — loadHistory", () => {
  beforeEach(() => clearHistory());

  it("returns empty array when nothing saved", () => {
    expect(loadHistory()).toEqual([]);
  });
});

describe("history — saveToHistory", () => {
  beforeEach(() => clearHistory());

  it("saves an entry and returns it on load", () => {
    saveToHistory(makeReport("1HGBH41JXMN109186"));
    const entries = loadHistory();
    expect(entries).toHaveLength(1);
    expect(entries[0].vin).toBe("1HGBH41JXMN109186");
    expect(entries[0].brand).toBe("Toyota");
    expect(entries[0].model).toBe("Corolla");
  });

  it("uppercases the VIN", () => {
    saveToHistory(makeReport("1hgbh41jxmn109186"));
    expect(loadHistory()[0].vin).toBe("1HGBH41JXmn109186".toUpperCase());
  });

  it("stores sentAt as valid ISO date", () => {
    saveToHistory(makeReport("1HGBH41JXMN109186"));
    const { sentAt } = loadHistory()[0];
    expect(new Date(sentAt).toISOString()).toBe(sentAt);
  });

  it("stores optional year when provided", () => {
    saveToHistory({ ...makeReport("1HGBH41JXMN109186"), year: "2020" });
    expect(loadHistory()[0].year).toBe("2020");
  });

  it("prepends new entries (newest first)", () => {
    saveToHistory(makeReport("1HGBH41JXMN109181", "Ford"));
    saveToHistory(makeReport("1HGBH41JXMN109182", "BMW"));
    const entries = loadHistory();
    expect(entries[0].brand).toBe("BMW");
    expect(entries[1].brand).toBe("Ford");
  });

  it("assigns unique ids to each entry", () => {
    saveToHistory(makeReport("1HGBH41JXMN109181"));
    saveToHistory(makeReport("1HGBH41JXMN109182"));
    const [a, b] = loadHistory();
    expect(a.id).not.toBe(b.id);
  });

  it("caps history at 50 entries", () => {
    for (let i = 0; i < 55; i++) {
      const vin = `1HGBH41JXMN10918${String(i).padStart(1, "0")}`.slice(0, 17).padEnd(17, "X");
      saveToHistory(makeReport(vin));
    }
    expect(loadHistory()).toHaveLength(50);
  });
});

describe("history — clearHistory", () => {
  it("removes all entries", () => {
    saveToHistory(makeReport("1HGBH41JXMN109186"));
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});
