import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';
import { Resource } from 'better-inject';
@Resource({ id: 'next', parent: 'command' })
export default class ClickNext extends Command {
  constructor(obj: Omit<CommandOption, 'desc'>) {
    super({ ...obj, desc: '点击下一步' });
  }

  async _execute() {
    await waitForClick(
      this.page,
      '下一步',
      'div[aria-label=发布] .el-button.el-button--primary',
    );
  }
}
