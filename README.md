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
docker compose -f docker/docker-compose.yml up --build
```

Aplikacja: `http://localhost:4321`

Przy pierwszym uruchomieniu Docker automatycznie:
- pobiera obraz `postgres:16-alpine`
- tworzy tabele `tire_reports` i `users` z pliku `docker/init.sql`
- tworzy domyślne konto administratora
- buduje obraz Next.js i czeka na gotowość bazy przed startem

### Pozostałe komendy

```bash
# Uruchomienie w tle
docker compose -f docker/docker-compose.yml up --build -d

# Zatrzymanie
docker compose -f docker/docker-compose.yml down

# Zatrzymanie i usunięcie danych (wolumen Postgres)
docker compose -f docker/docker-compose.yml down -v

# Przebudowanie po zmianach w kodzie
docker compose -f docker/docker-compose.yml up --build
```

---

## Uruchomienie bez Dockera (tryb deweloperski)

Wymaga Node.js 22+ i dostępu do PostgreSQL.

```bash
# Uruchom tylko bazę danych
docker compose -f docker/docker-compose.yml up db -d

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

Domyślne konto (tworzone przez `docker/init.sql`):

| E-mail | Hasło |
|---|---|
| `admin@motocontroler.pl` | `admin1234` |

> **Zmień hasło przed wdrożeniem produkcyjnym.**
> Użyj skryptu `scripts/change-password.sh` lub dodaj konta bezpośrednio do tabeli `users` (hasło musi być zahashowane bcryptem, koszt 12).

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
- **Selecty** — marka pojazdu (+ własna), marka opony, rozmiar opony (szerokość / profil / felga), rocznik, ocena
- **Kopiowanie danych opony** — przyciski kopiowania między kołami (FL/FR/RL/RR)
- **Walidacja w czasie rzeczywistym** — VIN, DOT, głębokość bieżnika
- **Ostrzeżenia bieżnika** — żółte (< 3 mm), czerwone (< 1,6 mm), nie blokują wysyłki
- **Historia** — ostatnie raporty przechowywane w localStorage, widoczne pod formularzem
- **Multilanguage** — przełącznik PL/EN w headerze, domyślnie polski
- **Mobile-first** — touch targets ≥ 44 px, pełnowymiarowe przyciski, responsywny układ

---

## Struktura plików

```
├── Dockerfile
├── docker/
│   ├── docker-compose.yml   # lokalne uruchomienie (dev)
│   ├── docker-stack.yml     # Docker Swarm (prod)
│   ├── docker-entrypoint.sh # obsługa sekretów Swarm
│   ├── init.sql             # schemat bazy + domyślny admin
│   └── nginx.conf           # przykładowy config reverse proxy
└── scripts/
    ├── deploy.sh            # budowanie i deploy na Swarm
    └── change-password.sh   # zmiana hasła użytkownika
```

---

## Schemat bazy danych

Obie tabele tworzone automatycznie przez [`docker/init.sql`](docker/init.sql).

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
| `AUTH_URL` | Publiczny URL aplikacji (np. `https://example.com`) | zalecana |
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

1. **test** — Vitest na Node 22 i 24 (matrix)
2. **build** — `next build` + budowa i push obrazu Docker do **GitHub Container Registry** (`ghcr.io`)

Obraz jest tagowany jako `latest` (na `main`) oraz `sha-<commit>`.

---

## Wdrożenie produkcyjne (Docker Swarm)

Konfiguracja w [`docker/docker-stack.yml`](docker/docker-stack.yml).

```bash
# 1. Inicjalizacja Swarm (raz)
docker swarm init

# 2. Wdrożenie (tworzy sekrety interaktywnie przy pierwszym uruchomieniu)
./scripts/deploy.sh

# 3. Zmiana hasła użytkownika
./scripts/change-password.sh
```

Skrypt `deploy.sh` automatycznie:
- tworzy sekrety (`auth_secret` generowany losowo, `db_password` podawany interaktywnie)
- buduje obraz lokalnie
- wdraża lub aktualizuje stack

Swarm uruchamia **2 repliki** aplikacji z rolling update (start-first, auto-rollback przy awarii).  
Baza danych na manager node z persystentnym wolumenem.

### Nginx (reverse proxy)

Przykładowy config w [`docker/nginx.conf`](docker/nginx.conf). Po instalacji:

```bash
sudo cp docker/nginx.conf /etc/nginx/sites-available/motocontroler
sudo ln -s /etc/nginx/sites-available/motocontroler /etc/nginx/sites-enabled/
# zmień example.com na swoją domenę
sudo nginx -t && sudo systemctl reload nginx

# SSL przez certbot
sudo certbot --nginx -d example.com
```

---

## Decyzje techniczne

### Wybór technologii

| Wybór | Uzasadnienie |
|---|---|
| **Next.js 16 (App Router)** | Pozwala łączyć Server Components z Client Components w jednym projekcie. Server Components obsługują auth i dostęp do bazy bez ekspozycji credentials na klienta; Client Components renderują interaktywny formularz. |
| **PostgreSQL zamiast Supabase/SQLite** | Pełna kontrola nad danymi i schematem, możliwość uruchomienia lokalnie przez Docker bez zewnętrznych zależności. JSONB na opony pozwala przechowywać dane 4 kół elastycznie bez osobnych tabel. |
| **NextAuth v5 (Credentials + JWT)** | JWT sessions są bezstanowe — brak potrzeby tabeli sesji w bazie. Credentials provider pozwala uwierzytelniać przez własną tabelę `users` z bcrypt. |
| **react-hook-form + Zod** | react-hook-form minimalizuje re-rendery przy dużych formularzach (ważne przy 4 zakładkach opon). Zod zapewnia jeden schemat walidacji reużywany zarówno po stronie klienta jak i w API route, eliminując duplikację. |
| **Tailwind CSS + shadcn/ui** | shadcn/ui dostarcza komponenty jako kod (nie pakiet) — można je dowolnie modyfikować bez overrideów. Tailwind eliminuje potrzebę osobnych plików CSS. |
| **Własny i18n zamiast biblioteki** | Aplikacja wymaga tylko PL/EN, słownik jest prosty i typowany. Zewnętrzne biblioteki (next-intl, react-i18next) wniosłyby istotny narzut konfiguracyjny bez wymiernych korzyści przy tym rozmiarze projektu. |
| **Docker Swarm zamiast Kubernetes** | Pojedynczy serwer VPS. Swarm jest wbudowany w Docker, nie wymaga dodatkowej infrastruktury, obsługuje rolling updates i sekrety out-of-the-box. |

### Bezpieczeństwo danych

- **Uwierzytelnianie** — każda strona i każde API route jest chronione przez NextAuth. Proxy (`src/proxy.ts`) blokuje dostęp do wszystkich ścieżek bez ważnej sesji JWT.
- **Hasła** — przechowywane jako hash bcrypt (koszt 12). Nigdy nie są logowane ani zwracane przez API.
- **Sekrety produkcyjne** — `AUTH_SECRET` i hasło bazy trafiają do kontenera przez Docker Swarm secrets (montowane jako pliki w `/run/secrets/`), nigdy jako zmienne środowiskowe w pliku compose.
- **SQL injection** — zapytania do bazy wyłącznie przez parametryzowane query (`$1, $2, ...`), nigdy interpolacja stringów.
- **Walidacja** — dane wejściowe walidowane Zodem zarówno na froncie (UX) jak i w API route (bezpieczeństwo). Frontend nie jest zaufanym źródłem.
- **HTTPS** — wymagane w produkcji przez nginx + certbot (Let's Encrypt). `AUTH_TRUST_HOST: true` pozwala NextAuth poprawnie odczytać nagłówki proxy.
- **Dane lokalne** — historia raportów w localStorage to wyłącznie kopia dla UX rzeczoznawcy. Źródłem prawdy jest baza PostgreSQL.

### Struktura danych

Dane 4 opon przechowywane jako `JSONB` w jednym wierszu tabeli `tire_reports`. Alternatywą byłaby osobna tabela `tire_report_items` z kluczem obcym — wybrałem JSONB bo:
- raport zawsze ma dokładnie 4 koła (FL/FR/RL/RR), relacja 1:4 jest stała
- JSONB pozwala odpytywać i filtrować po polach opon w PostgreSQL gdy zajdzie potrzeba
- upraszcza INSERT do jednego zapytania bez transakcji

### Budowa formularza

Formularz wieloetapowy (Tabs) zamiast jednej długiej strony — na telefonie widok pojedynczej zakładki mieści się bez scrollowania. `react-hook-form` z `FormProvider` pozwala komponentom zakładek (`TireSection`, `VehicleSection`) bezpośrednio rejestrować pola bez props drilling. Selects są controlled (z `value` prop) żeby poprawnie odtwarzać wartości przy przełączaniu zakładek, które React unmountuje.

---

## Co zrobiłbym inaczej na produkcji

- **Zarządzanie użytkownikami przez UI** — dodanie panelu admina do tworzenia/usuwania kont zamiast ręcznego psql.
- **Paginacja i wyszukiwanie raportów** — historia w localStorage (max 50) to uproszczenie; docelowo widok raportów powinien pobierać dane z API z filtrowaniem po VIN, dacie, marce.
- **Eksport PDF** — rzeczoznawcy prawdopodobnie potrzebują wydruku raportu; dodałbym generowanie PDF po stronie serwera (np. Puppeteer lub react-pdf).
- **Rate limiting** — API route `/api/reports` nie ma limitu zapytań; w produkcji dodałbym middleware z rate limitingiem per użytkownik.
- **Testy E2E** — obecne testy jednostkowe i integracyjne sprawdzają logikę; brakuje testów Playwright/Cypress weryfikujących cały przepływ (login → formularz → submit → historia).
- **Migracje bazy** — `init.sql` jest uruchamiany tylko raz przy tworzeniu wolumenu; przy ewolucji schematu potrzebny byłby system migracji (np. Flyway lub własne skrypty z wersjonowaniem).
- **Monitoring i logi** — brak strukturyzowanych logów i alertów; dodałbym agregację logów (np. Loki) i healthcheck dashboard.

## Świadome uproszczenia

| Uproszczenie | Powód |
|---|---|
| Historia raportów w localStorage | Wystarczające dla UX w kontekście zadania; unika dodatkowego API endpoint do listowania raportów |
| Brak zarządzania kontami przez UI | Poza zakresem zadania; konta można dodać przez psql lub `change-password.sh` |
| Jeden węzeł Docker Swarm | Zadanie nie zakłada klastra wielowęzłowego; konfiguracja Swarm pozwala łatwo skalować w przyszłości |
| Brak refresh tokenów | JWT z domyślnym TTL NextAuth (30 dni); wystarczające dla aplikacji wewnętrznej używanej przez rzeczoznawców |
| Walidacja DOT tylko formatu + roku | Pełna walidacja DOT (np. weryfikacja tygodnia produkcji względem daty badania) byłaby nadmierna dla tego zakresu |

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.  
Commercial use is strictly prohibited without explicit permission. See the [LICENSE](LICENSE) file for details.
