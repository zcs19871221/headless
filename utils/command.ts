import Logger from 'better-loger';
import { wait } from 'better-utils';
import PageFactory from './page_factory';
import { Page } from 'puppeteer';

interface CommandOption {
  page: PageFactory;
  logger: Logger;
  desc: string;
  timeout?: number;
  retryInterval?: number;
}
export { CommandOption };
const commandRunner = async (commands: Command[], logger: Logger) => {
  for (let i = 0, len = commands.length; i < len; i++) {
    const command = commands[i];
    try {
      await command.check();
    } catch (error) {
      if (commands[i - 1]) {
        commands[i - 1].setIsRollBack();
        logger.debug(
          `${command.desc}检查失败,准备回滚到${commands[i - 1].desc}..`,
        );
        try {
          await command.rollBack();
        } catch (error) {
          logger.debug(`执行：${command.desc} 回滚失败`);
        }
      }
      i -= 2;
      continue;
    }
    await command.do();
  }
};
export { commandRunner };
export default abstract class Command {
  protected logger: Logger;
  protected page: Page;
  public desc: string;
  private timeout: number;
  private retryInterval: number;
  private executeCounts: number = 0;
  private isRollBack: boolean = false;
  constructor({
    page,
    logger,
    desc,
    retryInterval = 1000,
    timeout = 30 * 1000,
  }: CommandOption) {
    this.logger = logger;
    this.page = page.getPage();
    this.desc = desc;
    this.timeout = timeout;
    this.retryInterval = retryInterval;
  }

  setIsRollBack() {
    this.isRollBack = true;
  }

  async do() {
    this.executeCounts = 0;
    const prefix = this.isRollBack ? '回滚重试' : '';
    if (this.isRollBack) {
      await wait(this.retryInterval);
    }
    return new Promise((resolve, reject) => {
      this.logger.debug(prefix + this.desc + '...');
      this._do()
        .then(value => {
          this.logger.debug(prefix + this.desc + '成功!');
          resolve(value);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  protected abstract async _execute(): Promise<any>;

  async rollBack(): Promise<any> {}
  async check(): Promise<any> {}

  private async _do() {
    const start = Date.now();
    let lastError = null;
    while (Date.now() - start <= this.timeout) {
      try {
        this.executeCounts++;
        lastError = null;
        return await this._execute();
      } catch (error) {
        lastError = error;
        this.logger.debug(
          `${this.desc}失败 等待${this.retryInterval}后重试第${this.executeCounts}次`,
        );
        await wait(this.retryInterval);
      }
    }
    throw lastError || new Error(`${this.desc}超时`);
  }
}
