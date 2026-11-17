[← Testplan](../index.md)

# TC-PRO-06 · Utan täckning visas fel och försök igen

| | |
|---|---|
| **Område** | Vara |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/produkt.spec.js`](../../tests/produkt.spec.js#L41) – *utan täckning visas fel och försök igen* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Slå på flygplansläge och skanna en ny vara | **Kunde inte hämta varan** och knappen **Försök igen** |
| 2 | Slå av flygplansläge och tryck **Försök igen** | Varan visas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
