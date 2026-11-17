// Lokal lagring i IndexedDB: varje skannad vara sparas med OFF-data, så att samma vara
// öppnas direkt nästa gång och fungerar utan täckning. Fungerar även som historik.
window.TKLager = (function () {
  'use strict';

  const DB_NAME = 'tillsatskoll';
  const STORE = 'produkter';
  let dbPromise = null;

  function db() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'ean' });
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }

  async function tx(mode, fn) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const t = d.transaction(STORE, mode);
      const req = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(req ? req.result : undefined);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }

  const hamta = (ean) => tx('readonly', (s) => s.get(ean)).catch(() => null);
  const spara = (rad) => tx('readwrite', (s) => s.put(rad)).catch(() => {});
  const ta = (ean) => tx('readwrite', (s) => s.delete(ean)).catch(() => {});
  const rensa = () => tx('readwrite', (s) => s.clear()).catch(() => {});

  async function alla() {
    const rader = (await tx('readonly', (s) => s.getAll()).catch(() => [])) || [];
    return rader.filter((r) => r.skannad).sort((a, b) => b.skannad - a.skannad);
  }

  return { hamta, spara, ta, rensa, alla };
})();
