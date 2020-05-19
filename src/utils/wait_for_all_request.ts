import { Page, Request } from 'puppeteer';
import { wait } from 'better-utils';

class WaitForAllRequest {
  static catchType: string[] = ['xhr', 'fetch', 'script', 'stylesheet'];
  private page: Page;
  private requests: Promise<any>[] = [];
  constructor(page: Page) {
    this.page = page;
    this.startHandler = this.startHandler.bind(this);
    this.finishHandler = this.finishHandler.bind(this);
    this.regist();
  }

  private regist() {
    this.page.on('request', <any>this.startHandler);
    this.page.on('requestfinished', <any>this.finishHandler);
    this.page.on('requestfailed', <any>this.finishHandler);
  }

  private removeHandler() {
    this.page.removeListener('request', <any>this.startHandler);
    this.page.removeListener('requestfinished', <any>this.finishHandler);
    this.page.removeListener('requestfailed', <any>this.finishHandler);
  }

  private startHandler(request: Request & { _resolver: any[] }) {
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

  private finishHandler(request: Request & { _resolver: any[] }) {
    if (
      WaitForAllRequest.catchType.includes(request.resourceType()) &&
      request._resolver
    ) {
      request._resolver.forEach(resolve => resolve());
      delete request._resolver;
    }
  }

  async waitFor() {
    await Promise.all(this.requests);
    await wait(2000);
    this.removeHandler();
  }
}
export default WaitForAllRequest;
