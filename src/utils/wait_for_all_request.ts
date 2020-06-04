import { Page, Request } from 'puppeteer';

class WaitForAllRequest {
  static catchType: string[] = ['xhr', 'fetch', 'script', 'stylesheet'];
  private page: Page;
  private id: number = 0;
  private finishCount: number = 0;
  private targetNumber: number;
  private promise: Promise<any>;
  private resolve!: (value?: any) => void;
  constructor(page: Page, targetNumber: number) {
    this.page = page;
    this.targetNumber = targetNumber;
    this.startHandler = this.startHandler.bind(this);
    this.finishHandler = this.finishHandler.bind(this);
    this.regist();
    this.promise = new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  private regist() {
    this.page.on('request', <any>this.startHandler);
    this.page.on('requestfinished', <any>this.finishHandler);
    this.page.on('requestfailed', <any>this.finishHandler);
  }

  private startHandler(request: Request & { _rid: number }) {
    if (WaitForAllRequest.catchType.includes(request.resourceType())) {
      request._rid = this.id++;
    }
  }

  private finishHandler(request: Request & { _rid: number }) {
    if (
      WaitForAllRequest.catchType.includes(request.resourceType()) &&
      request._rid &&
      request._rid <= this.id
    ) {
      delete request._rid;
      this.finishCount++;
      if (this.finishCount === this.targetNumber) {
        this.resolve();
      }
    }
  }

  wait() {
    return this.promise;
  }
}
export default WaitForAllRequest;
