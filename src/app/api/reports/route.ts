import { NextRequest, NextResponse } from "next/server";
import { reportSchema } from "@/lib/schema";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy JSON." }, { status: 400 });
  }

  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Błąd walidacji.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { brand, model, vin, email, tires } = parsed.data;

  await pool.query(
    `INSERT INTO tire_reports (brand, model, vin, email, tires)
     VALUES ($1, $2, $3, $4, $5)`,
    [brand, model, vin.toUpperCase(), email || null, JSON.stringify(tires)]
  );

  return NextResponse.json({ success: true }, { status: 201 });
}
