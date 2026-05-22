import { test, expect } from '@playwright/test';
import { ArticlesMapPage } from '../pages/ArticlesMapPage';
import { ScreenshotHelper } from '../utils/screenshot-helper';

test.describe('BUG-06 — Articles Map: Filtro de idioma no funciona correctamente', () => {
  let mapPage: ArticlesMapPage;

  test.beforeEach(async ({ page }) => {
    mapPage = new ArticlesMapPage(page);
    await mapPage.goto();
    await mapPage.openFiltersPanel();
  });

  test('All Languages debe estar visible por defecto antes de seleccionar idioma', async ({ page }) => {
    const testName = 'bug06_default_language';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    const isAllVisible = await mapPage.isAllLanguagesVisible();

    const screenshotPath = await screenshotHelper.capture('language-filter-default');
    await test.info().attach('default-language-screenshot', { path: screenshotPath, contentType: 'image/png' });

    expect(isAllVisible).toBe(true);
  });

  test('seleccionar un idioma específico debe desactivar All Languages y activar ese idioma', async ({ page }) => {
    const testName = 'bug06_select_spanish';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    await mapPage.selectLanguage('Spanish');
    await page.waitForTimeout(1000);

    const activeLanguage = await mapPage.getActiveLanguage();
    const isAllVisible = await mapPage.isAllLanguagesVisible();

    const screenshotPath = await screenshotHelper.capture('spanish-selected');
    await test.info().attach('spanish-selected-screenshot', { path: screenshotPath, contentType: 'image/png' });

    // Since the language selection failing IS the bug, this assert will fail if the bug is present
    expect(activeLanguage, 'Se esperaba que el idioma activo sea Spanish. BUG: El filtro de idioma no se actualiza.').toBe('Spanish');
    expect(isAllVisible, 'Se esperaba que la opción All Languages esté inactiva/invisible al seleccionar un idioma').toBe(false);
  });

  test('el filtro de idioma debe reflejar visualmente el idioma seleccionado en el label del filtro', async ({ page }) => {
    const testName = 'bug06_visual_label';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    const filterElement = page.locator('xpath=//*[@id="__next"]/div/main/div/div[1]/fieldset/div')
      .or(page.locator('main fieldset:has-text("Language"), main fieldset:has-text("Idioma"), main fieldset:has-text("Languages")').first());
    const screenshotPathBefore = await screenshotHelper.capture('before-language-selection');
    await test.info().attach('before-language-screenshot', { path: screenshotPathBefore, contentType: 'image/png' });

    // Select Spanish
    await mapPage.selectLanguage('Spanish');
    await page.waitForTimeout(1000);

    const filterTextAfter = await filterElement.innerText();
    const screenshotPathAfter = await screenshotHelper.capture('after-language-selection');
    await test.info().attach('after-language-screenshot', { path: screenshotPathAfter, contentType: 'image/png' });

    // Expecting the label text of the language filter to reflect the selection
    // This will FAIL if it still says "All Languages" or doesn't include "Spanish"
    expect(filterTextAfter, 'BUG: El label del filtro de idiomas no refleja visualmente el idioma seleccionado').toContain('Spanish');
  });
});
