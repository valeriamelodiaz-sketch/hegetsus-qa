import { test } from '@playwright/test';

test('inspect explore DOM structure', async ({ page }) => {
  await page.goto('https://dev-site.hegetsus.com/explore?journey=be');
  await page.waitForTimeout(5000);

  // Accept cookies if visible
  const acceptCookieBtn = page.getByRole('button', { name: /accept|permitir/i }).or(page.locator('button').filter({ hasText: 'ACCEPT' }));
  if (await acceptCookieBtn.count() > 0) {
    await acceptCookieBtn.first().click();
    await page.waitForTimeout(1000);
  }

  // Log information about the wrappers and carousel
  const structure = await page.evaluate(() => {
    const getSelector = (el: Element): string => {
      let path = el.tagName.toLowerCase();
      if (el.id) {
        path += '#' + el.id;
      }
      if (el.className) {
        path += '.' + Array.from(el.classList).join('.');
      }
      return path;
    };

    const wrapper = document.querySelector('[class*="LandingPage_wrapper"]') as HTMLElement;
    const carousel = document.querySelector('[class*="JourneyCarousel_root"]') as HTMLElement;

    const info: any = {};
    if (wrapper) {
      info.wrapper = {
        selector: getSelector(wrapper),
        childrenCount: wrapper.children.length,
        children: Array.from(wrapper.children).map(c => ({
          selector: getSelector(c),
          text: (c as HTMLElement).innerText?.slice(0, 100) || ''
        }))
      };
    }
    if (carousel) {
      info.carousel = {
        selector: getSelector(carousel),
        childrenCount: carousel.children.length,
        children: Array.from(carousel.children).map(c => ({
          selector: getSelector(c),
          text: (c as HTMLElement).innerText?.slice(0, 100) || ''
        }))
      };
    }

    // Find all elements containing text like Oscar Wilde or prison
    const elements = Array.from(document.querySelectorAll('*'));
    const matched: any[] = [];
    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.innerText && (htmlEl.innerText.includes('Wilde') || htmlEl.innerText.includes('prison') || htmlEl.innerText.includes('real TEST'))) {
        // Let's filter to direct parents of the text nodes
        if (htmlEl.children.length === 0 || (htmlEl.children.length === 1 && htmlEl.children[0].tagName === 'BR')) {
          matched.push({
            selector: getSelector(htmlEl),
            text: htmlEl.innerText,
            parent: getSelector(htmlEl.parentElement!)
          });
        }
      }
    });
    info.matchedTextElements = matched;

    return info;
  });

  console.log('--- EXPLORE STRUCTURE ---');
  console.log(JSON.stringify(structure, null, 2));
});
