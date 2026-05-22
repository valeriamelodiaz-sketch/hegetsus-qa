export const TEST_DATA = {
  urls: {
    home: '/',
    exploreJourneyBe: '/explore?journey=be',
    articles: '/articles',
  },
  footer: {
    accessibilityButtonSelector: 'button[data-acsb-custom-trigger="true"]',
    cookieButtonSelector: 'button.hover\\:opacity-70:not([data-acsb-custom-trigger])',
    contactUsLinkHref: 'mailto:info@hegetsus.com',
    pressInquiriesLinkHref: 'mailto:press@hegetsus.com',
    contactUsText: 'Contact Us',
    pressInquiriesText: 'Press Inquiries',
  },
  explore: {
    triggerButtonText: 'Explore',
    overlappingTextBackground: "I can't do it all",
    prisonText: 'His belief landed him in prison',
    sectionTarget: 5,
  },
  map: {
    mapContainerXPath: '//*[@id="__next"]/div/main/div/div[1]',
    filtersContainerXPath: '//*[@id="__next"]/div/main/div/div[1]/fieldset/div',
    inPersonOnlineFilterXPath: '//*[@id="__next"]/div/main/div/div[1]/div[2]/div/div/div/div/div/fieldset[1]/div',
    daysFilterXPath: '//*[@id="__next"]/div/main/div/div[1]/div[2]/div/div/div/div/div/fieldset[2]/div',
    filterTexts: {
      inPerson: 'In Person',
      online: 'Online',
      allDays: 'All Days of the Week',
    }
  },
  videos: {
    journeyBeSections: [1, 2, 3, 4, 5],
    screenshotDelayMs: 2000,
    scrollDelayMs: 1500,
  }
};
