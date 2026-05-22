import { Page, Locator } from '@playwright/test';
import { ScrollHelper } from '../utils/scroll-helper';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://dev-site.hegetsus.com';
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(this.baseUrl + path, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageReady(): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch (e) {
      // Ignore networkidle timeouts as some trackers may continue running
    }
    await this.page.waitForFunction(() => document.readyState === 'complete');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async scrollToBottom(): Promise<void> {
    const scrollHelper = new ScrollHelper(this.page);
    await scrollHelper.scrollToBottom();
  }

  protected async waitForSelector(selector: string, timeout?: number): Promise<Locator> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
    return this.page.locator(selector);
  }
}
