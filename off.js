// Hämtar produktdata från Open Food Facts (öppet API, ingen nyckel).
window.TKOff = (function () {
  'use strict';

  const BAS = 'https://world.openfoodfacts.org/api/v2/product/';
  const FALT = [
    'code', 'product_name', 'product_name_sv', 'brands', 'quantity',
    'ingredients_text', 'ingredients_text_sv', 'additives_tags', 'nova_group', 'image_front_small_url'
  ].join(',');

  // Returnerar { hittad: true, produkt } eller { hittad: false }. Kastar fel vid nätverksproblem.
  async function hamta(ean) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch(BAS + encodeURIComponent(ean) + '.json?lc=sv&fields=' + FALT, { signal: ctrl.signal });
      if (res.status === 404) return { hittad: false };
      if (!res.ok) throw new Error('Open Food Facts svarade ' + res.status);
      const data = await res.json();
      if (data.status !== 1 || !data.product) return { hittad: false };
      return { hittad: true, produkt: data.product };
    } finally {
      clearTimeout(timer);
    }
  }

  return { hamta };
})();
