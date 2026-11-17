[← Testplan](../index.md)

# TC-LEX-01 · Sök på svenskt namn

| | |
|---|---|
| **Område** | Lexikon |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/lexikon.spec.js`](../../tests/lexikon.spec.js#L4) – *sök på svenskt namn* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna **Lexikon** och skriv `citron` | **E330 Citronsyra** visas |
| 2 | Tryck på den | Förklaringen visas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
