[← Testplan](../index.md)

# TC-HIS-02 · Sparad vara öppnas utan täckning

| | |
|---|---|
| **Område** | Historik och offline |
| **Prioritet** | Hög |
| **Typ** | 🤖 Automatiserad |
| **Krav** | [SPEC.md](../../SPEC.md) |
| **Playwright** | [`tests/historik.spec.js`](../../tests/historik.spec.js#L21) – *sparad vara öppnas utan täckning* |

## Förutsättningar

- Tillsatskoll öppen på telefonen

## Steg

| # | Gör så här | Förväntat resultat |
|---|---|---|
| 1 | Skanna en vara med täckning | Varan visas |
| 2 | Slå på flygplansläge och öppna varan från historiken | Varan och tillsatserna visas ändå |

## Resultat

- [ ] Godkänt
- [ ] Underkänt – notera vad som hände:
