CREATE TABLE IF NOT EXISTS tire_reports (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  brand      TEXT NOT NULL,
  model      TEXT NOT NULL,
  vin        TEXT NOT NULL,
  email      TEXT,
  tires      JSONB NOT NULL
);
