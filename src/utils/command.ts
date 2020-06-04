import Logger from 'better-loger';
import { wait } from 'better-utils';
import { Page } from 'puppeteer';

interface CommandOption {
  page: Page;
  logger: Logger;
  desc: string;
  retry?: number;
  timeout?: number;
  retryInterval?: number;
}
export { CommandOption };
export default abstract class Command {
  private logger: Logger;
  protected page: Page;
  private desc: string;
  private timeout: number;
  private retry: number;
  private retryInterval: number;
  private executeTime: number = 0;
  constructor({
    page,
    logger,
    desc,
    retry = 1,
    timeout = 10 * 1000,
    retryInterval = 50,
  }: CommandOption) {
    this.logger = logger;
    this.page = page;
    this.desc = desc;
    this.timeout = timeout;
    this.retry = retry;
    this.retryInterval = retryInterval;
  }

  async do() {
    return new Promise((resolve, reject) => {
      this.logger.debug(`开始执行：${this.desc}`);
      const timer = setTimeout(() => {
        reject();
      }, this.timeout);
      this._do()
        .then(value => {
          this.logger.debug(`成功执行：${this.desc}`);
          resolve(value);
        })
        .catch(error => {
          this.page
            .screenshot({ path: `${this.desc}`, type: 'jpeg' })
            .finally(() => {
              reject(error);
            });
        })
        .finally(() => {
          clearTimeout(timer);
        });
    });
  }

  abstract async _execute(): Promise<any>;
  async undo(): Promise<any> {}

  private async _do() {
    while (this.executeTime++ < this.retry) {
      try {
        await this._execute();
      } catch (error) {
        if (this.executeTime < this.timeout) {
          await this.undo();
          await wait(this.retryInterval);
        }
      }
    }
  }
}
