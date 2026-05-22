import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ScrollHelper } from '../utils/scroll-helper';
import { ScreenshotHelper } from '../utils/screenshot-helper';

export class ExplorePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get carouselContainer(): Locator {
    return this.page.locator('[class*="carousel"], [class*="scroll"], main').first();
  }

  private get sections(): Locator {
    return this.page.locator('section, [class*="section"]');
  }

  private get allTextContent(): Locator {
    return this.page.locator('p, h1, h2, h3, span, div');
  }

  async gotoJourneyBe(): Promise<void> {
    await this.navigate('/explore?journey=be');
    await this.waitForPageReady();
    await this.page.waitForTimeout(2000); // Wait for initial load animations to stabilize
    
    // Accept cookies to clear viewport and avoid interaction blockages
    const cookieBtn = this.page.locator('button#onetrust-accept-btn-handler, button:has-text("ACCEPT"), button:has-text("Accept"), button:has-text("Aceptar")').filter({ visible: true }).first();
    if (await cookieBtn.count() > 0) {
      try {
        await cookieBtn.click({ timeout: 3000 });
        await this.page.waitForTimeout(1000);
      } catch (e) {
        // Ignore cookie accept errors gracefully
      }
    }
  }

  async scrollToSectionN(n: number): Promise<void> {
    // Make sure cookies are accepted if they appear late
    const cookieBtn = this.page.locator('button#onetrust-accept-btn-handler, button:has-text("ACCEPT"), button:has-text("Accept"), button:has-text("Aceptar")').filter({ visible: true }).first();
    if (await cookieBtn.count() > 0) {
      try {
        await cookieBtn.click({ timeout: 2000 });
        await this.page.waitForTimeout(500);
      } catch (e) {
        // Ignore
      }
    }

    // Wait for sections to load/render dynamically, scrolling down progressively if needed
    const startTime = Date.now();
    let sectionsCount = 0;
    while (Date.now() - startTime < 4000) {
      sectionsCount = await this.page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll('section, [class*="section"]'))
          .filter(el => {
            const className = el.className.toLowerCase();
            const id = el.id.toLowerCase();
            return !className.includes('cookie') && !className.includes('onetrust') && !id.includes('ot') && !id.includes('cookie');
          });
        return sections.length;
      });

      if (sectionsCount >= n) {
        break;
      }

      // Scroll down progressively from current position to trigger dynamic rendering of next section
      await this.page.evaluate(() => {
        const wrapper = document.querySelector('[class*="LandingPage_wrapper"]') as HTMLElement;
        if (wrapper) {
          wrapper.scrollTop += 250;
        } else {
          window.scrollBy(0, 250);
        }
      });
      await this.page.waitForTimeout(200);
    }

    // Scroll exactly to this target section using a smooth progressive bidirectional interpolation
    const scrolledSuccessfully = await this.page.evaluate(async (targetN) => {
      const wrapper = document.querySelector('[class*="LandingPage_wrapper"]') as HTMLElement;
      const sections = Array.from(document.querySelectorAll('section, [class*="section"]'))
        .filter(el => {
          const className = el.className.toLowerCase();
          const id = el.id.toLowerCase();
          return !className.includes('cookie') && !className.includes('onetrust') && !id.includes('ot') && !id.includes('cookie');
        }) as HTMLElement[];
      
      if (sections.length === 0) return { method: 'none', sectionsFound: 0 };

      const targetIndex = Math.min(targetN, sections.length) - 1;
      const targetSection = sections[targetIndex];
      if (!targetSection) return { method: 'no-target', sectionsFound: sections.length };

      // Determine starting scroll position and target scroll position
      const startScroll = wrapper ? wrapper.scrollTop : window.scrollY;
      let targetScroll = 0;

      if (wrapper) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const targetRect = targetSection.getBoundingClientRect();
        targetScroll = targetRect.top - wrapperRect.top + wrapper.scrollTop;
      } else {
        const targetRect = targetSection.getBoundingClientRect();
        targetScroll = targetRect.top + window.scrollY;
      }

      // Animate from startScroll to targetScroll progressively (smooth animation)
      const duration = 800; // 800ms transition for a sleek, responsive feel
      const startAnimTime = performance.now();

      await new Promise<void>((resolve) => {
        function animate(currentTime: number) {
          const elapsed = currentTime - startAnimTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function: easeInOutQuad
          const ease = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;

          const currentScroll = startScroll + (targetScroll - startScroll) * ease;

          if (wrapper) {
            wrapper.scrollTop = currentScroll;
          } else {
            window.scrollTo(0, currentScroll);
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(animate);
      });

      return { 
        method: 'smooth-animate-bidirectional', 
        startScroll, 
        targetScroll, 
        sectionsFound: sections.length, 
        targetIndex 
      };
    }, n);

    console.log(`Smooth scroll details to section ${n}:`, scrolledSuccessfully);
    await this.page.waitForTimeout(600); // Wait for remaining layout settle animations
  }

  async captureScrollSection(sectionIndex: number, screenshotHelper: ScreenshotHelper): Promise<string> {
    await this.scrollToSectionN(sectionIndex);
    return await screenshotHelper.capture(`section-${sectionIndex}`);
  }

  async getTextAtSection(n: number): Promise<string[]> {
    await this.scrollToSectionN(n);
    const texts = await this.allTextContent.allInnerTexts();
    return texts.map(t => t.trim()).filter(t => t.length > 0);
  }

  async detectTextOverlap(): Promise<boolean> {
    return this.page.evaluate(() => {
      const findSpecificElement = (variants: string[]): HTMLElement | null => {
        const elements = Array.from(document.querySelectorAll('p, h1, h2, h3, span, div, section, h4, h5, h6'));
        let bestMatch: HTMLElement | null = null;
        
        for (const el of elements) {
          const htmlEl = el as HTMLElement;
          if (htmlEl.innerText) {
            const textLower = htmlEl.innerText.toLowerCase().replace(/['’]/g, '');
            for (const v of variants) {
              const query = v.toLowerCase().replace(/['’]/g, '');
              if (textLower.includes(query)) {
                if (htmlEl.tagName !== 'BODY' && htmlEl.tagName !== 'MAIN' && htmlEl.tagName !== 'SECTION') {
                  // Target the most specific node
                  if (!bestMatch || bestMatch.contains(htmlEl)) {
                    bestMatch = htmlEl;
                  }
                }
              }
            }
          }
        }
        return bestMatch;
      };

      const el1 = findSpecificElement([
        "I can't do it all", 
        "I can’t do it all", 
        "can't do it all", 
        "can’t do it all",
        "do it all",
        "no puedo hacerlo todo"
      ]);
      const el2 = findSpecificElement([
        "His belief landed him in prison", 
        "landed him in prison", 
        "in prison", 
        "prison",
        "su creencia lo llevó",
        "prisión",
        "cárcel"
      ]);

      if (!el1 || !el2) {
        console.log('BUG-01: Element 1 or Element 2 not found in DOM.');
        return false;
      }

      const rect1 = el1.getBoundingClientRect();
      const rect2 = el2.getBoundingClientRect();

      const inViewport = (rect: DOMRect) => {
        return rect.width > 0 && rect.height > 0 &&
               rect.bottom >= -100 && rect.top <= window.innerHeight + 100;
      };

      if (!inViewport(rect1) || !inViewport(rect2)) {
        console.log('BUG-01: Elements not in viewport.', rect1, rect2);
        return false;
      }

      const overlap = !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );

      return overlap;
    });
  }

  async getVideoElements(): Promise<{ total: number; loaded: number; failed: number }> {
    return this.page.evaluate(() => {
      const videos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
      let loaded = 0;
      let failed = 0;

      videos.forEach((video) => {
        const sources = Array.from(video.querySelectorAll('source')) as HTMLSourceElement[];
        const hasBrokenSource = sources.some(s => s.src && (s.src.includes('broken') || s.src.includes('error') || s.src.includes('fail') || s.src.includes('blank')));
        const hasBrokenSrcAttr = video.src && (video.src.includes('broken') || video.src.includes('error') || video.src.includes('fail') || video.src.includes('blank'));

        if (video.error || video.networkState === 3 || hasBrokenSource || hasBrokenSrcAttr) {
          failed++;
        } else if (video.readyState >= 2) {
          loaded++;
        } else {
          // If readyState is 0 and there are no sources, treat as failed
          if (video.readyState === 0 && !video.src && sources.length === 0) {
            failed++;
          }
        }
      });

      return {
        total: videos.length,
        loaded,
        failed
      };
    });
  }
}
