import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { FooterComponent } from '../pages/components/FooterComponent';
import { ScreenshotHelper } from '../utils/screenshot-helper';

test.describe('BUG-02 — Footer: Botones Accessibility y Cookie Preferences no funcionan', () => {
  let homePage: HomePage;
  let footer: FooterComponent;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    footer = new FooterComponent(page);
    await homePage.goto();
    await footer.scrollToFooter();
  });

  test('el botón Accessibility debe estar visible en el footer', async () => {
    expect(await footer.isAccessibilityButtonVisible()).toBe(true);
  });

  test('el botón Accessibility debe abrir un modal o overlay al hacer click', async ({ page }) => {
    const testName = 'bug02_accessibility_click';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    const result = await footer.clickAccessibility();

    const screenshotPath = await screenshotHelper.capture('accessibility-clicked');
    await test.info().attach('accessibility-screenshot', { path: screenshotPath, contentType: 'image/png' });

    expect(result.dialogOpened, 'Se espera que Accessibility abra un modal o overlay. BUG: no ocurre ninguna acción visible.').toBe(true);
  });

  test('el botón Cookie Preferences debe estar visible en el footer', async () => {
    expect(await footer.isCookieButtonVisible()).toBe(true);
  });

  test('el botón Cookie Preferences debe abrir un panel de cookies al hacer click', async ({ page }) => {
    const testName = 'bug02_cookie_click';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    const result = await footer.clickCookiePreferences();

    const screenshotPath = await screenshotHelper.capture('cookie-preferences-clicked');
    await test.info().attach('cookie-screenshot', { path: screenshotPath, contentType: 'image/png' });

    expect(result.dialogOpened, 'Se espera que Cookie Preferences abra un panel de gestión de cookies. BUG: no ocurre ninguna acción visible.').toBe(true);
  });
});
