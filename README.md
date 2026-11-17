# Tillsatskoll

PWA för iPhone som skannar streckkoden på en matvara, hämtar ingredienserna från [Open Food Facts](https://world.openfoodfacts.org) och förklarar varje tillsats (E-nummer) kort och enkelt.

**Appen:** https://dennishoglund.github.io/tillsatskoll/
**Testrapport:** https://dennishoglund.github.io/tillsatskoll/rapport/

## Kom igång på iPhone
1. Öppna länken ovan i Safari.
2. Tryck **Dela** → **Lägg till på hemskärmen**.
3. Öppna appen och tillåt kameran.

## Filer
| Fil | Innehåll |
|---|---|
| `index.html`, `styles.css` | Vyerna och designen (mörkt/ljust) |
| `app.js` | Flödet: skanna → vara → tillsats, historik, lexikon |
| `skanner.js` | Kamera och streckkodsläsning |
| `off.js` | Hämtning från Open Food Facts |
| `analys.js` | Hittar tillsatser i OFF-data och ingredienstext |
| `tillsatser.js` | Tabellen med E-nummer, namn och förklaringar |
| `lager.js` | Sparade varor i IndexedDB (historik och offline) |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA och offline |

## Tester
```bash
npm ci
npx playwright install webkit chromium
npm test
npm run rapport
```
Testfall finns i [`testplan/`](testplan/index.md). Krav och beslut i [`SPEC.md`](SPEC.md).
