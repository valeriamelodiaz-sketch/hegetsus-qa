import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { FooterComponent } from '../pages/components/FooterComponent';
import { ScreenshotHelper } from '../utils/screenshot-helper';

test.describe('BUG-03 — Footer: Contact Us y Press Inquiries son mailto links no funcionales', () => {
  let homePage: HomePage;
  let footer: FooterComponent;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    footer = new FooterComponent(page);
    await homePage.goto();
    await footer.scrollToFooter();
  });

  test('Contact Us debe ser visible y tener href válido', async () => {
    const href = await footer.getContactUsHref();
    expect(href).not.toBeNull();
    expect(href).toBe('mailto:info@hegetsus.com');
  });

  test('Press Inquiries debe ser visible y tener href válido', async () => {
    const href = await footer.getPressInquiriesHref();
    expect(href).not.toBeNull();
    expect(href).toBe('mailto:press@hegetsus.com');
  });

  test('Ambos links deben ser mailto y apuntar a dominios hegetsus.com', async () => {
    const validation = await footer.validateMailtoLinks();
    expect(validation.bothAreMailto).toBe(true);
    expect(validation.contactUsIsValid).toBe(true);
    expect(validation.pressInquiriesIsValid).toBe(true);
  });

  test('Los links mailto no deben navegar en el browser (documentación de comportamiento esperado)', async ({ page }) => {
    const testName = 'bug03_mailto_navigation';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    let navigationOccurred = false;
    
    // Set up request listener to capture if browser tries to request anything related to mailto
    page.on('request', (request) => {
      const url = request.url();
      if (url.startsWith('http') && (url.includes('info@hegetsus.com') || url.includes('press@hegetsus.com'))) {
        navigationOccurred = true;
      }
    });

    const contactUsBtn = page.locator('a[href*="mailto:info@hegetsus.com"]').filter({ visible: true }).first();
    await contactUsBtn.scrollIntoViewIfNeeded();
    await contactUsBtn.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(500);
    await contactUsBtn.dispatchEvent('click');
    await page.waitForTimeout(1000);

    const screenshotPath = await screenshotHelper.capture('mailto-clicked');
    await test.info().attach('mailto-click-screenshot', { path: screenshotPath, contentType: 'image/png' });

    // Expect that no browser HTTP navigation was initiated for this mailto link
    expect(navigationOccurred).toBe(false);
  });
});
