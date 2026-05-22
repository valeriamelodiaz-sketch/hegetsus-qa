import { Page, Locator } from '@playwright/test';

export class FooterComponent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get accessibilityButton(): Locator {
    return this.page.locator('button[data-acsb-custom-trigger="true"]').filter({ visible: true }).first();
  }

  private get cookiePreferencesButton(): Locator {
    return this.page.locator('button.hover\\:opacity-70').filter({ hasText: 'Cookie Preferences', visible: true }).first();
  }

  private get contactUsLink(): Locator {
    return this.page.locator('a[href*="mailto:info@hegetsus.com"]').or(this.page.locator('a').filter({ hasText: 'Contact Us' })).filter({ visible: true }).first();
  }

  private get pressInquiriesLink(): Locator {
    return this.page.locator('a[href*="mailto:press@hegetsus.com"]').or(this.page.locator('a').filter({ hasText: 'Press Inquiries' })).filter({ visible: true }).first();
  }

  async scrollToFooter(): Promise<void> {
    await this.page.locator('footer').scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  async clickAccessibility(): Promise<{ responseReceived: boolean; dialogOpened: boolean; error?: string }> {
    try {
      await this.accessibilityButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.accessibilityButton.scrollIntoViewIfNeeded();
      await this.accessibilityButton.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await this.page.waitForTimeout(500);
      await this.accessibilityButton.click({ force: true });
      
      // Wait for any accessibility modal/dialog to appear (e.g. elements with accessibility classes or role="dialog" or id containing acsb)
      await this.page.waitForSelector('[role="dialog"], [class*="acsb"], [id*="acsb"]', { state: 'visible', timeout: 3000 });
      
      return { responseReceived: true, dialogOpened: true };
    } catch (e: any) {
      return { responseReceived: true, dialogOpened: false, error: e.message };
    }
  }

  async clickCookiePreferences(): Promise<{ responseReceived: boolean; dialogOpened: boolean; error?: string }> {
    try {
      await this.cookiePreferencesButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.cookiePreferencesButton.scrollIntoViewIfNeeded();
      await this.cookiePreferencesButton.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await this.page.waitForTimeout(500);
      await this.cookiePreferencesButton.click({ force: true });
      
      // Wait for cookie dialog/panel to appear
      await this.page.waitForSelector('[class*="cookie"], [class*="modal"], [id*="cookie"], [class*="ot-sdk-consent"]', { state: 'visible', timeout: 3000 });
      
      return { responseReceived: true, dialogOpened: true };
    } catch (e: any) {
      return { responseReceived: true, dialogOpened: false, error: e.message };
    }
  }

  async getContactUsHref(): Promise<string | null> {
    await this.contactUsLink.waitFor({ state: 'visible', timeout: 5000 });
    return await this.contactUsLink.getAttribute('href');
  }

  async getPressInquiriesHref(): Promise<string | null> {
    await this.pressInquiriesLink.waitFor({ state: 'visible', timeout: 5000 });
    return await this.pressInquiriesLink.getAttribute('href');
  }

  async isAccessibilityButtonVisible(): Promise<boolean> {
    return await this.accessibilityButton.isVisible();
  }

  async isCookieButtonVisible(): Promise<boolean> {
    return await this.cookiePreferencesButton.isVisible();
  }

  async validateMailtoLinks(): Promise<{
    contactUs: string | null;
    pressInquiries: string | null;
    bothAreMailto: boolean;
    contactUsIsValid: boolean;
    pressInquiriesIsValid: boolean;
  }> {
    const contactUs = await this.getContactUsHref();
    const pressInquiries = await this.getPressInquiriesHref();

    const bothAreMailto = !!(contactUs?.startsWith('mailto:') && pressInquiries?.startsWith('mailto:'));
    const contactUsIsValid = contactUs === 'mailto:info@hegetsus.com';
    const pressInquiriesIsValid = pressInquiries === 'mailto:press@hegetsus.com';

    return {
      contactUs,
      pressInquiries,
      bothAreMailto,
      contactUsIsValid,
      pressInquiriesIsValid
    };
  }
}
