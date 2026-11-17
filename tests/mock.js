// Mockar allt externt så att testerna är snabba och stabila:
// Open Food Facts, streckkodsbiblioteket från CDN, typsnitt och kameran.

// Testvaror med giltiga kontrollsiffror
const EAN = {
  glass: '7310000000010',      // många tillsatser, NOVA 4
  dryck: '7310000000027',      // tillsatser bara i ingredienstexten, inga additives_tags
  utanLista: '7310000000034',  // finns men saknar ingredienslista
  saknas: '7310000000041',     // finns inte i OFF
  fel: '7310000000058'         // OFF svarar inte
};

const PRODUKTER = {
  [EAN.glass]: {
    code: EAN.glass,
    product_name: 'Vanilla ice cream',
    product_name_sv: 'Vaniljglass',
    brands: 'Testglass',
    quantity: '1 l',
    nova_group: 4,
    ingredients_text_sv: 'Grädde, socker, skummjölkspulver, glukossirap, emulgeringsmedel (mono- och diglycerider av fettsyror), förtjockningsmedel (karragenan, guarkärnmjöl), vanilj, färgämne (E160a).',
    additives_tags: ['en:e471', 'en:e407', 'en:e412', 'en:e160a']
  },
  [EAN.dryck]: {
    code: EAN.dryck,
    product_name_sv: 'Havredryck',
    quantity: '1 l',
    nova_group: 3,
    ingredients_text_sv: 'Vatten, havre 10%, rapsolja, surhetsreglerande medel (kaliumfosfat), kalciumkarbonat, salt, vitaminer.'
  },
  [EAN.utanLista]: {
    code: EAN.utanLista,
    product_name: 'Knäckebröd'
  }
};

async function mocka(page) {
  const api = { anrop: [], natVag: true };

  // Kameran finns inte i testerna – appen ska visa sin reserv
  await page.addInitScript(() => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia = () => Promise.reject(Object.assign(new Error('Ingen kamera'), { name: 'NotFoundError' }));
    }
  });

  // Streckkodsbiblioteket ersätts av en stubbe utan wasm
  await page.route(/cdn\.jsdelivr\.net\/npm\/barcode-detector/, (route) => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.BarcodeDetectionAPI={BarcodeDetector:class{constructor(){}async detect(){return []}}};'
  }));

  // Typsnitt behövs inte i testerna
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.fulfill({ contentType: 'text/css', body: '' }));

  // Open Food Facts
  await page.route(/world\.openfoodfacts\.org\/api\/v2\/product\//, (route) => {
    const url = new URL(route.request().url());
    const ean = url.pathname.split('/').pop().replace('.json', '');
    api.anrop.push(ean);
    if (!api.natVag || ean === EAN.fel) return route.abort('internetdisconnected');
    const produkt = PRODUKTER[ean];
    if (!produkt) {
      return route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ status: 0, status_verbose: 'product not found', code: ean }) });
    }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ status: 1, code: ean, product: produkt }) });
  });

  return api;
}

module.exports = { mocka, EAN, PRODUKTER };
