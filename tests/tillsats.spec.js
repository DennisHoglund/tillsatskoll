const { test, expect, bild, EAN } = require('./hjalp');

test.describe('Tillsats', () => {
  test('förklaringen visas när man trycker på en tillsats', { annotation: { type: 'testfall', description: 'TC-TIL-01' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.glass);
    await page.locator('#p-lista a', { hasText: 'E471' }).click();
    await expect(page.locator('.stor-kod')).toHaveText('E471');
    await expect(page.getByRole('heading', { name: 'Mono- och diglycerider av fettsyror' })).toBeVisible();
    await expect(page.locator('.status')).toHaveText('Omdiskuterad');
    await expect(page.getByText('Vad är det?')).toBeVisible();
    await expect(page.getByText('Varför används det?')).toBeVisible();
    await bild(page, 'Tillsats E471');
  });

  test('tillbaka går till varan', { annotation: { type: 'testfall', description: 'TC-TIL-02' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.glass);
    await page.locator('#p-lista a', { hasText: 'E412' }).click();
    await expect(page.locator('.stor-kod')).toHaveText('E412');
    await page.locator('#vy-tillsats').getByRole('button', { name: 'Tillbaka' }).click();
    await expect(page.locator('#p-namn')).toHaveText('Vaniljglass');
  });
});
