import { Page, Request } from 'puppeteer';

class WaitForAllRequest {
  static catchType: string[] = ['xhr', 'fetch'];
  private page: Page;
  private requests: Promise<any>[] = [];
  constructor(page: Page) {
    this.page = page;
    this.startHandler = this.startHandler.bind(this);
    this.finishHandler = this.finishHandler.bind(this);
    this.registHandler();
  }

  registHandler() {
    this.page.on('request', <any>this.startHandler);
    this.page.on('requestfinished', <any>this.finishHandler);
    this.page.on('requestfailed', <any>this.finishHandler);
  }

  removeHandler() {
    this.page.removeListener('request', <any>this.startHandler);
    this.page.removeListener('requestfinished', <any>this.finishHandler);
    this.page.removeListener('requestfailed', <any>this.finishHandler);
  }

  startHandler(request: Request & { _resolver: any[] }) {
    if (WaitForAllRequest.catchType.includes(request.resourceType())) {
      this.requests.push(
        new Promise(function(resolve) {
          if (!request._resolver) {
            request._resolver = [];
          }
          request._resolver.push(resolve);
        }),
      );
    }
  }

  finishHandler(request: Request & { _resolver: any[] }) {
    if (WaitForAllRequest.catchType.includes(request.resourceType())) {
      request._resolver.forEach(resolve => resolve());
    }
  }

  async waitFor() {
    await Promise.all(this.requests);
    this.removeHandler();
  }
}
export default async function waitForAllRequest(page: Page) {
  const wait = new WaitForAllRequest(page);
  return await wait.waitFor();
}
