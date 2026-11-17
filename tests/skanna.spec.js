const { test, expect, bild, skrivIn, EAN } = require('./hjalp');

test.describe('Skanna', () => {
  test('streckkod som skrivs in visar varan', { annotation: { type: 'testfall', description: 'TC-SKA-01' } }, async ({ page, api }) => {
    await page.goto('./');
    await bild(page, 'Skanna');
    await skrivIn(page, EAN.glass);
    await expect(page.locator('#p-namn')).toHaveText('Vaniljglass');
    expect(api.anrop).toEqual([EAN.glass]);
  });

  test('ogiltig streckkod ger tydligt fel', { annotation: { type: 'testfall', description: 'TC-SKA-02' } }, async ({ page, api }) => {
    await page.goto('./');
    await skrivIn(page, '1234567890123');
    await expect(page.locator('#ean-fel')).toContainText('inte ut som en giltig streckkod');
    await bild(page, 'Fel streckkod');
    expect(api.anrop).toHaveLength(0);
  });

  test('utan kamera visas en knapp för att försöka igen', { annotation: { type: 'testfall', description: 'TC-SKA-03' } }, async ({ page, api }) => {
    await page.goto('./');
    await expect(page.locator('#kamera-fel')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Starta kameran' })).toBeVisible();
  });
});
