// Plockar ut tillsatser ur en produkt från Open Food Facts.
// Källor: OFF:s färdigtolkade additives_tags och vår egen sökning i ingredienstexten
// (E-nummer och svenska namn, eftersom svenska förpackningar ofta skriver "citronsyra" i stället för E330).
window.TKAnalys = (function () {
  'use strict';

  const D = window.TKData;

  // "en:e471" → "E471", "en:e160a" → "E160A" (normaliseras), "en:e150c" → "E150C"
  function fromTag(tag) {
    const m = /^[a-z]{2}:e(\d{3,4}[a-z]?)(?:[ivx]+)?$/i.exec(String(tag || ''));
    return m ? 'E' + m[1].toUpperCase() : null;
  }

  // Hittar E-nummer och kända namn i en ingredienstext
  function iText(text) {
    const hittade = new Set();
    if (!text) return hittade;
    let t = ' ' + text.toLowerCase().replace(/\s+/g, ' ') + ' ';
    for (const m of t.matchAll(/\be\s?-?(\d{3,4})\s?([a-d])?(?![a-z0-9])/g)) {
      hittade.add('E' + m[1] + (m[2] || '').toUpperCase());
    }
    // Längsta namnen först. En träff blankas ut så att "fettsyror" i
    // "mono- och diglycerider av fettsyror" inte räknas en gång till.
    for (const [namn, e] of D.synonymer) {
      let i = t.indexOf(namn);
      while (i >= 0) {
        const fore = t[i - 1], efter = t[i + namn.length];
        if (!/[a-zåäö]/.test(fore) && !/[a-zåäö]/.test(efter)) {
          hittade.add(D.kod(e));
          t = t.slice(0, i) + ' '.repeat(namn.length) + t.slice(i + namn.length);
        }
        i = t.indexOf(namn, i + 1);
      }
    }
    return hittade;
  }

  // Slår upp en kod. E160A och E160a pekar på samma post.
  function slaUpp(kod) {
    const k = D.kod(kod);
    return D.perKod.get(k) || null;
  }

  function analysera(produkt) {
    const koder = new Set();
    for (const tag of produkt.additives_tags || []) {
      const k = fromTag(tag);
      if (k) koder.add(k);
    }
    for (const k of iText(ingredienser(produkt))) koder.add(k);

    const lista = [...koder].map((k) => {
      const t = slaUpp(k);
      return t
        ? { e: t.e, namn: t.namn, funktion: t.f, status: t.s, kand: true }
        : { e: k.replace(/^E(\d+)([A-Z])$/, (_, n, b) => 'E' + n + b.toLowerCase()), namn: 'Okänd tillsats', funktion: 'Förklaring saknas än', status: 'okand', kand: false };
    });
    const ordning = { obs: 0, okand: 1, ok: 2 };
    lista.sort((a, b) => ordning[a.status] - ordning[b.status] || a.e.localeCompare(b.e, 'sv', { numeric: true }));
    return lista;
  }

  function ingredienser(p) {
    return p.ingredients_text_sv || p.ingredients_text || '';
  }

  function namn(p) {
    return (p.product_name_sv || p.product_name || '').trim() || 'Okänd vara';
  }

  return { analysera, slaUpp, iText, fromTag, ingredienser, namn };
})();
