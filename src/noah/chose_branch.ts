import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';

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
    await (
      await this.page.waitForSelector(
        'div[aria-label=发布] .el-form-item.is-required input',
      )
    ).click();
    try {
      await waitForClick(this.page, this.branch, 'li', 500);
    } catch (error) {
      throw new Error(`分支${this.branch}不存在`);
    }
  }

  async undo() {
    await this.page.click('[aria-label=发布]');
    return this._execute();
  }
}
