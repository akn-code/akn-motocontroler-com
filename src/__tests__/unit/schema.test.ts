import { describe, it, expect } from "vitest";
import { reportSchema, getTreadWarning } from "@/lib/schema";

// ---------------------------------------------------------------------------
// VIN validation
// ---------------------------------------------------------------------------
describe("reportSchema — VIN", () => {
  const base = {
    brand: "Toyota",
    model: "Corolla",
    vin: "1HGBH41JXMN109186",
    tires: {
      FL: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
      FR: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
      RL: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
      RR: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
    },
  };

  it("accepts a valid 17-char VIN", () => {
    expect(reportSchema.safeParse(base).success).toBe(true);
  });

  it("rejects VIN shorter than 17 chars", () => {
    const result = reportSchema.safeParse({ ...base, vin: "1HGBH41J" });
    expect(result.success).toBe(false);
  });

  it("rejects VIN with forbidden letter I", () => {
    const result = reportSchema.safeParse({ ...base, vin: "1HGBH41JIMIN109186" });
    expect(result.success).toBe(false);
  });

  it("rejects VIN with forbidden letter O", () => {
    const result = reportSchema.safeParse({ ...base, vin: "1HGBH41JOMN1091O6" });
    expect(result.success).toBe(false);
  });

  it("rejects VIN with forbidden letter Q", () => {
    const result = reportSchema.safeParse({ ...base, vin: "1HGBH41JQMN109186" });
    expect(result.success).toBe(false);
  });

  it("rejects VIN longer than 17 chars", () => {
    const result = reportSchema.safeParse({ ...base, vin: "1HGBH41JXMN109186X" });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// DOT validation
// ---------------------------------------------------------------------------
describe("reportSchema — DOT", () => {
  const validTire = { brand: "Michelin", size: "205/55 R16", treadDepth: "5", rating: "4" };
  const base = {
    brand: "Toyota",
    model: "Corolla",
    vin: "1HGBH41JXMN109186",
    tires: {
      FL: { ...validTire, dot: "2123" },
      FR: { ...validTire, dot: "2123" },
      RL: { ...validTire, dot: "2123" },
      RR: { ...validTire, dot: "2123" },
    },
  };

  it("accepts DOT 2123 (week 21, year 23)", () => {
    expect(reportSchema.safeParse(base).success).toBe(true);
  });

  it("accepts DOT 0124 (week 01, year 24)", () => {
    const data = { ...base, tires: { ...base.tires, FL: { ...validTire, dot: "0124" } } };
    expect(reportSchema.safeParse(data).success).toBe(true);
  });

  it("rejects DOT with week 00", () => {
    const data = { ...base, tires: { ...base.tires, FL: { ...validTire, dot: "0023" } } };
    expect(reportSchema.safeParse(data).success).toBe(false);
  });

  it("rejects DOT with week 53", () => {
    const data = { ...base, tires: { ...base.tires, FL: { ...validTire, dot: "5323" } } };
    expect(reportSchema.safeParse(data).success).toBe(false);
  });

  it("rejects DOT with 3 digits", () => {
    const data = { ...base, tires: { ...base.tires, FL: { ...validTire, dot: "213" } } };
    expect(reportSchema.safeParse(data).success).toBe(false);
  });

  it("rejects DOT with letters", () => {
    const data = { ...base, tires: { ...base.tires, FL: { ...validTire, dot: "21AB" } } };
    expect(reportSchema.safeParse(data).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tire size validation
// ---------------------------------------------------------------------------
describe("reportSchema — tire size", () => {
  const validTire = { brand: "Michelin", treadDepth: "5", dot: "2123", rating: "4" };
  const base = {
    brand: "Toyota", model: "Corolla", vin: "1HGBH41JXMN109186",
    tires: {
      FL: { ...validTire, size: "205/55 R16" },
      FR: { ...validTire, size: "205/55 R16" },
      RL: { ...validTire, size: "205/55 R16" },
      RR: { ...validTire, size: "205/55 R16" },
    },
  };

  it("accepts 205/55 R16", () => expect(reportSchema.safeParse(base).success).toBe(true));
  it("accepts 225/45 R18", () => {
    const d = { ...base, tires: { ...base.tires, FL: { ...validTire, size: "225/45 R18" } } };
    expect(reportSchema.safeParse(d).success).toBe(true);
  });
  it("rejects size without R prefix", () => {
    const d = { ...base, tires: { ...base.tires, FL: { ...validTire, size: "205/55/16" } } };
    expect(reportSchema.safeParse(d).success).toBe(false);
  });
  it("rejects empty size", () => {
    const d = { ...base, tires: { ...base.tires, FL: { ...validTire, size: "" } } };
    expect(reportSchema.safeParse(d).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Email — optional
// ---------------------------------------------------------------------------
describe("reportSchema — email", () => {
  const base = {
    brand: "Toyota", model: "Corolla", vin: "1HGBH41JXMN109186",
    tires: {
      FL: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
      FR: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
      RL: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
      RR: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
    },
  };

  it("accepts missing email", () => expect(reportSchema.safeParse(base).success).toBe(true));
  it("accepts empty string email", () => expect(reportSchema.safeParse({ ...base, email: "" }).success).toBe(true));
  it("accepts valid email", () => expect(reportSchema.safeParse({ ...base, email: "a@b.pl" }).success).toBe(true));
  it("rejects malformed email", () => expect(reportSchema.safeParse({ ...base, email: "notanemail" }).success).toBe(false));
});

// ---------------------------------------------------------------------------
// getTreadWarning
// ---------------------------------------------------------------------------
describe("getTreadWarning", () => {
  it("returns null for empty string", () => expect(getTreadWarning("")).toBeNull());
  it("returns null for non-numeric", () => expect(getTreadWarning("abc")).toBeNull());
  it("returns null for depth >= 3 mm", () => expect(getTreadWarning("3")).toBeNull());
  it("returns null for depth > 3 mm", () => expect(getTreadWarning("5.5")).toBeNull());
  it("returns 'low' for depth between 1.6 and 3 mm", () => {
    expect(getTreadWarning("2.9")).toBe("low");
    expect(getTreadWarning("1.7")).toBe("low");
  });
  it("returns 'legal' for depth below 1.6 mm", () => {
    expect(getTreadWarning("1.5")).toBe("legal");
    expect(getTreadWarning("0")).toBe("legal");
  });
  it("boundary: exactly 1.6 mm returns 'low'", () => expect(getTreadWarning("1.6")).toBe("low"));
  it("boundary: exactly 3.0 mm returns null", () => expect(getTreadWarning("3.0")).toBeNull());
});
