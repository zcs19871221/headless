import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';

export default class ClickCluster extends Command {
  private cluster: string;
  constructor({
    cluster,
    ...rest
  }: Omit<CommandOption, 'desc'> & { cluster: string }) {
    super({ ...rest, desc: '点击集群' + cluster });
    this.cluster = cluster;
  }

  async _execute() {
    await (
      await this.page.waitForSelector(`input[type=radio][value=all]`)
    ).click();
    await waitForClick(this.page, this.cluster, 'a');
  }
}
