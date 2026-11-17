# Tillsatskoll – instruktioner för AI-assistenter

Läs `SPEC.md` för hela specifikationen. Det här är reglerna som gäller vid varje ändring.

## Projektet
- Privat PWA för iPhone: skanna streckkoden på en matvara och se vilka tillsatser (E-nummer) den har och vad de gör.
- Ren HTML/CSS/JS **utan byggsteg**. Inga ramverk, ingen bundler. Bibliotek via CDN med låst version.
- Produktdata från Open Food Facts (öppet API). Version 1 har ingen backend och ingen inloggning.

## Språk och ton
- All UI-text, felmeddelanden, kommentarer, commit-meddelanden och testnamn på **svenska**.
- Förklaringar i klarspråk, 1–2 meningar. Inga skrämselformuleringar – status bygger på EFSA:s bedömningar.

## Får aldrig brytas
- Tillsatsernas status och förklaringar finns i `tillsatser.js` och ska vara sakliga. AI får inte gissa fram status vid körning.
- Inga hemligheter i koden. Kommer AI-funktionen (foto av ingredienslistan) går anropet via en Supabase Edge Function.
- Supabase delas med andra appar: allt eget får prefixet `tillsats_`. Rör aldrig befintliga tabeller, auth-inställningar eller mejlmallar.
- `localStorage` alltid i try/catch. Nycklar börjar med `tk-`.
- Escapa all text från Open Food Facts som hamnar i HTML (`esc()`).

## Vid varje ändring
1. Höj `CACHE`-versionen i `sw.js` (`tillsatskoll-vN`) när appfiler ändras, och lägg nya filer i `SHELL`.
2. Nya JS-filer: lägg till `<script>` i `index.html` och i `SHELL`.
3. Kör testerna: `npx playwright test` (lokalt räcker `--project="Android (Chromium)"` om WebKit saknas).
4. Lägg till eller uppdatera tester i `tests/`. All extern trafik mockas i `tests/mock.js`. `bild(page, 'Namn')` ger skärmdump i rapporten.
5. Uppdatera testfall i `testplan/` och koppla med `{ annotation: { type: 'testfall', description: 'TC-…' } }`. Kör `npm run testplan`.
6. Uppdatera `SPEC.md` (och `README.md` vid behov).
7. Committa med beskrivande svenskt meddelande och pusha till `main`. CI testar och publicerar.

## Design
- Design B "Modern": mörkt läge, lime `#C6F432` som accent, orange `#FFB020` för omdiskuterat, bento-rutor, svävande meny.
- Ljust läge finns också. Använd alltid CSS-variablerna i `styles.css`, aldrig hårdkodade färger (undantag: kameravyn som alltid är mörk).
- Typsnitt Geist och Geist Mono (E-nummer). Tryckytor ≥ 44 px, `env(safe-area-inset-*)`.

## Kod
- Moduler som IIFE på `window`: `TKData`, `TKAnalys`, `TKLager`, `TKOff`, `TKSkanner`. `app.js` styr vyerna via hash (`#/produkt/<ean>` m.fl.).
- Streckkoder: `BarcodeDetector` om den finns, annars `barcode-detector` (ZXing/wasm) – Safari på iPhone saknar inbyggt stöd.

## Tester och rapport
- Playwright på iPhone 14 (WebKit) och Pixel 7 (Chromium). Rapport: https://dennishoglund.github.io/tillsatskoll/rapport/
- Rött i WebKit men grönt i Chromium betyder oftast ett riktigt Safari-problem – fixa appen, inte testet.
