[← Testplan](../index.md)

# TC-PRO-04 · Vara utan ingredienslista får en varning

| | |
|---|---|
| **Område** | Vara |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/produkt.spec.js`](../../tests/produkt.spec.js#L28) – *vara utan ingredienslista får en varning* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna en vara som saknar ingredienslista i Open Food Facts | Orange ruta: **Ingredienslistan saknas…** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
