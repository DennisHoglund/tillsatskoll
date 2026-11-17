// Gemensamma hjälpfunktioner och fixturer för testerna.
const base = require('@playwright/test');
const { mocka, EAN } = require('./mock');

const test = base.test.extend({
  // Mockar allt externt innan varje test. api ger tillgång till loggade OFF-anrop.
  api: async ({ page }, use) => {
    await use(await mocka(page));
  }
});

// Skriver in en streckkod för hand, som när kameran inte går att använda
async function skrivIn(page, ean) {
  await page.getByRole('button', { name: 'Skriv in streckkoden' }).click();
  await page.getByLabel('Streckkod', { exact: true }).fill(ean);
  await page.getByRole('button', { name: 'Visa vara' }).click();
}

// Bifogar en skärmdump till rapporten
async function bild(page, namn) {
  await page.waitForTimeout(250); // låt animationer landa
  await test.info().attach(namn, { body: await page.screenshot(), contentType: 'image/png' });
}

module.exports = { test, expect: base.expect, bild, skrivIn, EAN };
