import { test } from '@playwright/test';

test('debug explore scroll', async ({ page }) => {
  await page.goto('https://dev-site.hegetsus.com/explore?journey=be');
  await page.waitForTimeout(5000);
  
  // Accept cookies first
  const acceptCookieBtn = page.getByRole('button', { name: /accept|permitir/i }).or(page.locator('button').filter({ hasText: 'ACCEPT' }));
  if (await acceptCookieBtn.count() > 0) {
    await acceptCookieBtn.first().click();
    await page.waitForTimeout(1000);
  }

  console.log('--- URL ACTUAL ---', page.url());
  
  // Let's inspect the page scroll elements
  const scrollableElements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const scrollables: string[] = [];
    all.forEach(el => {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      const overflowX = style.overflowX;
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') {
        scrollables.push(`${el.tagName}.${el.className} [overflowY=${overflowY}, overflowX=${overflowX}] scrollHeight=${el.scrollHeight}, clientHeight=${el.clientHeight}`);
      }
    });
    return scrollables;
  });
  console.log('--- ELEMENTOS CON SCROLL COMPLETO ---', scrollableElements);

  // Let's get heights
  const heights = await page.evaluate(() => {
    return {
      windowHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
      scrollY: window.scrollY
    };
  });
  console.log('--- ALTURAS ---', heights);

  // Let's try normal scroll and check scrollY
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(1000);
  const scrollYAfterNormal = await page.evaluate(() => window.scrollY);
  console.log('--- scrollY despues de window.scrollBy(0, 1000) ---', scrollYAfterNormal);

  // Let's capture the screenshot at the top
  await page.screenshot({ path: 'explore-scroll-top.png' });

  // Let's find sections and scroll to each using scrollIntoView
  const sectionsCount = await page.locator('section, [class*="section"]').count();
  console.log('--- CANTIDAD DE SECCIONES ---', sectionsCount);
  
  for (let i = 0; i < sectionsCount; i++) {
    const text = await page.locator('section, [class*="section"]').nth(i).innerText();
    console.log(`Sección ${i} primer texto:`, text.split('\n')[0]);
  }

  // Try scrolling to section 3 and check screenshot
  if (sectionsCount > 2) {
    console.log('Scrolling to section index 2 (third section) via scrollIntoView...');
    await page.locator('section, [class*="section"]').nth(2).scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'explore-scroll-section3.png' });
  }
});
