import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';
import WaitForAllRequest from '../utils/wait_for_all_request';

export default class ClickCluster extends Command {
  private cluster: string;
  constructor({ cluster, ...rest }: CommandOption & { cluster: string }) {
    super(rest);
    this.cluster = cluster;
  }

  async _execute() {
    const request = new WaitForAllRequest(this.page, 23);
    await (
      await this.page.waitForSelector(`input[type=radio][value=all]`)
    ).click();
    await waitForClick(this.page, this.cluster, 'a');
  }
}
