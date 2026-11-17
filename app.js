// Tillsatskoll – appens flöde: skanna → hämta vara → visa tillsatser → förklaring.
// Navigering med hash så att bakåtgesten i iOS fungerar: #/, #/produkt/<ean>, #/tillsats/<E-nr>, #/historik, #/lexikon
(function () {
  'use strict';

  const D = window.TKData;
  const A = window.TKAnalys;
  const L = window.TKLager;
  const O = window.TKOff;
  const S = window.TKSkanner;

  const FARSK_MS = 7 * 24 * 3600 * 1000; // hämta om från OFF efter en vecka
  const VYER = ['skanna', 'produkt', 'tillsats', 'saknas', 'historik', 'lexikon'];
  const $ = (id) => document.getElementById(id);

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const IKON = {
    bak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    hoger: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    kamera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/></svg>',
    sok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5v14M7 5v14M11 5v9M15 5v6"/><circle cx="17" cy="17" r="3.5"/><path d="M19.5 19.5L22 22"/></svg>',
    tema: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>'
  };
  const NOVA = { 1: 'Obearbetad', 2: 'Matlagningsingrediens', 3: 'Bearbetad', 4: 'Ultraprocessad' };

  // ---------- Tema ----------
  const TEMAN = [['auto', 'Auto'], ['ljust', 'Ljust'], ['morkt', 'Mörkt']];
  function tema() { try { return localStorage.getItem('tk-tema') || 'auto'; } catch (e) { return 'auto'; } }
  function satTema(t) {
    try { localStorage.setItem('tk-tema', t); } catch (e) {}
    if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  }
  function temaKnapp() {
    const namn = TEMAN.find((x) => x[0] === tema())[1];
    return '<button type="button" class="tema" id="knapp-tema" aria-label="Tema: ' + namn + '">' + IKON.tema + '<span>' + namn + '</span></button>';
  }
  function kopplaTema() {
    const k = $('knapp-tema');
    if (!k) return;
    k.addEventListener('click', () => {
      const i = TEMAN.findIndex((x) => x[0] === tema());
      satTema(TEMAN[(i + 1) % TEMAN.length][0]);
      const namn = TEMAN.find((x) => x[0] === tema())[1];
      k.querySelector('span').textContent = namn;
      k.setAttribute('aria-label', 'Tema: ' + namn);
    });
  }

  // ---------- Hjälp ----------
  function visa(vy) {
    for (const v of VYER) $('vy-' + v).hidden = v !== vy;
    const flik = { skanna: 'skanna', historik: 'historik', lexikon: 'lexikon' }[vy] || (vy === 'tillsats' && sistaFlik === 'lexikon' ? 'lexikon' : 'skanna');
    if (['skanna', 'historik', 'lexikon'].includes(vy)) sistaFlik = vy;
    document.querySelectorAll('#flikar a').forEach((a) => a.classList.toggle('aktiv', a.dataset.flik === flik));
    document.body.classList.toggle('kamera-aktiv', vy === 'skanna');
    if (vy !== 'skanna') { S.stop(); stangArk(); }
    window.scrollTo(0, 0);
  }
  let sistaFlik = 'skanna';

  function tillbakaKnapp() {
    return '<button type="button" class="tillbaka" data-tillbaka aria-label="Tillbaka">' + IKON.bak + '</button>';
  }
  function kopplaTillbaka(el) {
    el.querySelectorAll('[data-tillbaka]').forEach((b) => b.addEventListener('click', () => {
      if (history.length > 1 && navigerat) history.back(); else location.hash = '#/';
    }));
  }
  let navigerat = false;

  function sammanfatta(lista) {
    return { antal: lista.length, obs: lista.filter((t) => t.status === 'obs').length };
  }
  function antalText(n, en, flera) { return n + ' ' + (n === 1 ? en : flera); }

  function tillsatsRad(t) {
    const info = t.kand ? esc(t.funktion) + (t.status === 'obs' ? ' · Omdiskuterad' : '') : 'Förklaring saknas än';
    const inre = '<span class="kod ' + t.status + '">' + esc(t.e) + '</span>' +
      '<span class="text"><span class="namn">' + esc(t.namn) + '</span><span class="info">' + info + '</span></span>';
    return t.kand
      ? '<li><a class="rad" href="#/tillsats/' + encodeURIComponent(t.e) + '">' + inre + IKON.hoger + '</a></li>'
      : '<li><div class="rad">' + inre + '</div></li>';
  }

  // ---------- Skanna ----------
  async function visaSkanna() {
    visa('skanna');
    await visaSenast();
    if (!$('form-ean').hidden) return;
    startaKamera();
  }

  async function startaKamera() {
    $('kamera-fel').hidden = true;
    $('skanna-hint').hidden = false;
    try {
      await S.start($('kamera'), (ean) => { location.hash = '#/produkt/' + ean; });
    } catch (e) {
      $('skanna-hint').hidden = true;
      $('kamera-fel').hidden = false;
      $('kamera-fel-text').textContent = e && e.name === 'NotAllowedError'
        ? 'Kameran är blockerad. Tillåt kameran i inställningarna eller skriv in streckkoden.'
        : 'Kameran kunde inte startas. Försök igen eller skriv in streckkoden.';
    }
  }

  async function visaSenast() {
    const el = $('senast');
    const [rad] = await L.alla();
    if (!rad) { el.hidden = true; return; }
    const s = sammanfatta(A.analysera(rad.produkt));
    el.href = '#/produkt/' + rad.ean;
    el.innerHTML =
      '<span class="merke" style="background:' + (s.obs ? 'var(--obs)' : 'var(--lime)') + ';color:#0B0D0C"><b>' + s.obs + '</b><small>OBS</small></span>' +
      '<span class="text"><span class="etikett">Senast skannat</span><span class="namn">' + esc(A.namn(rad.produkt)) + '</span>' +
      '<span class="info">' + antalText(s.antal, 'tillsats', 'tillsatser') + ' · ' + antalText(s.obs, 'omdiskuterad', 'omdiskuterade') + '</span></span>' + IKON.hoger;
    el.hidden = false;
  }

  function oppnaArk() {
    S.stop();
    $('form-ean').hidden = false;
    document.body.classList.add('ark-oppet');
    $('ean-fel').textContent = '';
    setTimeout(() => $('ean').focus(), 50);
  }
  function stangArk() {
    $('form-ean').hidden = true;
    document.body.classList.remove('ark-oppet');
  }

  $('knapp-skriv').addEventListener('click', oppnaArk);
  $('knapp-avbryt').addEventListener('click', () => { stangArk(); startaKamera(); });
  $('knapp-starta').addEventListener('click', startaKamera);
  $('form-ean').addEventListener('submit', (e) => {
    e.preventDefault();
    const kod = $('ean').value.replace(/\D/g, '');
    if (!S.giltig(kod)) {
      $('ean-fel').textContent = 'Det ser inte ut som en giltig streckkod. Den har 8 eller 13 siffror under strecken.';
      return;
    }
    $('ean').value = '';
    stangArk();
    location.hash = '#/produkt/' + S.normalisera(kod);
  });

  // ---------- Produkt ----------
  async function visaProdukt(ean) {
    const el = $('vy-produkt');
    visa('produkt');
    el.innerHTML = tillbakaKnapp() + '<div class="laddar"><div><div class="snurra"></div>Hämtar varan…</div></div>';
    kopplaTillbaka(el);

    const sparad = await L.hamta(ean);
    let produkt = sparad && sparad.produkt;
    let offline = false;
    let hamtad = sparad ? sparad.hamtad : 0;

    if (!sparad || Date.now() - (sparad.hamtad || 0) > FARSK_MS) {
      try {
        const svar = await O.hamta(ean);
        if (!svar.hittad) {
          if (!produkt) return visaSaknas(ean);
        } else {
          produkt = svar.produkt;
          hamtad = Date.now();
        }
      } catch (e) {
        if (!produkt) return visaFel(ean);
        offline = true;
      }
    }
    if (location.hash !== '#/produkt/' + ean) return; // användaren hann gå vidare

    await L.spara({ ean, produkt, hamtad, skannad: Date.now() });

    const lista = A.analysera(produkt);
    const s = sammanfatta(lista);
    const ingr = A.ingredienser(produkt);
    const nova = Number(produkt.nova_group) || 0;
    const info = [produkt.brands && produkt.brands.split(',')[0].trim(), produkt.quantity].filter(Boolean).join(' · ');

    el.innerHTML = tillbakaKnapp() +
      '<div class="rubrik"><h1 id="p-namn">' + esc(A.namn(produkt)) + '</h1><p>' + esc(info ? info + ' · ' : '') + 'Open Food Facts</p></div>' +
      '<div class="bento">' +
        '<div class="ruta stor lime" id="p-antal"><b>' + s.antal + '</b><span>' + (s.antal === 1 ? 'tillsats' : 'tillsatser') + '</span></div>' +
        '<div class="ruta stor ' + (s.obs ? 'obs' : '') + '" id="p-obs"><b>' + s.obs + '</b><span>' + (s.obs === 1 ? 'omdiskuterad' : 'omdiskuterade') + '</span></div>' +
        (nova ? '<div class="ruta bred" id="p-nova"><div><b>NOVA ' + nova + '</b><br><small>' + NOVA[nova] + '</small></div>' +
          '<div class="nova' + (nova <= 2 ? ' lag' : '') + '" role="img" aria-label="NOVA ' + nova + ' av 4">' +
          [1, 2, 3, 4].map((i) => '<span' + (i <= nova ? ' class="pa"' : '') + '></span>').join('') + '</div></div>' : '') +
      '</div>' +
      (offline ? '<div class="notis">' + IKON.info + '<p>Ingen täckning – visar sparad information.</p></div>' : '') +
      (!ingr && !(produkt.additives_tags || []).length
        ? '<div class="notis obs" id="p-ingen-lista">' + IKON.info + '<p>Ingredienslistan saknas i Open Food Facts, så tillsatser kan saknas här.</p></div>' : '') +
      (lista.length
        ? '<ul class="lista" id="p-lista">' + lista.map(tillsatsRad).join('') + '</ul>'
        : (ingr ? '<p class="mittre" id="p-inga">Inga tillsatser hittades i ingredienslistan.</p>' : '')) +
      (ingr ? '<details class="ingredienser"><summary>Visa hela ingredienslistan</summary><p>' + esc(ingr) + '</p></details>' : '') +
      '<p class="kalla">Streckkod <span class="mono">' + esc(ean) + '</span></p>';
    kopplaTillbaka(el);
  }

  function visaSaknas(ean) {
    const el = $('vy-saknas');
    visa('saknas');
    el.innerHTML = tillbakaKnapp() +
      '<div class="saknas-kort"><div class="ikon">' + IKON.sok + '</div>' +
      '<h1>Varan saknas i Open Food Facts</h1>' +
      '<p>Streckkoden <span class="mono">' + esc(ean) + '</span> finns inte i databasen än. Snart kan du fota ingredienslistan i stället.</p></div>' +
      '<button type="button" class="knapp-lime" disabled>' + IKON.kamera + 'Fota ingredienslistan · kommer snart</button>' +
      '<div class="tips"><div><span class="mono">01</span>Hela listan i bild</div><div><span class="mono">02</span>Bra ljus, inga reflexer</div><div><span class="mono">03</span>Håll stilla</div></div>' +
      '<a class="lank-mitt" href="https://world.openfoodfacts.org/cgi/product.pl?type=add&code=' + encodeURIComponent(ean) + '" target="_blank" rel="noopener">Lägg till varan i Open Food Facts</a>';
    kopplaTillbaka(el);
  }

  function visaFel(ean) {
    const el = $('vy-produkt');
    el.innerHTML = tillbakaKnapp() +
      '<div class="saknas-kort" id="p-fel"><div class="ikon">' + IKON.info + '</div><h1>Kunde inte hämta varan</h1>' +
      '<p>Ingen kontakt med Open Food Facts. Kontrollera täckningen och försök igen.</p></div>' +
      '<button type="button" class="knapp-lime" id="knapp-igen">Försök igen</button>';
    kopplaTillbaka(el);
    $('knapp-igen').addEventListener('click', () => visaProdukt(ean));
  }

  // ---------- Tillsats ----------
  function visaTillsats(kod) {
    const el = $('vy-tillsats');
    visa('tillsats');
    const t = A.slaUpp(kod);
    if (!t) {
      el.innerHTML = tillbakaKnapp() + '<p class="mittre">Ingen förklaring finns för ' + esc(kod) + ' än.</p>';
      kopplaTillbaka(el);
      return;
    }
    el.innerHTML = tillbakaKnapp() +
      '<div class="tillsats-topp"><div class="rad1"><span class="stor-kod">' + esc(t.e) + '</span>' +
      '<span class="status ' + t.s + '">' + (t.s === 'obs' ? 'Omdiskuterad' : 'Inga anmärkningar') + '</span></div>' +
      '<h1>' + esc(t.namn) + '</h1></div>' +
      '<div class="bento">' +
        '<div class="ruta"><span class="etikett">Funktion</span><span class="varde">' + esc(t.f) + '</span></div>' +
        '<div class="ruta"><span class="etikett">Ursprung</span><span class="varde">' + esc(t.urs) + '</span></div>' +
      '</div>' +
      '<div class="ruta text">' +
        '<div class="stycke"><span class="etikett">Vad är det?</span><p>' + esc(t.vad) + '</p></div>' +
        '<div class="stycke"><span class="etikett">Varför används det?</span><p>' + esc(t.varfor) + '</p></div>' +
      '</div>' +
      (t.obs ? '<div class="notis ' + (t.s === 'obs' ? 'obs' : '') + '">' + IKON.info + '<p>' + esc(t.obs) + '</p></div>' : '');
    kopplaTillbaka(el);
  }

  // ---------- Historik ----------
  async function visaHistorik() {
    const el = $('vy-historik');
    visa('historik');
    const rader = await L.alla();
    el.innerHTML = '<div class="sidhuvud"><h1>Historik</h1>' + temaKnapp() + '</div>' +
      (rader.length
        ? '<ul class="lista" id="h-lista">' + rader.map((r) => {
            const s = sammanfatta(A.analysera(r.produkt));
            return '<li><a class="rad" href="#/produkt/' + esc(r.ean) + '"><span class="text"><span class="namn">' + esc(A.namn(r.produkt)) + '</span>' +
              '<span class="info">' + antalText(s.antal, 'tillsats', 'tillsatser') + '</span></span>' +
              (s.obs ? '<span class="merke-liten obs">' + antalText(s.obs, 'omdiskuterad', 'omdiskuterade') + '</span>' : '<span class="merke-liten ok">Inga anmärkningar</span>') +
              IKON.hoger + '</a></li>';
          }).join('') + '</ul><button type="button" class="lank-knapp" id="knapp-rensa">Rensa historiken</button>'
        : '<p class="mittre" id="h-tom">Inga skannade varor än. Skanna en streckkod så hamnar varan här.</p>');
    kopplaTema();
    const rensa = $('knapp-rensa');
    if (rensa) rensa.addEventListener('click', async () => {
      if (!confirm('Rensa all historik?')) return;
      await L.rensa();
      visaHistorik();
    });
  }

  // ---------- Lexikon ----------
  function visaLexikon() {
    const el = $('vy-lexikon');
    visa('lexikon');
    if (!el.dataset.byggd) {
      el.innerHTML = '<div class="sidhuvud"><h1>Lexikon</h1>' + temaKnapp() + '</div>' +
        '<input id="lex-sok" class="sok" type="search" placeholder="Sök E-nummer eller namn" aria-label="Sök tillsats" autocomplete="off">' +
        '<ul class="lista" id="lex-lista"></ul><p class="mittre" id="lex-tom" hidden>Ingen tillsats matchar.</p>';
      el.dataset.byggd = '1';
      kopplaTema();
      $('lex-sok').addEventListener('input', ritaLexikon);
    }
    ritaLexikon();
  }
  function ritaLexikon() {
    const q = $('lex-sok').value.trim().toLowerCase().replace(/^e\s?-?/, 'e');
    const traffar = D.alla.filter((t) => !q || t.e.toLowerCase().startsWith(q) || t.e.toLowerCase().slice(1).startsWith(q) ||
      t.namn.toLowerCase().includes(q) || (t.syn || []).some((s) => s.includes(q)) || t.f.toLowerCase().includes(q));
    $('lex-lista').innerHTML = traffar.map((t) => tillsatsRad({ e: t.e, namn: t.namn, funktion: t.f, status: t.s, kand: true })).join('');
    $('lex-tom').hidden = traffar.length > 0;
  }

  // ---------- Navigering ----------
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [vy, arg] = h.split('/');
    if (vy === 'produkt' && arg) return visaProdukt(arg.replace(/\D/g, ''));
    if (vy === 'tillsats' && arg) return visaTillsats(arg);
    if (vy === 'historik') return visaHistorik();
    if (vy === 'lexikon') return visaLexikon();
    return visaSkanna();
  }
  window.addEventListener('hashchange', () => { navigerat = true; route(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) S.stop();
    else if (!$('vy-skanna').hidden && $('form-ean').hidden) startaKamera();
  });
  route();

  // ---------- Service worker ----------
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    // Ladda om när en ny version tar över – men inte vid allra första installationen
    const fanns = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    let laddat = !fanns;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (laddat) return;
      laddat = true;
      location.reload();
    });
  }
})();
