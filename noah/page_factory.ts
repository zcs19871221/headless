import puppeteer, { Page, Browser } from 'puppeteer';
import { Resource, FactoryBean } from 'better-inject';

@Resource({ type: 'single', id: 'page' })
export default class PageFactory extends FactoryBean {
  private page!: Page;
  private browser!: Browser;
  private show: boolean;
  constructor(show: boolean) {
    super();
    this.show = show;
  }

  getObject() {
    return this.page;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: this.show ? false : true,
      ignoreHTTPSErrors: true,
    });
    this.page = await this.browser.newPage();
  }

  closeBrowser() {
    this.browser.close();
  }

  getPage() {
    return this.page;
  }

  getBrowser() {
    return this.browser;
  }
}
