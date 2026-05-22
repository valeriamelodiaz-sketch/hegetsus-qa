import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ExplorePage } from '../pages/ExplorePage';

test('print all page texts', async ({ page }) => {
  const homePage = new HomePage(page);
  const explorePage = new ExplorePage(page);
  await page.goto('https://dev-site.hegetsus.com/explore?journey=doubt');
  await page.waitForTimeout(4000);

  await explorePage.scrollToSectionN(5);
  await page.waitForTimeout(3000);

  const texts = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div.text-block'));
    return elements.map(el => (el as HTMLElement).innerText).filter(t => t && t.trim().length > 0 && t.trim().length < 200);
  });

  console.log('--- ALL FOUND TEXTS ---');
  console.log(JSON.stringify(Array.from(new Set(texts)), null, 2));
});
