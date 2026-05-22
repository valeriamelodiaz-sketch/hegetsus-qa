import { test } from '@playwright/test';

test('debug map page clicking filters', async ({ page }) => {
  await page.goto('https://dev-site.hegetsus.com/articles');
  await page.waitForTimeout(3000);
  
  // Accept cookies first to get rid of the cookie overlay
  const acceptCookieBtn = page.getByRole('button', { name: /accept|permitir/i }).or(page.locator('button').filter({ hasText: 'ACCEPT' }));
  if (await acceptCookieBtn.count() > 0) {
    await acceptCookieBtn.first().click();
    await page.waitForTimeout(1000);
    console.log('Cookies aceptadas.');
  }

  // Look for Filter Icon or button
  const filterIcon = page.getByRole('button', { name: /filter/i }).or(page.locator('button').filter({ hasText: 'Filter Icon' })).or(page.locator('[class*="Filter"]'));
  console.log('Count of filter icons:', await filterIcon.count());
  
  if (await filterIcon.count() > 0) {
    await filterIcon.first().click();
    console.log('Filter icon clicked!');
    await page.waitForTimeout(3000);
  }

  console.log('--- URL ACTUAL ---', page.url());
  console.log('--- TITULO ---', await page.title());
  
  const buttons = await page.locator('button').allInnerTexts();
  console.log('--- BOTONES ENCONTRADOS ---', buttons);

  const fieldsets = await page.locator('fieldset').allInnerTexts();
  console.log('--- FIELDSETS ENCONTRADOS ---', fieldsets);

  const mainContent = await page.locator('main').innerText();
  console.log('--- CONTENIDO DE MAIN DESPUES DE CLICK ---', mainContent.slice(0, 1000));
  
  await page.screenshot({ path: 'debug-map-after-click.png', fullPage: true });
});
