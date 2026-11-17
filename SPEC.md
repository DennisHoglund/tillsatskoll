# Tillsatskoll – specifikation

## 1. Syfte
Stå i butiken, skanna streckkoden och direkt se vilka tillsatser (E-nummer) varan innehåller, vad de är, varför de används och om de är omdiskuterade. Kort och enkelt förklarat.

## 2. Stack
- Ren HTML/CSS/JS utan byggsteg, PWA på GitHub Pages (deploy via GitHub Actions).
- Produktdata: Open Food Facts API v2 (`/api/v2/product/<ean>.json?lc=sv&fields=…`), ingen nyckel.
- Streckkoder: `BarcodeDetector` där den finns, annars `barcode-detector@3.2.4` (ZXing/wasm) från jsDelivr. Safari på iPhone saknar inbyggt stöd.
- Lagring: IndexedDB (`tillsatskoll` / `produkter`), `localStorage` för tema.
- Ingen backend i version 1.

## 3. Design
Design B "Modern" (vald 2026-11-17, skisser på canvasen *Tillsatskoll – design*).
- Mörkt som standard med lime `#C6F432` och orange `#FFB020` för omdiskuterat. Ljust läge finns.
- Bento-rutor med stora siffror, rundade kort, svävande meny (Skanna, Historik, Lexikon).
- Typsnitt Geist, E-nummer i Geist Mono. Ikon: lime E i skanningsram på svart.

### 3.1 Tema
Temaknapp i Historik och Lexikon: Auto → Ljust → Mörkt. Sparas i `localStorage` (`tk-tema`).

## 4. Funktioner

### 4.1 Skanna
- Kameran fyller skärmen med ram och svepande linje. Bakre kameran.
- En giltig kod (EAN-8, EAN-13, UPC-A, kontrollsiffran kontrolleras) öppnar varan direkt. UPC-A görs om till EAN-13 med inledande nolla.
- Tangentbordsknappen öppnar inmatning för hand. Ogiltig kod ger felmeddelande.
- Går kameran inte att starta visas förklaring och **Starta kameran**.
- Kortet **Senast skannat** visar senaste varan med antal omdiskuterade.

### 4.2 Vara
- Namn (svenskt i första hand), varumärke, mängd.
- Rutor: antal tillsatser, antal omdiskuterade och NOVA-grad (1–4) om den finns.
- Lista med tillsatser: omdiskuterade först, sedan okända, sedan övriga. Tryck öppnar förklaringen.
- Tillsatser hämtas från OFF:s `additives_tags` och från ingredienstexten, både E-nummer och svenska namn (t.ex. "citronsyra" → E330).
- Saknas ingredienslistan visas en varning. Hela ingredienslistan kan fällas ut.

### 4.3 Varan saknas
Visas när OFF inte har streckkoden. Länk för att lägga till varan i OFF. Knappen för att fota ingredienslistan är förberedd men avstängd (version 2).

### 4.4 Tillsats
E-nummer, namn, status (Omdiskuterad / Inga anmärkningar), funktion, ursprung, "Vad är det?", "Varför används det?" och eventuell notis.

### 4.5 Historik
Alla skannade varor, senaste först, med antal tillsatser och omdiskuterade. Kan rensas.

### 4.6 Lexikon
Alla tillsatser i tabellen, sökbara på E-nummer (med eller utan E), namn, synonymer och funktion.

## 5. Datamodell

### 5.1 Tillsatstabell (`tillsatser.js`)
`{ e, namn, syn[], f (funktion), s ('ok' | 'obs'), vad, varfor, urs, obs? }` – 106 tillsatser.
- `obs` används när ämnet har varningsmärkning, gruppgränsvärde som kan överskridas eller är omdiskuterat i forskningen (t.ex. azofärger, nitrit, sulfiter, fosfater, karragenan, E471, aspartam).
- Okända E-nummer visas som "Okänd tillsats – förklaring saknas än".

### 5.2 Sparad vara (IndexedDB)
`{ ean, produkt (OFF-fälten), hamtad (ms), skannad (ms) }`. Hämtas om från OFF efter 7 dagar. Utan nät används sparad data.

## 6. Offline
- Service worker: appfiler nätet först, CDN, wasm och typsnitt cache först. `/rapport/` cachas aldrig.
- Sparade varor öppnas utan täckning. Ny vara utan täckning ger fel och **Försök igen**.

## 7. Tester
Playwright på iPhone 14 (WebKit) och Pixel 7 (Chromium). OFF, CDN, typsnitt och kamera mockas i `tests/mock.js`.
Testfall i `testplan/` (20 st, 18 automatiserade). Egen rapport publiceras på `/rapport/`.

## 8. Beslut
- Status och förklaringar ligger i en egen tabell, inte AI vid körning: samma svar varje gång, gratis och offline.
- Ingen Supabase i version 1, eftersom inget behöver lagras på servern.
- Design B (mörk/modern) valdes framför A (ljus etikett).

## 9. Kvar att göra
- **Version 2:** fota ingredienslistan → AI (vision) via Supabase Edge Function plockar ut tillsatserna. Supabase delas med andra appar, prefix `tillsats_`.
- Fler tillsatser i tabellen, särskilt modifierade stärkelser (E14xx).
- Filter i historiken och möjlighet att ta bort en enskild vara.
