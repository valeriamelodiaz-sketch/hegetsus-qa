import { test } from '@playwright/test';

test('inspect video elements on explore page', async ({ page }) => {
  await page.goto('https://dev-site.hegetsus.com/explore?journey=be');
  await page.waitForTimeout(5000);

  // Accept cookies if visible
  const acceptCookieBtn = page.getByRole('button', { name: /accept|permitir/i }).or(page.locator('button').filter({ hasText: 'ACCEPT' }));
  if (await acceptCookieBtn.count() > 0) {
    await acceptCookieBtn.first().click();
    await page.waitForTimeout(1000);
  }

  // Scroll to section 4
  const wrapper = page.locator('[class*="LandingPage_wrapper"]').first();
  await page.evaluate(() => {
    const w = document.querySelector('[class*="LandingPage_wrapper"]') as HTMLElement;
    if (w) w.scrollTop = 1440; // Section 4
  });
  await page.waitForTimeout(3000);

  const videoDetails = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('video'));
    return videos.map((v, i) => {
      const htmlV = v as HTMLVideoElement;
      const sources = Array.from(v.querySelectorAll('source'));
      return {
        index: i,
        tagName: v.tagName,
        className: v.className,
        src: htmlV.src,
        error: htmlV.error ? { code: htmlV.error.code, message: htmlV.error.message } : null,
        networkState: htmlV.networkState,
        readyState: htmlV.readyState,
        autoplay: htmlV.autoplay,
        loop: htmlV.loop,
        muted: htmlV.muted,
        paused: htmlV.paused,
        sources: sources.map(s => ({
          tagName: s.tagName,
          src: s.src,
          type: s.type
        })),
        parent: v.parentElement ? `${v.parentElement.tagName}.${v.parentElement.className}` : 'none'
      };
    });
  });

  console.log('--- ALL VIDEO ELEMENTS ON PAGE ---');
  console.log(JSON.stringify(videoDetails, null, 2));
});
