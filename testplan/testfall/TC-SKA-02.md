[← Testplan](../index.md)

# TC-SKA-02 · Ogiltig streckkod ger tydligt fel

| | |
|---|---|
| **Område** | Skanna |
| **Prioritet** | Medel |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/skanna.spec.js`](../../tests/skanna.spec.js#L12) – *ogiltig streckkod ger tydligt fel* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck på tangentbordsknappen | Rutan **Streckkod** visas |
| 2 | Skriv `1234567890123` och tryck **Visa vara** | Felmeddelande om ogiltig streckkod, ingen sökning görs |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
