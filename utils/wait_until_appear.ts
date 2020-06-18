import { Page } from 'puppeteer';

const waitUntilAppear = (
  page: Page,
  text: string,
  selector: string,
  timeout = 1000,
) => {
  return page.waitForFunction(
    (selector: string, text: string) => {
      for (const elem of document.querySelectorAll(selector)) {
        if (elem.textContent?.trim() === text) {
          return true;
        }
      }
    },
    {
      timeout,
    },
    selector,
    text,
  );
};
export default waitUntilAppear;
