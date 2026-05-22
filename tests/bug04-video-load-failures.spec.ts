import { test, expect } from '@playwright/test';
import { ExplorePage } from '../pages/ExplorePage';
import { ScreenshotHelper } from '../utils/screenshot-helper';
import { TEST_DATA } from '../fixtures/test-data';

test.describe('BUG-04 — Explore Journey BE: Videos e imágenes no cargan en scroll', () => {
  let explorePage: ExplorePage;

  test.beforeEach(async ({ page }) => {
    explorePage = new ExplorePage(page);
    await explorePage.gotoJourneyBe();
  });

  test('debe documentar el estado de carga de videos en cada sección (screenshots)', async ({ page }) => {
    const testName = 'bug04_sections_documentation';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    for (const section of TEST_DATA.videos.journeyBeSections) {
      await explorePage.scrollToSectionN(section);
      await page.waitForTimeout(TEST_DATA.videos.scrollDelayMs);
      
      const beforeScreenshot = await screenshotHelper.capture(`journey-be-section-${section}-before-wait`);
      await test.info().attach(`section-${section}-before-wait`, { path: beforeScreenshot, contentType: 'image/png' });

      await page.waitForTimeout(TEST_DATA.videos.screenshotDelayMs);

      const afterScreenshot = await screenshotHelper.capture(`journey-be-section-${section}-after-wait`);
      await test.info().attach(`section-${section}-after-wait`, { path: afterScreenshot, contentType: 'image/png' });
    }

    expect(true).toBe(true);
  });

  test('debe detectar videos que no cargan en sección 4', async ({ page }) => {
    const testName = 'bug04_videos_failure';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    await explorePage.scrollToSectionN(4);
    await page.waitForTimeout(3000);

    const videoState = await explorePage.getVideoElements();
    
    const screenshotPath = await screenshotHelper.capture('section-4-videos');
    await test.info().attach('section-4-videos-screenshot', { path: screenshotPath, contentType: 'image/png' });

    expect(videoState.total, 'Se espera que haya al menos un video en la página').toBeGreaterThan(0);
    // Since failed videos IS the bug, we assert failed > 0 to confirm the bug.
    // If the bug is NOT present (failed === 0), this test will fail, indicating a change in system behavior.
    expect(videoState.failed, 'Se detectaron videos con errores de carga en la sección 4').toBeGreaterThan(0);
  });

  test('debe detectar imágenes que no cargan en sección 4', async ({ page }) => {
    const testName = 'bug04_images_failure';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    await explorePage.scrollToSectionN(4);
    await page.waitForTimeout(3000);

    const failedImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
      const failedSrcs: string[] = [];
      let failed = 0;

      images.forEach((img) => {
        if (!img.complete || img.naturalWidth === 0 || (img.src && img.src.includes('broken'))) {
          failed++;
          failedSrcs.push(img.src || img.getAttribute('src') || 'no-src');
        }
      });

      return {
        total: images.length,
        failed,
        failedSrcs
      };
    });

    const screenshotPath = await screenshotHelper.capture('section-4-images');
    await test.info().attach('section-4-images-screenshot', { path: screenshotPath, contentType: 'image/png' });
    await test.info().attach('failed-image-urls', { body: JSON.stringify(failedImages.failedSrcs, null, 2), contentType: 'application/json' });

    expect(failedImages.total, 'Se espera que haya imágenes en la página').toBeGreaterThan(0);
    // Since failed images IS the bug, we assert failed > 0 to confirm the bug.
    expect(failedImages.failed, 'Se detectaron imágenes con errores de carga en la sección 4').toBeGreaterThan(0);
  });
});
