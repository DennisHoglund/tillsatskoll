[← Testplan](../index.md)

# TC-HIS-03 · Historiken går att rensa

| | |
|---|---|
| **Område** | Historik och offline |
| **Prioritet** | Låg |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/historik.spec.js`](../../tests/historik.spec.js#L33) – *historiken går att rensa* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna **Historik** och tryck **Rensa historiken** | Fråga om bekräftelse |
| 2 | Bekräfta | Historiken är tom |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
