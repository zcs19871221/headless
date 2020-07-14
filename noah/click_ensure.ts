import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';
import { Resource } from 'better-inject';
@Resource({ id: 'ensure', parent: 'command' })
export default class ClickNext extends Command {
  constructor(obj: Omit<CommandOption, 'desc'>) {
    super({ ...obj, desc: '点击确定发布' });
  }

  async _execute() {
    await waitForClick(this.page, '确 定', 'div[aria-label=发布] span');
  }
}
