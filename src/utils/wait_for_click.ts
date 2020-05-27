import { Page } from 'puppeteer';

const waitForClick = (
  page: Page,
  text: string,
  selector: string,
  timeout = 30 * 1000,
) => {
  return page.waitForFunction(
    (selector: string, text: string) => {
      for (const elem of document.querySelectorAll(selector)) {
        if (elem.textContent?.trim().includes(text)) {
          (<HTMLElement>elem).click();
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
export default waitForClick;
