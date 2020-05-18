import { Page, Request } from 'puppeteer';
import { wait } from 'better-utils';

class WaitForAllRequest {
  static catchType: string[] = ['xhr', 'fetch'];
  private page: Page;
  private requests: Promise<any>[] = [];
  private handlingNumber = 0;
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
      this.handlingNumber += 1;
      console.log('regist:' + this.handlingNumber);
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
      this.handlingNumber -= request._resolver.length;
      delete request._resolver;
    }
  }

  async waitFor() {
    await Promise.all(this.requests);
    this.removeHandler();
  }
}
// export default WaitForAllRequest;
export default async function waitForAllRequest(page: Page, minTime = 500) {
  const waiter = new WaitForAllRequest(page);
  await wait(minTime);
  await waiter.waitFor();
}
