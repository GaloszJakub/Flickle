# Flickle

Gra w zgadywanie filmu w stylu Wordle. Wyszukujesz tytuły z TMDB, a po każdej próbie dostajesz szczegółową kartę porównawczą z filmem dnia. Wygrywasz po trafieniu dokładnego tytułu.

## Stack


| Warstwa            | Technologie                                                          |
| ------------------ | -------------------------------------------------------------------- |
| Frontend           | React 19, TypeScript, Vite 8                                         |
| Stylowanie         | Tailwind CSS 4                                                       |
| API                | [The Movie Database (TMDB)](https://www.themoviedb.org/) REST API v3 |
| Hosting            | [Vercel](https://vercel.com/) (statyczny build Vite)                 |
| Produkcja (Docker) | nginx (Alpine) — serwowanie statycznego builda                       |
| Build (Docker)     | Node.js 22 (Alpine)                                                  |


## Jak działa gra

1. Aplikacja losuje **film dnia** z puli rozpoznawalnych tytułów (top rated + popular + lista curated z TMDB).
2. Wpisujesz tytuł w wyszukiwarce — autocomplete pobiera wyniki z TMDB.
3. Po zatwierdzeniu próby widzisz kartę z:
  - rokiem, box office, kategorią wiekową, oceną, studiem,
  - gatunkami (zielone = trafione),
  - obsadą i reżyserem.
4. Pola numeryczne pokazują strzałkę ↑/↓, gdy wartość jest nieprawidłowa.
5. **Brak limitu prób** — możesz zgadywać do skutku lub poddać się.
6. Co **5 prób** odblokowuje się kolejna podpowiedź (rok → gatunki → studio → reżyser → …).
7. Trafienie **dokładnego tytułu** kończy grę wygraną.

## Wymagania

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose **albo**
- Node.js 22+ i npm (tryb developerski) **albo**

## Uruchomienie przez Docker (zalecane)

### 1. Konfiguracja

Skopiuj plik ze zmiennymi środowiskowymi:

```bash
cp .env.example .env
```

Uzupełnij token TMDB w `.env`:

```env
VITE_TMDB_API_TOKEN=twój_klucz_lub_read_access_token
```

Klucz możesz wygenerować na [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (API Key v3 lub Read Access Token v4).

Opcjonalnie zmień port hosta (domyślnie `8080`):

```env
FLICKLE_PORT=8080
```

### 2. Build i start

```bash
docker compose up --build
```

Albo przez npm:

```bash
npm run docker:up
```

### 3. Otwórz aplikację

[http://localhost:8080](http://localhost:8080)

### Zatrzymanie

```bash
docker compose down
# lub: npm run docker:down
```

> **Uwaga:** `VITE_TMDB_API_TOKEN` jest wstrzykiwany **w czasie buildu** obrazu Docker. Po zmianie tokenu w `.env` przebuduj kontener: `docker compose up --build`.

## Uruchomienie lokalne (dev)

```bash
npm install
cp .env.example .env
# uzupełnij VITE_TMDB_API_TOKEN w .env

npm run dev
```

Aplikacja dev: [http://localhost:5173](http://localhost:5173)

Inne komendy:

```bash
npm run build    # produkcyjny build do dist/
npm run preview  # podgląd builda
npm run lint     # ESLint
```

## Struktura projektu

```
src/
  api/           # klient TMDB, cache, sessionStorage puli
  components/    # UI (karty prób, wyszukiwarka, modale)
  constants/     # konfiguracja gry i API
  hooks/         # useMovieGame, useMovieSearch
  lib/           # czysta logika (porównanie, podpowiedzi, mapowanie TMDB)
  types/         # typy TypeScript
docker/
  nginx.conf     # konfiguracja nginx (SPA + cache assetów)
vercel.json      # konfiguracja deployu na Vercel
```

## Architektura i ograniczenia

- **Frontend-only** — zapytania do TMDB idą z przeglądarki; klucz API jest widoczny w bundlu (akceptowalne na demo).
- **Cache:** wyniki wyszukiwania i szczegóły filmów w pamięci; pula filmów dnia w `sessionStorage` (na czas sesji karty).
- **Ochrona API:** min. 2 znaki przed wyszukiwaniem, debounce 300 ms, retry po HTTP 429.



## Podsumowanie

AI pomogło mi szybko postawić bazę projektu. Wygenerowało boilerplate komponentów w React, napisało podstawowe funkcje do pobierania danych z API TMDB i przygotowało konfigurację pod Dockera i Vercela oraz stworzyło readme do projektu.

Główną rzeczą, którą musiałem po AI poprawić, był wygląd aplikacji. Pierwsza wersja wygenerowana przez model miała typowy dla AI, generyczny styl pełno niepotrzebnych gradientów, cieni i zaokrągleń, które źle wyglądają.