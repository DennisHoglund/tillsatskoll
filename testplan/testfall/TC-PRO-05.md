[← Testplan](../index.md)

# TC-PRO-05 · Vara som saknas i Open Food Facts

| | |
|---|---|
| **Område** | Vara |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/produkt.spec.js`](../../tests/produkt.spec.js#L34) – *vara som saknas i Open Food Facts* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Skanna en vara som inte finns i Open Food Facts | Sidan **Varan saknas i Open Food Facts** visas |
| 2 | Tryck **Lägg till varan i Open Food Facts** | Open Food Facts öppnas med streckkoden ifylld |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
