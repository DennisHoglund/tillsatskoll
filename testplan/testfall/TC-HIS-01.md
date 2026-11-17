[← Testplan](../index.md)

# TC-HIS-01 · Skannad vara hamnar i historiken och som senast skannat

| | |
|---|---|
| **Område** | Historik och offline |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/historik.spec.js`](../../tests/historik.spec.js#L4) – *skannad vara hamnar i historiken och som senast skannat* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Skanna två varor | Båda öppnas |
| 2 | Tryck **Historik** i menyn | Varorna visas, senaste överst |
| 3 | Tryck **Skanna** | Kortet **Senast skannat** visar senaste varan |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
