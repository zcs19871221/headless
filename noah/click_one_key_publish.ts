import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';

export default class ClickOneKeyPublish extends Command {
  constructor({ ...rest }: Omit<CommandOption, 'desc'>) {
    super({ ...rest, desc: '点击一键发布' });
  }

  async _execute() {
    await waitForClick(this.page, '一键发布', 'span');
  }
}
