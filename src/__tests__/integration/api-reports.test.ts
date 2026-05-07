import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/reports/route";
import { NextRequest } from "next/server";

// Mock the pg pool — keeps tests isolated from a real database
vi.mock("@/lib/db", () => ({
  default: {
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
  },
}));

import pool from "@/lib/db";
const mockQuery = vi.mocked(pool.query);

const validPayload = {
  brand: "Toyota",
  model: "Corolla",
  vin: "1HGBH41JXMN109186",
  email: "",
  tires: {
    FL: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
    FR: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
    RL: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
    RR: { brand: "Michelin", size: "205/55 R16", treadDepth: "5", dot: "2123", rating: "4" },
  },
};

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/reports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.mockResolvedValue({ rows: [], rowCount: 1 } as never);
  });

  // --- Happy path ---

  it("returns 201 for a valid payload", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("calls pool.query exactly once", async () => {
    await POST(makeRequest(validPayload));
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  // INSERT params order: [brand(0), model(1), year(2), vin(3), email(4), tires(5)]

  it("inserts VIN in uppercase (VIN is $4, index 3)", async () => {
    // Schema requires uppercase — send valid uppercase VIN and verify it passes through
    await POST(makeRequest(validPayload));
    const params = mockQuery.mock.calls[0][1] as unknown[];
    expect(params[3]).toBe("1HGBH41JXMN109186");
  });

  it("stores null when email is empty", async () => {
    await POST(makeRequest({ ...validPayload, email: "" }));
    const params = mockQuery.mock.calls[0][1] as unknown[];
    expect(params[4]).toBeNull();
  });

  it("stores email when provided", async () => {
    await POST(makeRequest({ ...validPayload, email: "test@example.com" }));
    const params = mockQuery.mock.calls[0][1] as unknown[];
    expect(params[4]).toBe("test@example.com");
  });

  it("stores optional year when provided", async () => {
    await POST(makeRequest({ ...validPayload, year: "2020" }));
    const params = mockQuery.mock.calls[0][1] as unknown[];
    expect(params[2]).toBe("2020");
  });

  it("stores null for year when absent", async () => {
    await POST(makeRequest(validPayload));
    const params = mockQuery.mock.calls[0][1] as unknown[];
    expect(params[2]).toBeNull();
  });

  // --- Validation errors ---

  it("returns 422 for missing brand", async () => {
    const { brand: _, ...rest } = validPayload;
    const res = await POST(makeRequest(rest));
    expect(res.status).toBe(422);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("returns 422 for invalid VIN (too short)", async () => {
    const res = await POST(makeRequest({ ...validPayload, vin: "SHORT" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for VIN containing forbidden letter I", async () => {
    const res = await POST(makeRequest({ ...validPayload, vin: "1HGBH41JIMIN109186" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for invalid DOT", async () => {
    const badTires = {
      ...validPayload.tires,
      FL: { ...validPayload.tires.FL, dot: "9999" },
    };
    const res = await POST(makeRequest({ ...validPayload, tires: badTires }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for invalid tire size format", async () => {
    const badTires = {
      ...validPayload.tires,
      FL: { ...validPayload.tires.FL, size: "invalid" },
    };
    const res = await POST(makeRequest({ ...validPayload, tires: badTires }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for missing tire rating", async () => {
    const badTires = {
      ...validPayload.tires,
      RR: { ...validPayload.tires.RR, rating: "" },
    };
    const res = await POST(makeRequest({ ...validPayload, tires: badTires }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for malformed email", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "notanemail" }));
    expect(res.status).toBe(422);
  });

  // --- Malformed request ---

  it("returns 400 for non-JSON body", async () => {
    const req = new NextRequest("http://localhost/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json{{",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // --- Database error ---

  it("propagates database errors", async () => {
    mockQuery.mockRejectedValueOnce(new Error("connection refused") as never);
    await expect(POST(makeRequest(validPayload))).rejects.toThrow("connection refused");
  });
});
