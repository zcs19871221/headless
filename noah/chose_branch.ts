import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';
import { Resource } from 'better-inject';
@Resource({ id: 'choseBranch', parent: 'command' })
export default class ChoseBranch extends Command {
  private branch: string;
  constructor({
    branch,
    ...rest
  }: Omit<CommandOption, 'desc'> & { branch: string }) {
    super({ ...rest, desc: '选择分支' });
    this.branch = branch;
  }

  async _execute() {
    try {
      await waitForClick(this.page, this.branch, 'li', 500);
    } catch (error) {
      throw new Error(`分支${this.branch}不存在`);
    }
  }
}
