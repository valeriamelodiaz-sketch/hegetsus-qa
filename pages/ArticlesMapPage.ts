import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlesMapPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators using EXACT XPaths provided in IMPLEMENTATION_PLAN.md with robust semantic fallbacks scoped to main to avoid cookie overlay collisions
  private get mapContainer(): Locator {
    return this.page.locator('xpath=//*[@id="__next"]/div/main/div/div[1]')
      .or(this.page.locator('main #map, main [class*="map-container"], main [class*="map"], main > div > div').first());
  }

  private get filtersContainer(): Locator {
    return this.page.locator('xpath=//*[@id="__next"]/div/main/div/div[1]/fieldset/div')
      .or(this.page.locator('main fieldset:has-text("Languages"), main fieldset:has-text("Language"), main fieldset:has-text("Idioma"), main fieldset').first());
  }

  private get locationTypeFilter(): Locator {
    return this.page.locator('xpath=//*[@id="__next"]/div/main/div/div[1]/div[2]/div/div/div/div/div/fieldset[1]/div')
      .or(this.page.locator('main fieldset:has-text("Location"), main fieldset:has-text("Ubicación")').first());
  }

  private get daysFilter(): Locator {
    return this.page.locator('xpath=//*[@id="__next"]/div/main/div/div[1]/div[2]/div/div/div/div/div/fieldset[2]/div')
      .or(this.page.locator('main fieldset:has-text("Day"), main fieldset:has-text("Día")').first());
  }

  private get languageFilter(): Locator {
    return this.page.locator('xpath=//*[@id="__next"]/div/main/div/div[1]/fieldset/div')
      .or(this.page.locator('main fieldset:has-text("Language"), main fieldset:has-text("Idioma"), main fieldset:has-text("Languages")').first());
  }

  async goto(): Promise<void> {
    await this.navigate('/articles');
    await this.waitForPageReady();
    await this.page.waitForTimeout(2000);

    // Accept cookies first to get rid of cookies overlay blocking the filters
    const cookieBtn = this.page.locator('button#onetrust-accept-btn-handler, button:has-text("ACCEPT"), button:has-text("Accept"), button:has-text("Aceptar")').filter({ visible: true }).first();
    if (await cookieBtn.count() > 0) {
      try {
        await cookieBtn.click({ timeout: 3000 });
        await this.page.waitForTimeout(1000);
      } catch (e) {
        // Ignore cookie acceptance errors
      }
    }
  }

  async openFiltersPanel(): Promise<void> {
    // Check if the filter controls (fieldset) are already visible
    const isVisible = await this.filtersContainer.isVisible();
    if (!isVisible) {
      // Locate the main filter button on the page (excluding cookie preferences buttons)
      const triggerButton = this.page.locator('main button').filter({ hasText: /filter/i })
        .or(this.page.locator('main button').filter({ hasText: 'Filter Icon' }))
        .or(this.page.locator('main button[class*="Filter"]'))
        .filter({ visible: true })
        .first();
      
      if (await triggerButton.count() > 0) {
        await triggerButton.click();
        await this.page.waitForTimeout(1500);
      } else {
        // Fallback to general filters trigger
        const generalTrigger = this.page.locator('main').getByRole('button', { name: /filter|find/i })
          .or(this.page.locator('main').getByText(/Find Alpha|Filter/i))
          .filter({ visible: true })
          .first();
        if (await generalTrigger.count() > 0) {
          await generalTrigger.click();
          await this.page.waitForTimeout(1500);
        }
      }
    }

    // Wait for the filters container to become visible
    await this.filtersContainer.waitFor({ state: 'visible', timeout: 5000 });
  }

  async clickInPersonFilter(): Promise<void> {
    const filterOption = this.locationTypeFilter.getByText('In Person', { exact: false });
    await filterOption.waitFor({ state: 'visible', timeout: 5000 });
    await filterOption.click();
    await this.page.waitForTimeout(1000); // Wait for re-render
  }

  async clickOnlineFilter(): Promise<void> {
    const filterOption = this.locationTypeFilter.getByText('Online', { exact: false });
    await filterOption.waitFor({ state: 'visible', timeout: 5000 });
    await filterOption.click();
    await this.page.waitForTimeout(1000); // Wait for re-render
  }

  async getLocationFilterState(): Promise<{
    inPersonActive: boolean;
    onlineActive: boolean;
    inPersonAlphasVisible: boolean;
    onlineAlphasVisible: boolean;
  }> {
    const inPersonBtn = this.locationTypeFilter.getByText('In Person', { exact: false });
    const onlineBtn = this.locationTypeFilter.getByText('Online', { exact: false });

    // Check active states using DOM properties
    const inPersonActive = await inPersonBtn.evaluate((el) => {
      return el.classList.contains('active') || 
             el.classList.contains('bg-black') || 
             el.getAttribute('aria-selected') === 'true' ||
             el.getAttribute('aria-checked') === 'true' ||
             (el as HTMLInputElement).checked === true ||
             el.parentElement?.classList.contains('active') ||
             false;
    });

    const onlineActive = await onlineBtn.evaluate((el) => {
      return el.classList.contains('active') || 
             el.classList.contains('bg-black') || 
             el.getAttribute('aria-selected') === 'true' ||
             el.getAttribute('aria-checked') === 'true' ||
             (el as HTMLInputElement).checked === true ||
             el.parentElement?.classList.contains('active') ||
             false;
    });

    // Check visible results on map/list.
    const resultsLocator = this.page.locator('[class*="result"], [class*="card"], [class*="list-item"], [class*="Marker"]');
    
    const inPersonAlphasVisible = await resultsLocator.filter({ hasText: 'In Person' }).count() > 0;
    const onlineAlphasVisible = await resultsLocator.filter({ hasText: 'Online' }).count() > 0;

    return {
      inPersonActive,
      onlineActive,
      inPersonAlphasVisible,
      onlineAlphasVisible
    };
  }

  async selectDay(dayName: string): Promise<void> {
    const dayBtn = this.daysFilter.getByText(dayName, { exact: false });
    await dayBtn.waitFor({ state: 'visible', timeout: 5000 });
    await dayBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async selectAllDays(): Promise<void> {
    const buttons = await this.daysFilter.locator('button, input[type="checkbox"], label').all();
    for (const btn of buttons) {
      const text = await btn.innerText();
      if (text && text.trim().length > 0 && !text.toLowerCase().includes('all')) {
        await btn.click();
        await this.page.waitForTimeout(200);
      }
    }
  }

  async getDaysFilterText(): Promise<string> {
    const text = await this.daysFilter.innerText();
    return text ? text.trim() : '';
  }

  async getAllDaysFilterState(): Promise<{ text: string; iconVisible: boolean }> {
    const text = await this.getDaysFilterText();
    // Check if an icon/image/svg is visible inside daysFilter that represents the "All Days" status
    const icon = this.daysFilter.locator('svg, img').first();
    const iconVisible = await icon.isVisible();
    return {
      text,
      iconVisible
    };
  }

  async selectLanguage(languageName: string): Promise<void> {
    const langBtn = this.languageFilter.getByText(languageName, { exact: false });
    if (await langBtn.count() > 0) {
      await langBtn.first().click();
    } else {
      const selectEl = this.languageFilter.locator('select');
      if (await selectEl.count() > 0) {
        await selectEl.selectOption({ label: languageName });
      }
    }
    await this.page.waitForTimeout(1000);
  }

  async getActiveLanguage(): Promise<string> {
    const selectEl = this.languageFilter.locator('select');
    if (await selectEl.count() > 0) {
      return await selectEl.inputValue();
    }
    
    const activeBtn = this.languageFilter.locator('.active, [aria-selected="true"], [class*="bg-black"]');
    if (await activeBtn.count() > 0) {
      const text = await activeBtn.first().innerText();
      return text ? text.trim() : '';
    }
    
    const text = await this.languageFilter.innerText();
    return text ? text.trim() : '';
  }

  async isAllLanguagesVisible(): Promise<boolean> {
    const allLangs = this.languageFilter.getByText('All Languages', { exact: false });
    return await allLangs.isVisible();
  }
}
