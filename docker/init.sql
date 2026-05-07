CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tire_reports (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  brand      TEXT NOT NULL,
  model      TEXT NOT NULL,
  year       TEXT,
  vin        TEXT NOT NULL,
  email      TEXT,
  tires      JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Default admin user: admin@motocontroler.pl / admin1234
-- Hash: bcryptjs $2b$12, cost 12
INSERT INTO users (email, name, password_hash)
VALUES (
  'admin@motocontroler.pl',
  'Administrator',
  '$2b$12$X0W5vsvslGOB32Wo3S2gtOSkg9d9qJmQb5a3/xL0mS.aN0VqwqNjy'
)
ON CONFLICT (email) DO NOTHING;
