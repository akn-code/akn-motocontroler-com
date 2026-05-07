# Plan Wykonania Aplikacji: Formularz Raportu Opon (Motocontroler)

## 1. Analiza wymagań biznesowych i celu
Aplikacja ma stanowić publiczny formularz webowy służący rzeczoznawcom (lub osobom współpracującym) do dodawania raportu opon badanego pojazdu. Głównym założeniem jest szybkie, poprawne wprowadzanie danych z odpowiednią walidacją. 

**Wytyczne:**
* **Brak odczytu danych przez formularz:** Ze względów bezpieczeństwa, formularz ma uprawnienia typu 'write-only'.
* **Zgodność z identyfikacją wizualną Motocontroler:** Strona powinna nawiązywać wyglądem do głównego portalu (kolorystyka, branding bazujący na czerwieni, czerni i bieli).
* **Formularz krok po kroku / sekcje:** Optymalizacja UX dla formularzy z dużą ilością danych (1 pojazd + 4 opony = 24+ pól).

## 2. Stos technologiczny
* **Frontend:** React (Next.js App Router dla prostej konfiguracji i łatwego wdrożenia).
* **Stylizacja:** Tailwind CSS (pozwala na szybkie wdrożenie brandingu i responsywności) + shadcn/ui (dla gotowych, dostępnych komponentów).
* **Zarządzanie stanem i formularzem:** `react-hook-form` w połączeniu z `zod` do zaawansowanej walidacji (np. sprawdzanie formatu VIN i DOT).
* **Backend / Baza danych:** Supabase (prosty setup PostgreSQL, idealne MVP do bezpiecznego zapisu prosto z frontendu).
* **Konteneryzacja:** Docker (Dockerfile do budowy obrazu aplikacji i docker-compose do lokalnego uruchamiania).
* **Hosting:** Vercel.

## 3. Schemat Bazy Danych (Supabase)

Tabela `tire_reports`:
* `id` (uuid, primary key)
* `created_at` (timestamp)
* `brand` (text, marka pojazdu)
* `model` (text, model pojazdu)
* `vin` (text, 17 znaków)
* `email` (text, opcjonalny)
* `tires` (jsonb) - Przechowywanie danych o 4 oponach (FL, FR, RL, RR), co zapobiega tworzeniu zbyt dużej liczby dedykowanych kolumn, lub oddzielna tabela powiązana kluczem obcym. Dla prostoty i szybkiego MVP wybierzemy zapis typu JSONB.
  * Marka opony
  * Rozmiar (np. 205/55 R16)
  * Głębokość bieżnika w mm
  * DOT (np. 2123)
  * Ocena (1-5)
  * Uwagi (opcjonalne)

## 4. Architektura UI / UX
Wykorzystamy podział formularza na zakładki lub widok typu harmonijka (Accordion), aby zminimalizować przytłoczenie użytkownika.

**Sekcje formularza:**
1. **Dane pojazdu:** Marka, Model, VIN, E-mail.
2. **Ewaluacja opon (Tabsy lub podsekcje):**
   * Przód-Lewy (FL)
   * Przód-Prawy (FR)
   * Tył-Lewy (RL)
   * Tył-Prawy (RR)
3. **Podsumowanie i Zapis:** Przycisk "Wyślij raport" z widocznymi stanami ładowania.

**Walidacje i powiadomienia:**
* **VIN:** Dokładnie 17 znaków z wykluczeniem liter I, O, Q.
* **DOT:** 4 cyfry (dwie pierwsze to tydzień do 52, dwie kolejne to rok).
* **Bieżnik (Tread depth):** Walidacja numeryczna. Ostrzeżenie pod polem, jeśli wartość spadnie poniżej zalecanego minimum (np. < 3 mm lub 1.6 mm), ale z możliwością kontynuacji i wysłania formularza.

## 5. Bezpieczeństwo i Policy (RLS w Supabase)
Aby zapewnić bezpieczny zapis bez dostępu do odczytu:
1. Włączenie Row Level Security (RLS) w tabeli `tire_reports`.
2. Utworzenie reguły (Policy) jedynie dla operacji `INSERT` dla nieautoryzowanych (anon) użytkowników.
3. Zablokowanie operacji `SELECT`, `UPDATE`, `DELETE`.

## 6. Plan implementacji (Kroki do wykonania)

*   [ ] **Krok 1:** Zespół projekDockera (Dockerfile, docker-compose.yml oraz .dockerignore) dla lokalnego środowiska deweloperskiego.
*   [ ] **Krok 3:** Konfiguracja projektu w Supabase (Stworzenie tabeli, skonfigurowanie RLS na `INSERT` only)
*   [ ] **Krok 3:** Przygotowanie schematu walidacji przy pomocy biblioteki `Zod`. Zawarcie logiki wyświetlania ostrzeżenia dla głębokości bieżnika.
*   [ ] **Krok 4:** Stworzenie wspólnych komponentów UI (Pola tekstowe, Selecty, Powiadomienia błędu) zgodnie z brandem Motocontroler.
*   [ ] **Krok 5:** Budowa głównego formularza przy użyciu `react-hook-form`. Podział na układ typu Accordion lub wieloetapowy.
*   [ ] **Krok 6:** Wyświetlanie ostrzeżenia (warning) obok bieżnika na bieżąco, bez blokowania zapisu (tzw. powiadomienie "soft").
*   [ ] **Krok 7:** Integracja supabase-js do wysyłki danych.
*   [ ] **Krok 8:** Obsługa stanów `idle`, `loading`, `success`, `error`. Stworzenie ekranu z podziękowaniem i przyciskiem resetu pod nowy raport.
*   [ ] **Krok 9:** Utworzenie profesjonalnego pliku `README.md` z opisami decyzji technologicznych.
*   [ ] **Krok 10:** Deploy na platformę Vercel.
