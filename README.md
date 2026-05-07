# Motocontroler — Formularz Raportu Opon

Publiczny formularz webowy dla rzeczoznawców do rejestrowania raportów opon badanych pojazdów.

## Wymagania

- [Docker](https://docs.docker.com/get-docker/) i Docker Compose v2

## Uruchomienie

```bash
# 1. Sklonuj repozytorium
git clone <repo-url>
cd akn-motocontroler-com

# 2. Zbuduj i uruchom
docker compose up --build
```

Aplikacja działa pod `http://localhost:4321`.

Przy pierwszym uruchomieniu Docker automatycznie:
- pobiera obraz `postgres:16-alpine`,
- tworzy bazę danych i tabelę `tire_reports` z pliku `init.sql`,
- buduje obraz Next.js i czeka na gotowość bazy przed startem.

### Uruchamianie w tle

```bash
docker compose up --build -d
```

### Zatrzymanie

```bash
docker compose down
```

Dane Postgresa są przechowywane w wolumenie Docker (`postgres_data`) i przetrwają restart kontenerów. Aby usunąć też dane:

```bash
docker compose down -v
```

### Przebudowanie po zmianach w kodzie

```bash
docker compose up --build
```

---

## Uruchomienie bez Dockera (tryb deweloperski)

Wymaga Node.js 20+ oraz lokalnej instancji PostgreSQL lub uruchomienia samej bazy przez Docker.

```bash
# Uruchom tylko PostgreSQL
docker compose up db -d

# Skopiuj i uzupełnij zmienne środowiskowe
cp .env.local.example .env.local

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja: `http://localhost:4321`

---

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Stylizacja | Tailwind CSS + shadcn/ui |
| Formularz | react-hook-form + Zod |
| API | Next.js Route Handler `POST /api/reports` |
| Baza danych | PostgreSQL 16 |
| Konteneryzacja | Docker + Docker Compose |

## Schemat bazy danych

Tabela `tire_reports` tworzona automatycznie przez [init.sql](init.sql):

```sql
CREATE TABLE tire_reports (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  brand      TEXT NOT NULL,
  model      TEXT NOT NULL,
  vin        TEXT NOT NULL,
  email      TEXT,
  tires      JSONB NOT NULL   -- dane 4 opon (FL, FR, RL, RR)
);
```

## Zmienne środowiskowe

| Zmienna | Opis | Wartość domyślna (Docker) |
|---|---|---|
| `DATABASE_URL` | Connection string PostgreSQL | `postgres://motocontroler:motocontroler@localhost:6543/motocontroler` |

Przy uruchomieniu przez `docker compose` zmienna jest ustawiana automatycznie. W trybie deweloperskim skopiuj `.env.local.example` do `.env.local`.

## Walidacje formularza

| Pole | Reguła |
|---|---|
| VIN | Dokładnie 17 znaków, bez liter I, O, Q |
| DOT | 4 cyfry TTRR — tydzień (01–52) + rok, np. `2123` |
| Głębokość bieżnika | Ostrzeżenie przy < 3 mm, alert przy < 1,6 mm (nie blokuje wysyłki) |
| Rozmiar opony | Format `205/55 R16` |
| Ocena | 1–5 (wymagana) |

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**. 
Commercial use of this software is strictly prohibited without explicit permission. See the [LICENSE](LICENSE) file for details.
