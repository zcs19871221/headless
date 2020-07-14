import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';
import { Resource } from 'better-inject';

const StopMode = {
  first: '第一批暂停',
  each: '每批暂停',
  no: '不暂停',
};

export { StopMode };
@Resource({ id: 'stop', parent: 'command' })
export default class ChoseStopMode extends Command {
  private stop: keyof typeof StopMode;
  constructor({
    stop,
    ...rest
  }: Omit<CommandOption, 'desc'> & { stop: keyof typeof StopMode }) {
    super({ ...rest, desc: '选择暂停策略' });
    this.stop = stop;
  }

  async _execute() {
    await waitForClick(this.page, StopMode[this.stop], '.el-radio__label');
  }
}
