import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';

enum StopMode {
  '第一批暂停',
  '每批暂停',
  '不暂停',
}
export { StopMode };
export default class ChoseStopMode extends Command {
  private mode: keyof typeof StopMode;
  constructor({
    mode,
    ...rest
  }: Omit<CommandOption, 'desc'> & { mode: keyof typeof StopMode }) {
    super({ ...rest, desc: '选择分支' });
    this.mode = mode;
  }

  async _execute() {
    await waitForClick(this.page, this.mode, '.el-radio__label');
  }
}
