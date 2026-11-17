[← Testplan](../index.md)

# TC-SKA-03 · Utan kamera visas en knapp för att försöka igen

| | |
|---|---|
| **Område** | Skanna |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/skanna.spec.js`](../../tests/skanna.spec.js#L20) – *utan kamera visas en knapp för att försöka igen* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Neka kameran när appen frågar | Ruta med förklaring och knappen **Starta kameran** |
| 2 | Tillåt kameran i inställningarna och tryck **Starta kameran** | Kamerabilden visas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
