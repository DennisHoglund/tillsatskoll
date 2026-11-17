// Streckkodsläsare: webbläsarens BarcodeDetector där den finns (Chrome/Android),
// annars ZXing-baserad ersättare (barcode-detector) som behövs i Safari på iPhone.
window.TKSkanner = (function () {
  'use strict';

  const FORMAT = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
  let stream = null;
  let aktiv = false;
  let detektor = null;

  // Kontrollsiffran stämmer för EAN-8, UPC-A (12), EAN-13 och GTIN-14
  function giltig(kod) {
    if (!/^\d{8}$|^\d{12,14}$/.test(kod)) return false;
    const siffror = kod.split('').map(Number);
    const kontroll = siffror.pop();
    let summa = 0;
    siffror.reverse().forEach((s, i) => { summa += s * (i % 2 === 0 ? 3 : 1); });
    return (10 - (summa % 10)) % 10 === kontroll;
  }

  // UPC-A (12 siffror) slås upp som EAN-13 med inledande nolla, som OFF lagrar den
  const normalisera = (kod) => (kod.length === 12 ? '0' + kod : kod);

  async function skapaDetektor() {
    if (detektor) return detektor;
    if ('BarcodeDetector' in window) {
      try {
        const stod = await window.BarcodeDetector.getSupportedFormats();
        if (FORMAT.some((f) => stod.includes(f))) return (detektor = new window.BarcodeDetector({ formats: FORMAT }));
      } catch (e) { /* faller tillbaka */ }
    }
    if (window.BarcodeDetectionAPI && window.BarcodeDetectionAPI.BarcodeDetector) {
      return (detektor = new window.BarcodeDetectionAPI.BarcodeDetector({ formats: FORMAT }));
    }
    throw new Error('Streckkodsläsaren kunde inte laddas. Kontrollera täckningen.');
  }

  async function start(video, onKod) {
    stop();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Kameran stöds inte i den här webbläsaren.');
    }
    const det = await skapaDetektor();
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    video.srcObject = stream;
    video.setAttribute('playsinline', '');
    video.muted = true;
    await video.play();
    aktiv = true;

    let senast = 0;
    const loop = async (t) => {
      if (!aktiv) return;
      if (t - senast > 180 && video.readyState >= 2) {
        senast = t;
        try {
          const hits = await det.detect(video);
          for (const h of hits) {
            const kod = String(h.rawValue || '').trim();
            if (giltig(kod)) { stop(); onKod(normalisera(kod)); return; }
          }
        } catch (e) { /* enstaka bildrutor kan misslyckas */ }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function stop() {
    aktiv = false;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  return { start, stop, giltig, normalisera };
})();
