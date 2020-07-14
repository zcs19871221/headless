import Command, { CommandOption } from '../utils/command';
import { Resource } from 'better-inject';

@Resource({ id: 'branch', parent: 'command' })
export default class CLickBranch extends Command {
  private fromSelector: string = 'div[aria-label=发布] ';
  private inputSelector: string = '.el-form-item.is-required input';
  private closeSelector: string = '[aria-label=Close]';
  constructor({ ...rest }: Omit<CommandOption, 'desc'>) {
    super({ ...rest, desc: '点击分支下拉' });
  }

  async _execute() {
    await (
      await this.page.waitForSelector(this.fromSelector + this.inputSelector)
    ).click();
  }

  async check() {
    const input = await this.page.waitForSelector(
      this.fromSelector + this.inputSelector,
      {
        timeout: 500,
      },
    );
    const value = await this.page.evaluate(element => element.value, input);
    if (value === '') {
      throw new Error('未获取分支');
    }
  }

  async rollBack() {
    return this.page.click(this.fromSelector + this.closeSelector);
  }
}
