import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';
import { Resource } from 'better-inject';

@Resource({ id: 'oneKey', parent: 'command' })
export default class ClickOneKeyPublish extends Command {
  constructor({ ...rest }: Omit<CommandOption, 'desc'>) {
    super({ ...rest, desc: '点击一键发布' });
  }

  async _execute() {
    await waitForClick(this.page, '一键发布', 'span');
  }
}
