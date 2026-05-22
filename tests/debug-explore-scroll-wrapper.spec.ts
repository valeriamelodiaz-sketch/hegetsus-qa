import { test } from '@playwright/test';

test('debug explore scroll wrapper', async ({ page }) => {
  await page.goto('https://dev-site.hegetsus.com/explore?journey=be');
  await page.waitForTimeout(5000);
  
  // Accept cookies
  const acceptCookieBtn = page.getByRole('button', { name: /accept|permitir/i }).or(page.locator('button').filter({ hasText: 'ACCEPT' }));
  if (await acceptCookieBtn.count() > 0) {
    await acceptCookieBtn.first().click();
    await page.waitForTimeout(1000);
  }

  // Scroll using wrapper element scrollTop
  console.log('Attempting scroll on wrapper element...');
  const scrolled = await page.evaluate(() => {
    const wrapper = document.querySelector('[class*="LandingPage_wrapper"]');
    if (wrapper) {
      wrapper.scrollTop = 1000;
      return { found: true, scrollTop: wrapper.scrollTop };
    }
    return { found: false };
  });
  console.log('Scroll result:', scrolled);
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'explore-scrolled-wrapper.png' });

  // Let's scroll to the bottom of wrapper
  const scrolledBottom = await page.evaluate(() => {
    const wrapper = document.querySelector('[class*="LandingPage_wrapper"]');
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
      return { scrollTop: wrapper.scrollTop, scrollHeight: wrapper.scrollHeight };
    }
    return null;
  });
  console.log('Scroll bottom result:', scrolledBottom);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'explore-scrolled-bottom.png' });
});
