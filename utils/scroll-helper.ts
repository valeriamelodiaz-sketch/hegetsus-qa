import { Page, Locator } from '@playwright/test';

export class ScrollHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Scroll in steps towards the specified section using page.evaluate with window.scrollBy.
   * Cumulative scroll down in steps of window.innerHeight * 0.8.
   * Number of steps is approximately sectionIndex * 2.
   * Waits delayMs (default 1500ms) between steps and networkidle after major scrolls.
   */
  async scrollToSection(sectionIndex: number, delayMs: number = 1500): Promise<void> {
    const steps = sectionIndex * 2;
    for (let i = 0; i < steps; i++) {
      await this.page.evaluate(() => {
        const wrapper = document.querySelector('[class*="LandingPage_wrapper"]');
        if (wrapper) {
          wrapper.scrollBy(0, window.innerHeight * 0.8);
        } else {
          window.scrollBy(0, window.innerHeight * 0.8);
        }
      });
      await this.page.waitForTimeout(delayMs);
    }
  }

  /**
   * Progressive scroll to the bottom of the page to load lazy content.
   * Uses a loop with scrollBy(0, 500) every 300ms until scrollY stops changing.
   */
  async scrollToBottom(): Promise<void> {
    let lastScrollY = await this.page.evaluate(() => {
      const wrapper = document.querySelector('[class*="LandingPage_wrapper"]');
      return wrapper ? wrapper.scrollTop : window.scrollY;
    });
    let currentScrollY = -1;

    // Run a maximum of 100 loops to avoid infinite loops in case of dynamic loading height changes
    let loopCount = 0;
    while (lastScrollY !== currentScrollY && loopCount < 100) {
      lastScrollY = currentScrollY;
      await this.page.evaluate(() => {
        const wrapper = document.querySelector('[class*="LandingPage_wrapper"]');
        if (wrapper) {
          wrapper.scrollBy(0, 500);
        } else {
          window.scrollBy(0, 500);
        }
      });
      await this.page.waitForTimeout(300);
      currentScrollY = await this.page.evaluate(() => {
        const wrapper = document.querySelector('[class*="LandingPage_wrapper"]');
        return wrapper ? wrapper.scrollTop : window.scrollY;
      });
      loopCount++;
    }
  }

  /**
   * Scrolls the element into view if needed, and waits 500ms.
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  /**
   * Gets current scroll position.
   */
  async getScrollPosition(): Promise<{ x: number; y: number }> {
    return this.page.evaluate(() => ({
      x: window.scrollX,
      y: window.scrollY
    }));
  }
}
