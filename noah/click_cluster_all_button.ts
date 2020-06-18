import Command, { CommandOption } from '../utils/command';
// import waitForClick from '../utils/wait_for_click';

export default class ClickCluster extends Command {
  constructor({ ...rest }: Omit<CommandOption, 'desc'>) {
    super({ ...rest, desc: '点击集群全部按钮' });
  }

  async _execute() {
    await (
      await this.page.waitForSelector(
        `.el-radio-button__orig-radio[value=all]`,
        { visible: true },
      )
    ).click();
  }
}
