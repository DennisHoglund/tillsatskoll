const { test, expect, bild } = require('./hjalp');

test.describe('Lexikon', () => {
  test('sök på svenskt namn', { annotation: { type: 'testfall', description: 'TC-LEX-01' } }, async ({ page, api }) => {
    await page.goto('./#/lexikon');
    await page.getByRole('searchbox', { name: 'Sök tillsats' }).fill('citron');
    await expect(page.locator('#lex-lista .kod')).toHaveText(['E330']);
    await page.locator('#lex-lista a').first().click();
    await expect(page.getByRole('heading', { name: 'Citronsyra' })).toBeVisible();
  });

  test('sök på E-nummer med och utan E', { annotation: { type: 'testfall', description: 'TC-LEX-02' } }, async ({ page, api }) => {
    await page.goto('./#/lexikon');
    await expect(page.locator('#lex-lista .rad').first()).toBeVisible();
    await bild(page, 'Lexikon');
    const sok = page.getByRole('searchbox', { name: 'Sök tillsats' });
    await sok.fill('471');
    await expect(page.locator('#lex-lista .kod')).toHaveText(['E471']);
    await sok.fill('e 250');
    await expect(page.locator('#lex-lista .kod')).toHaveText(['E250']);
    await sok.fill('xyzåäö');
    await expect(page.locator('#lex-tom')).toBeVisible();
  });
});
