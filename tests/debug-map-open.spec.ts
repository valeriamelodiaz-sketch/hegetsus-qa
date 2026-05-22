import { test } from '@playwright/test';

test('debug map filters loading', async ({ page }) => {
  await page.goto('https://dev-site.hegetsus.com/articles');
  await page.waitForTimeout(3000);

  // Accept cookies first to get rid of cookies overlay
  const acceptCookieBtn = page.getByRole('button', { name: /accept|permitir/i }).or(page.locator('button').filter({ hasText: 'ACCEPT' }));
  if (await acceptCookieBtn.count() > 0) {
    await acceptCookieBtn.first().click();
    await page.waitForTimeout(2000);
    console.log('Cookies aceptadas.');
  }

  // Find the real filter icon of the page (not the cookies one)
  // Let's list all elements with class containing filter or text containing filter inside main or outside the cookie banner
  const filterButtons = page.locator('button').filter({ hasText: /filter/i }).or(page.locator('[class*="Filter"]')).or(page.locator('[id*="filter"]'));
  const count = await filterButtons.count();
  console.log('Total filter-related buttons:', count);

  for (let i = 0; i < count; i++) {
    const el = filterButtons.nth(i);
    const id = await el.getAttribute('id');
    const className = await el.getAttribute('class');
    const text = await el.innerText();
    const isVisible = await el.isVisible();
    console.log(`Button ${i}: id="${id}", class="${className}", text="${text}", visible=${isVisible}`);
  }

  // Click the visible filter button that is NOT inside cookies banner
  const realFilterBtn = page.locator('main button').filter({ hasText: /filter/i })
    .or(page.locator('button').filter({ hasText: 'Filter Icon' }))
    .or(page.locator('button[class*="Filter"]'))
    .filter({ visible: true })
    .first();

  if (await realFilterBtn.count() > 0) {
    console.log('Clicking on real filter button...');
    await realFilterBtn.click();
    await page.waitForTimeout(3000);
    console.log('Clicked real filter button.');
  } else {
    // Let's try page.mouse click at coordinates of filter icon if we can't click it directly
    console.log('Real filter button not found or not visible, trying default click.');
  }

  console.log('--- URL ACTUAL ---', page.url());
  const fieldsetsAfter = await page.locator('fieldset').allInnerTexts();
  console.log('--- FIELDSETS ENCONTRADOS DESPUES DE CLICK ---', fieldsetsAfter);

  const buttonsAfter = await page.locator('button').allInnerTexts();
  console.log('--- BOTONES ENCONTRADOS DESPUES DE CLICK ---', buttonsAfter);

  await page.screenshot({ path: 'debug-map-filters-open.png', fullPage: true });
});
