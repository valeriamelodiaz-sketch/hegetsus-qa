import { Page, Locator } from '@playwright/test';
import * as path from 'path';

export class ScreenshotHelper {
  private page: Page;
  private testName: string;

  constructor(page: Page, testName: string) {
    this.page = page;
    // Sanitize testName for filenames
    this.testName = testName.replace(/[^a-zA-Z0-9-_]/g, '_');
  }

  private getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
  }

  async capture(label: string): Promise<string> {
    const timestamp = this.getTimestamp();
    const fileName = `${timestamp}-${label}.png`;
    const targetPath = path.join('test-results', 'screenshots', this.testName, fileName);
    await this.page.screenshot({ path: targetPath, fullPage: false });
    return targetPath;
  }

  async captureFullPage(label: string): Promise<string> {
    const timestamp = this.getTimestamp();
    const fileName = `${timestamp}-${label}.png`;
    const targetPath = path.join('test-results', 'screenshots', this.testName, fileName);
    await this.page.screenshot({ path: targetPath, fullPage: true });
    return targetPath;
  }

  async captureElement(locator: Locator, label: string): Promise<string> {
    const timestamp = this.getTimestamp();
    const fileName = `${timestamp}-${label}.png`;
    const targetPath = path.join('test-results', 'screenshots', this.testName, fileName);
    await locator.screenshot({ path: targetPath });
    return targetPath;
  }
}
