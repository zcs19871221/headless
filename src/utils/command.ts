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
  protected logger: Logger;
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
    retryInterval = 100,
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
      this.logger.debug(`\n开始执行：${this.desc}`);
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
  async undo(): Promise<any> {
    return this._execute();
  }

  private async _do() {
    while (this.executeTime++ < this.retry) {
      try {
        await this._execute();
      } catch (error) {
        if (this.executeTime < this.timeout) {
          this.logger.debug(
            `执行：${this.desc}失败 等待${this.retryInterval}后执行重试`,
          );
          await wait(this.retryInterval);
          await this.undo();
        }
      }
    }
  }
}
