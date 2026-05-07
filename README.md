# Motocontroler — Formularz Raportu Opon

Webowy formularz dla rzeczoznawców do rejestrowania raportów opon badanych pojazdów. Wymaga logowania. Dostępny w języku polskim i angielskim, zoptymalizowany pod urządzenia mobilne.

## Wymagania

- [Docker](https://docs.docker.com/get-docker/) i Docker Compose v2

## Uruchomienie (Docker Compose)

```bash
# 1. Sklonuj repozytorium
git clone <repo-url>
cd akn-motocontroler-com

# 2. Zbuduj i uruchom
docker compose up --build
```

Aplikacja: `http://localhost:4321`

Przy pierwszym uruchomieniu Docker automatycznie:
- pobiera obraz `postgres:16-alpine`
- tworzy tabele `tire_reports` i `users` z pliku `init.sql`
- tworzy domyślne konto administratora
- buduje obraz Next.js i czeka na gotowość bazy przed startem

### Pozostałe komendy

```bash
# Uruchomienie w tle
docker compose up --build -d

# Zatrzymanie
docker compose down

# Zatrzymanie i usunięcie danych (wolumen Postgres)
docker compose down -v

# Przebudowanie po zmianach w kodzie
docker compose up --build
```

---

## Uruchomienie bez Dockera (tryb deweloperski)

Wymaga Node.js 20+ i dostępu do PostgreSQL.

```bash
# Uruchom tylko bazę danych
docker compose up db -d

# Skopiuj i uzupełnij zmienne środowiskowe
cp .env.local.example .env.local

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja: `http://localhost:3000`

---

## Logowanie

Formularz jest chroniony — dostęp wymaga zalogowania.

Domyślne konto (tworzone przez `init.sql`):

| E-mail | Hasło |
|---|---|
| `admin@motocontroler.pl` | `admin1234` |

> **Zmień hasło przed wdrożeniem produkcyjnym.**  
> Nowe konta można dodać bezpośrednio do tabeli `users` (hasło musi być zahashowane bcryptem, koszt 12).

---

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Stylizacja | Tailwind CSS + shadcn/ui (GitHub-style) |
| Formularz | react-hook-form + Zod |
| Uwierzytelnianie | NextAuth v5 (Credentials, JWT) |
| i18n | Własny context (PL / EN) |
| API | Next.js Route Handlers |
| Baza danych | PostgreSQL 16 |
| Konteneryzacja | Docker Compose (dev) · Docker Swarm (prod) |
| Testy | Vitest + Testing Library |
| CI/CD | GitHub Actions → GHCR |

---

## Funkcje

- **Formularz wieloetapowy** — zakładki: Pojazd → FL → FR → RL → RR
- **Selecty** — marka pojazdu, marka opony, rozmiar opony (szerokość / profil / felga), rocznik, ocena
- **Walidacja w czasie rzeczywistym** — VIN, DOT, głębokość bieżnika
- **Ostrzeżenia bieżnika** — żółte (< 3 mm), czerwone (< 1,6 mm), nie blokują wysyłki
- **Historia** — ostatnie raporty przechowywane w localStorage, widoczne pod formularzem
- **Multilanguage** — przełącznik PL/EN w headerze, domyślnie polski
- **Mobile-first** — touch targets ≥ 44 px, pełnowymiarowe przyciski, responsywny układ

---

## Schemat bazy danych

Obie tabele tworzone automatycznie przez [`init.sql`](init.sql).

```sql
CREATE TABLE tire_reports (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  brand      TEXT NOT NULL,
  model      TEXT NOT NULL,
  year       TEXT,
  vin        TEXT NOT NULL,
  email      TEXT,
  tires      JSONB NOT NULL        -- dane 4 opon (FL, FR, RL, RR)
);

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  password_hash TEXT NOT NULL,     -- bcrypt, koszt 12
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Zmienne środowiskowe

| Zmienna | Opis | Wymagana |
|---|---|---|
| `DATABASE_URL` | Connection string PostgreSQL | tak |
| `AUTH_SECRET` | Klucz sesji NextAuth (min. 32 znaki) | tak |
| `AUTH_TRUST_HOST` | Ustaw `true` za reverse proxy / w Dockerze | zalecana |

Przy uruchomieniu przez `docker compose` zmienne są ustawiane automatycznie.  
W trybie deweloperskim skopiuj `.env.local.example` → `.env.local` i uzupełnij wartości.

Generowanie `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## Walidacje formularza

| Pole | Reguła |
|---|---|
| VIN | Dokładnie 17 znaków, bez liter I, O, Q |
| DOT | 4 cyfry TTRR — tydzień (01–52) + rok, np. `2123` |
| Rozmiar opony | Wybór z list: szerokość / profil / felga → `205/55 R16` |
| Głębokość bieżnika | Ostrzeżenie przy < 3 mm · alert przy < 1,6 mm (nie blokuje) |
| Ocena | 1–5 (wymagana) |

---

## Testy

```bash
npm test                # jednorazowe uruchomienie
npm run test:watch      # tryb watch
npm run test:coverage   # raport pokrycia
```

Struktura testów:

```
src/__tests__/
  unit/
    schema.test.ts      # walidacja Zod — VIN, DOT, rozmiar, email, getTreadWarning
    history.test.ts     # localStorage — save / load / clear / cap 50
    i18n.test.ts        # kompletność tłumaczeń PL/EN
  integration/
    api-reports.test.ts # POST /api/reports (pg mockowane)
```

---

## CI/CD (GitHub Actions)

Pipeline w [`.github/workflows/ci.yml`](.github/workflows/ci.yml) uruchamia się przy każdym push i PR do `main`:

1. **test** — Vitest na Node 20 i 22 (matrix)
2. **build** — `next build` + budowa i push obrazu Docker do **GitHub Container Registry** (`ghcr.io`)

Obraz jest tagowany jako `latest` (na `main`) oraz `sha-<commit>`.

---

## Wdrożenie produkcyjne (Docker Swarm)

Konfiguracja w [`docker-stack.yml`](docker-stack.yml).

```bash
# 1. Utwórz sekrety (raz na klaster)
echo "haslo-bazy" | docker secret create db_password -
openssl rand -base64 32 | docker secret create auth_secret -

# 2. Wdrożenie
APP_IMAGE=ghcr.io/<org>/akn-motocontroler-com:latest \
  docker stack deploy -c docker-stack.yml motocontroler

# 3. Aktualizacja do nowej wersji
docker service update \
  --image ghcr.io/<org>/akn-motocontroler-com:sha-<commit> \
  motocontroler_app
```

Swarm uruchamia **2 repliki** aplikacji z rolling update (start-first, auto-rollback przy awarii).  
Baza danych na manager node z persystentnym wolumenem.  
Healthcheck: `GET /api/health` — weryfikuje połączenie z PostgreSQL.

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.  
Commercial use is strictly prohibited without explicit permission. See the [LICENSE](LICENSE) file for details.
