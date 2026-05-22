import { test, expect } from '@playwright/test';
import { ArticlesMapPage } from '../pages/ArticlesMapPage';
import { ScreenshotHelper } from '../utils/screenshot-helper';

test.describe('BUG-05 — Articles Map: Lógica invertida en filtros de ubicación y días', () => {
  let mapPage: ArticlesMapPage;

  test.beforeEach(async ({ page }) => {
    mapPage = new ArticlesMapPage(page);
    await mapPage.goto();
    await mapPage.openFiltersPanel();
  });

  test('seleccionar In Person debe mostrar Alpha IN PERSON, no Online', async ({ page }) => {
    const testName = 'bug05_in_person_filter';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    await mapPage.clickInPersonFilter();
    await page.waitForTimeout(1000);

    const state = await mapPage.getLocationFilterState();

    const screenshotPath = await screenshotHelper.capture('in-person-selected');
    await test.info().attach('in-person-screenshot', { path: screenshotPath, contentType: 'image/png' });

    expect(state.inPersonActive).toBe(true);
    // Since showing Online is the bug when In Person is selected, we assert onlineAlphasVisible is false.
    // This will FAIL when the bug is present, demonstrating the defect.
    expect(state.onlineAlphasVisible, 'BUG: Se muestran resultados Online cuando el filtro está configurado para In Person').toBe(false);
    expect(state.inPersonAlphasVisible, 'BUG: No se muestran resultados In Person cuando el filtro está configurado para In Person').toBe(true);
  });

  test('seleccionar Online debe mostrar Alpha Online, no In Person', async ({ page }) => {
    const testName = 'bug05_online_filter';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    await mapPage.clickOnlineFilter();
    await page.waitForTimeout(1000);

    const state = await mapPage.getLocationFilterState();

    const screenshotPath = await screenshotHelper.capture('online-selected');
    await test.info().attach('online-screenshot', { path: screenshotPath, contentType: 'image/png' });

    expect(state.onlineActive).toBe(true);
    // Since showing In Person is the bug when Online is selected, we assert inPersonAlphasVisible is false.
    // This will FAIL when the bug is present, demonstrating the defect.
    expect(state.inPersonAlphasVisible, 'BUG: Se muestran resultados In Person cuando el filtro está configurado para Online').toBe(false);
    expect(state.onlineAlphasVisible, 'BUG: No se muestran resultados Online cuando el filtro está configurado para Online').toBe(true);
  });

  test('seleccionar un día específico NO debe mostrar "All Days of the Week"', async ({ page }) => {
    const testName = 'bug05_single_day_filter';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    // Let's select 'Monday' (or 'Lunes' if in Spanish environment, but standard is 'Monday')
    await mapPage.selectDay('Monday');
    await page.waitForTimeout(1000);

    const daysStateText = await mapPage.getDaysFilterText();

    const screenshotPath = await screenshotHelper.capture('monday-selected');
    await test.info().attach('monday-screenshot', { path: screenshotPath, contentType: 'image/png' });

    // Since showing 'All' is the bug when a single day is selected, we assert that the text is not 'All Days of the Week' or does not contain 'All'
    expect(daysStateText, 'BUG: Se sigue mostrando "All Days of the Week" incluso al seleccionar un solo día').not.toBe('All Days of the Week');
    expect(daysStateText.toLowerCase(), 'BUG: El filtro no debe contener la palabra "All" cuando se elige un día específico').not.toContain('all');
  });

  test('seleccionar todos los días debe mostrar el ícono "All Days of the Week"', async ({ page }) => {
    const testName = 'bug05_all_days_icon';
    const screenshotHelper = new ScreenshotHelper(page, testName);

    await mapPage.selectAllDays();
    await page.waitForTimeout(1500);

    const allDaysState = await mapPage.getAllDaysFilterState();

    const screenshotPath = await screenshotHelper.capture('all-days-selected');
    await test.info().attach('all-days-screenshot', { path: screenshotPath, contentType: 'image/png' });

    // Since the icon disappearing is the bug when all days are selected, we assert it is visible.
    // This will FAIL when the bug is present, confirming the defect.
    expect(allDaysState.iconVisible, 'BUG: El ícono de "All Days" desaparece cuando todos los días están seleccionados').toBe(true);
  });
});
