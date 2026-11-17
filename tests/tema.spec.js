const { test, expect, bild } = require('./hjalp');

test.describe('Tema och app', () => {
  test('temaknappen växlar Auto → Ljust → Mörkt och sparar valet', { annotation: { type: 'testfall', description: 'TC-TEM-01' } }, async ({ page, api }) => {
    await page.goto('./#/historik');
    const knapp = page.locator('#knapp-tema');
    await expect(knapp).toHaveText('Auto');
    await knapp.click();
    await expect(knapp).toHaveText('Ljust');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ljust');
    await bild(page, 'Ljust läge');
    await knapp.click();
    await expect(knapp).toHaveText('Mörkt');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'morkt');
    await expect(page.locator('#knapp-tema')).toHaveText('Mörkt');
    await page.locator('#knapp-tema').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
  });

  test('manifest och ikoner finns för hemskärmen', { annotation: { type: 'testfall', description: 'TC-PWA-01' } }, async ({ page, request }) => {
    await page.goto('./');
    const res = await request.get('./manifest.webmanifest');
    expect(res.ok()).toBeTruthy();
    const m = await res.json();
    expect(m.name).toBe('Tillsatskoll');
    expect(m.display).toBe('standalone');
    for (const i of m.icons) expect((await request.get('./' + i.src)).ok()).toBeTruthy();
    expect((await request.get('./sw.js')).ok()).toBeTruthy();
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', 'icons/apple-touch-icon.png');
  });
});
