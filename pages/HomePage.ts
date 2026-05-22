import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get exploreButton(): Locator {
    return this.page.getByText('Explore', { exact: false }).first();
  }

  private get footerSection(): Locator {
    return this.page.locator('footer');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForPageReady();
  }

  async clickExploreButton(): Promise<void> {
    await this.exploreButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.exploreButton.click();
  }
}
