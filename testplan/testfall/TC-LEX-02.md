[← Testplan](../index.md)

# TC-LEX-02 · Sök på E-nummer med och utan E

| | |
|---|---|
| **Område** | Lexikon |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/lexikon.spec.js`](../../tests/lexikon.spec.js#L12) – *sök på E-nummer med och utan E* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Skriv `471` | **E471** visas |
| 2 | Skriv `e 250` | **E250** visas |
| 3 | Skriv något som inte finns | **Ingen tillsats matchar** |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
