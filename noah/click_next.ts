import Command, { CommandOption } from '../utils/command';

export default class ClickNext extends Command {
  constructor(obj: Omit<CommandOption, 'desc'>) {
    super({ ...obj, desc: '点击下一步' });
  }

  async _execute() {
    await (
      await this.page.waitForSelector(
        'div[aria-label=发布] .el-button.el-button--primary',
      )
    ).click();
  }
}
