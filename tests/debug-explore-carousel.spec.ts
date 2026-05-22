import { test } from '@playwright/test';

test('debug explore carousel elements', async ({ page }) => {
  await page.goto('https://dev-site.hegetsus.com/explore?journey=be');
  await page.waitForTimeout(5000);
  
  // Accept cookies first
  const acceptCookieBtn = page.getByRole('button', { name: /accept|permitir/i }).or(page.locator('button').filter({ hasText: 'ACCEPT' }));
  if (await acceptCookieBtn.count() > 0) {
    await acceptCookieBtn.first().click();
    await page.waitForTimeout(1000);
  }

  // Inspect all SVG elements and interactive elements inside the carousel
  const interactiveElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, a, svg, [role="button"], [class*="arrow"], [class*="btn"]'));
    return elements.map((el, index) => {
      return {
        index,
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        text: (el as HTMLElement).innerText || '',
        ariaLabel: el.getAttribute('aria-label') || '',
        svgPaths: el.tagName === 'svg' ? Array.from(el.querySelectorAll('path')).map(p => p.getAttribute('d')) : []
      };
    });
  });
  console.log('--- ELEMENTOS INTERACTIVOS ENCONTRADOS ---', JSON.stringify(interactiveElements, null, 2));

  // Let's search specifically for the arrow button on the right
  const rightArrow = page.locator('svg').filter({ has: page.locator('path') }).locator('..').filter({ hasNotText: /.*/ }); // Or something similar
  
  // We can try to click on the right arrow by locating the next slide button or the arrow on the right side of the screen
  // Let's click the element at coordinates (1100, 450) where the arrow appears roughly (1440 width)
  console.log('Attempting click on arrow at coordinates...');
  await page.mouse.click(1100, 450);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'explore-carousel-after-click1.png' });

  // Let's try again
  await page.mouse.click(1100, 450);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'explore-carousel-after-click2.png' });
});
