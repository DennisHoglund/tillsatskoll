[← Testplan](../index.md)

# TC-TEM-01 · Temaknappen växlar och sparar valet

| | |
|---|---|
| **Område** | Tema och app |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/tema.spec.js`](../../tests/tema.spec.js#L4) – *temaknappen växlar Auto → Ljust → Mörkt och sparar valet* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Öppna **Historik** och tryck på temaknappen | **Ljust** – appen blir ljus |
| 2 | Tryck igen | **Mörkt** |
| 3 | Stäng och öppna appen | Mörkt läge är kvar |
| 4 | Tryck igen | **Auto** – följer telefonen |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
