[← Testplan](../index.md)

# TC-SKA-01 · Streckkod som skrivs in visar varan

| | |
|---|---|
| **Område** | Skanna |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/skanna.spec.js`](../../tests/skanna.spec.js#L4) – *streckkod som skrivs in visar varan* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Tryck på tangentbordsknappen uppe till höger | Rutan **Streckkod** visas |
| 2 | Skriv in streckkoden från en vara och tryck **Visa vara** | Varans namn och tillsatser visas |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
