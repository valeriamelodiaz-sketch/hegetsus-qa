import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ExplorePage } from '../pages/ExplorePage';
import { ScreenshotHelper } from '../utils/screenshot-helper';

test.describe('BUG-01 — Explore Flow: Texto superpuesto en sección 5', () => {
  let homePage: HomePage;
  let explorePage: ExplorePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    explorePage = new ExplorePage(page);
    await explorePage.gotoJourneyBe();
    
    // Accept cookies to clear viewport
    const cookieBtn = page.locator('button#onetrust-accept-btn-handler, button:has-text("ACCEPT"), button:has-text("Accept"), button:has-text("Aceptar")').filter({ visible: true }).first();
    if (await cookieBtn.count() > 0) {
      try {
        await cookieBtn.click({ timeout: 3000 });
        await page.waitForTimeout(1000);
      } catch (e) {
        // Ignore
      }
    }
  });

  test('debe detectar superposición de texto en sección 5 del Explore Flow', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    const testName = 'bug01_text_overlap';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    await explorePage.scrollToSectionN(5);
    await page.waitForTimeout(2000);

    const overlapDetected = await explorePage.detectTextOverlap();
    
    // Capture screenshot as evidence
    const screenshotPath = await screenshotHelper.capture('section-5-text-overlap');
    await test.info().attach('screenshot-overlap', { path: screenshotPath, contentType: 'image/png' });

    // Since the text overlap IS the bug, we assert it is true to confirm the presence of the bug
    expect(overlapDetected, 'Se espera que haya superposición de texto en la sección 5 del Explore Flow').toBe(true);
  });

  test('debe tomar screenshots de las secciones 1 a 5 del carrusel para documentar el progreso del bug', async ({ page }) => {
    const testName = 'bug01_carousel_progress';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    for (let i = 1; i <= 5; i++) {
      await explorePage.scrollToSectionN(i);
      await page.waitForTimeout(1500);
      const screenshotPath = await screenshotHelper.capture(`section-${i}`);
      await test.info().attach(`section-${i}-screenshot`, { path: screenshotPath, contentType: 'image/png' });
    }

    expect(true).toBe(true); // Always passes, documents flow
  });
});
