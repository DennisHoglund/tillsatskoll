const { test, expect, bild, skrivIn, EAN } = require('./hjalp');

test.describe('Historik och offline', () => {
  test('skannad vara hamnar i historiken och som senast skannat', { annotation: { type: 'testfall', description: 'TC-HIS-01' } }, async ({ page, api }) => {
    await page.goto('./');
    await skrivIn(page, EAN.dryck);
    await expect(page.locator('#p-namn')).toHaveText('Havredryck');
    await page.getByRole('link', { name: 'Skanna' }).click();
    await skrivIn(page, EAN.glass);
    await expect(page.locator('#p-namn')).toHaveText('Vaniljglass');

    await page.getByRole('link', { name: 'Historik' }).click();
    await expect(page.locator('#h-lista .namn')).toHaveText(['Vaniljglass', 'Havredryck']);
    await bild(page, 'Historik');

    await page.getByRole('link', { name: 'Skanna' }).click();
    await expect(page.locator('#senast')).toContainText('Vaniljglass');
    await expect(page.locator('#senast')).toContainText('2 omdiskuterade');
  });

  test('sparad vara öppnas utan täckning', { annotation: { type: 'testfall', description: 'TC-HIS-02' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.glass);
    await expect(page.locator('#p-namn')).toHaveText('Vaniljglass');
    api.natVag = false;
    await page.goto('./#/');
    await page.reload();
    await page.goto('./#/produkt/' + EAN.glass);
    await expect(page.locator('#p-namn')).toHaveText('Vaniljglass');
    await expect(page.locator('#p-lista .kod')).toHaveCount(4);
    expect(api.anrop).toHaveLength(1);
  });

  test('historiken går att rensa', { annotation: { type: 'testfall', description: 'TC-HIS-03' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.glass);
    await expect(page.locator('#p-namn')).toHaveText('Vaniljglass');
    await page.goto('./#/historik');
    page.once('dialog', (d) => d.accept());
    await page.getByRole('button', { name: 'Rensa historiken' }).click();
    await expect(page.locator('#h-tom')).toBeVisible();
  });
});
