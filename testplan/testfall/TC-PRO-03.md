[← Testplan](../index.md)

# TC-PRO-03 · Tillsatser hittas med svenska namn i ingredienstexten

| | |
|---|---|
| **Område** | Vara |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/produkt.spec.js`](../../tests/produkt.spec.js#L21) – *tillsatser hittas med svenska namn i ingredienstexten* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna en vara där ingredienslistan skriver namn i stället för E-nummer, t.ex. "citronsyra" | Tillsatsen visas ändå med sitt E-nummer |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
