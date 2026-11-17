# Testplan · Tillsatskoll

Testfall för Tillsatskoll som docs-as-code. Varje testfall har steg-för-steg-instruktioner så att det kan köras manuellt på telefonen.
Automatiserade testfall körs dessutom av Playwright vid varje commit och är kopplade via sitt ID.

| | |
|---|---|
| **Testfall** | 20 |
| **Automatiserade** | 18 (körs på iPhone/WebKit och Android/Chromium) |
| **Manuella** | 2 (kräver riktig iPhone och kamera) |
| **Senaste testrapport** | [dennishoglund.github.io/tillsatskoll/rapport/](https://dennishoglund.github.io/tillsatskoll/rapport/) |
| **Krav** | [SPEC.md](../SPEC.md) |

**Typ:** 🤖 automatiserad · 🖐️ manuell  **Prioritet:** Hög = måste fungera i butiken, Medel = viktig, Låg = bekvämlighet

## Skanna

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-SKA-01](testfall/TC-SKA-01.md) | [Streckkod som skrivs in visar varan](testfall/TC-SKA-01.md) | Hög | 🤖 |
| [TC-SKA-02](testfall/TC-SKA-02.md) | [Ogiltig streckkod ger tydligt fel](testfall/TC-SKA-02.md) | Medel | 🤖 |
| [TC-SKA-03](testfall/TC-SKA-03.md) | [Utan kamera visas en knapp för att försöka igen](testfall/TC-SKA-03.md) | Medel | 🤖 |
| [TC-SKA-04](testfall/TC-SKA-04.md) | [Skanna en riktig vara med iPhone-kameran](testfall/TC-SKA-04.md) | Hög | 🖐️ |

## Vara

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-PRO-01](testfall/TC-PRO-01.md) | [Tillsatserna listas med de omdiskuterade först](testfall/TC-PRO-01.md) | Hög | 🤖 |
| [TC-PRO-02](testfall/TC-PRO-02.md) | [NOVA-graden visas](testfall/TC-PRO-02.md) | Medel | 🤖 |
| [TC-PRO-03](testfall/TC-PRO-03.md) | [Tillsatser hittas med svenska namn i ingredienstexten](testfall/TC-PRO-03.md) | Hög | 🤖 |
| [TC-PRO-04](testfall/TC-PRO-04.md) | [Vara utan ingredienslista får en varning](testfall/TC-PRO-04.md) | Medel | 🤖 |
| [TC-PRO-05](testfall/TC-PRO-05.md) | [Vara som saknas i Open Food Facts](testfall/TC-PRO-05.md) | Hög | 🤖 |
| [TC-PRO-06](testfall/TC-PRO-06.md) | [Utan täckning visas fel och försök igen](testfall/TC-PRO-06.md) | Medel | 🤖 |

## Tillsats

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-TIL-01](testfall/TC-TIL-01.md) | [Förklaringen visas när man trycker på en tillsats](testfall/TC-TIL-01.md) | Hög | 🤖 |
| [TC-TIL-02](testfall/TC-TIL-02.md) | [Tillbaka går till varan](testfall/TC-TIL-02.md) | Medel | 🤖 |

## Historik och offline

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-HIS-01](testfall/TC-HIS-01.md) | [Skannad vara hamnar i historiken och som senast skannat](testfall/TC-HIS-01.md) | Hög | 🤖 |
| [TC-HIS-02](testfall/TC-HIS-02.md) | [Sparad vara öppnas utan täckning](testfall/TC-HIS-02.md) | Hög | 🤖 |
| [TC-HIS-03](testfall/TC-HIS-03.md) | [Historiken går att rensa](testfall/TC-HIS-03.md) | Låg | 🤖 |

## Lexikon

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-LEX-01](testfall/TC-LEX-01.md) | [Sök på svenskt namn](testfall/TC-LEX-01.md) | Medel | 🤖 |
| [TC-LEX-02](testfall/TC-LEX-02.md) | [Sök på E-nummer med och utan E](testfall/TC-LEX-02.md) | Medel | 🤖 |

## Tema och app

| ID | Testfall | Prio | Typ |
|---|---|---|---|
| [TC-TEM-01](testfall/TC-TEM-01.md) | [Temaknappen växlar och sparar valet](testfall/TC-TEM-01.md) | Medel | 🤖 |
| [TC-PWA-01](testfall/TC-PWA-01.md) | [Manifest och ikoner finns för hemskärmen](testfall/TC-PWA-01.md) | Hög | 🤖 |
| [TC-PWA-02](testfall/TC-PWA-02.md) | [Installera på hemskärmen](testfall/TC-PWA-02.md) | Hög | 🖐️ |
