import Command, { CommandOption } from '../utils/command';

export default class ClickSecondtNext extends Command {
  constructor({ ...rest }: Omit<CommandOption, 'desc'>) {
    super({ ...rest, desc: '发布模式选择点击下一步' });
  }

  async _execute() {
    await (
      await this.page.waitForSelector(
        'div[aria-label=发布] .el-button.el-button--primary',
      )
    ).click();
  }
}
