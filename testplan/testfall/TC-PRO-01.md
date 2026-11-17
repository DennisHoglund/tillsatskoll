[← Testplan](../index.md)

# TC-PRO-01 · Tillsatserna listas med de omdiskuterade först

| | |
|---|---|
| **Område** | Vara |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/produkt.spec.js`](../../tests/produkt.spec.js#L4) – *tillsatserna listas med de omdiskuterade först* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna en vara med flera tillsatser | Rutorna visar antal tillsatser och antal omdiskuterade |
| 2 | Titta på listan | Omdiskuterade (orange) står först, sedan övriga (gröna) |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
