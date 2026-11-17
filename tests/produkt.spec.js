const { test, expect, bild, EAN } = require('./hjalp');

test.describe('Vara', () => {
  test('tillsatserna listas med de omdiskuterade först', { annotation: { type: 'testfall', description: 'TC-PRO-01' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.glass);
    await expect(page.locator('#p-namn')).toHaveText('Vaniljglass');
    await expect(page.locator('#p-antal b')).toHaveText('4');
    await expect(page.locator('#p-obs b')).toHaveText('2');
    const koder = page.locator('#p-lista .kod');
    await expect(koder).toHaveText(['E407', 'E471', 'E160a', 'E412']);
    await expect(page.locator('#p-lista .kod.obs')).toHaveCount(2);
    await bild(page, 'Vara med tillsatser');
  });

  test('NOVA-graden visas', { annotation: { type: 'testfall', description: 'TC-PRO-02' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.glass);
    await expect(page.locator('#p-nova')).toContainText('NOVA 4');
    await expect(page.locator('#p-nova')).toContainText('Ultraprocessad');
  });

  test('tillsatser hittas med svenska namn i ingredienstexten', { annotation: { type: 'testfall', description: 'TC-PRO-03' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.dryck);
    await expect(page.locator('#p-namn')).toHaveText('Havredryck');
    await expect(page.locator('#p-lista .kod')).toHaveText(['E340', 'E170']);
    await bild(page, 'Tillsatser ur ingredienstext');
  });

  test('vara utan ingredienslista får en varning', { annotation: { type: 'testfall', description: 'TC-PRO-04' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.utanLista);
    await expect(page.locator('#p-namn')).toHaveText('Knäckebröd');
    await expect(page.locator('#p-ingen-lista')).toContainText('Ingredienslistan saknas');
  });

  test('vara som saknas i Open Food Facts', { annotation: { type: 'testfall', description: 'TC-PRO-05' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.saknas);
    await expect(page.getByRole('heading', { name: 'Varan saknas i Open Food Facts' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lägg till varan i Open Food Facts' })).toHaveAttribute('href', new RegExp(EAN.saknas));
    await bild(page, 'Varan saknas');
  });

  test('utan täckning visas fel och försök igen', { annotation: { type: 'testfall', description: 'TC-PRO-06' } }, async ({ page, api }) => {
    await page.goto('./#/produkt/' + EAN.fel);
    await expect(page.getByRole('heading', { name: 'Kunde inte hämta varan' })).toBeVisible();
    await page.getByRole('button', { name: 'Försök igen' }).click();
    await expect(page.getByRole('heading', { name: 'Kunde inte hämta varan' })).toBeVisible();
    expect(api.anrop.filter((e) => e === EAN.fel)).toHaveLength(2);
  });
});
