import Command, { CommandOption } from '../utils/command';
import waitForClick from '../utils/wait_for_click';
import waitUnitAppear from '../utils/wait_until_appear';
import { Resource } from 'better-inject';

@Resource({ id: 'clickCluster', parent: 'command' })
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
    await waitForClick(this.page, this.cluster, 'a');
  }

  async check() {
    await waitUnitAppear(this.page, this.cluster, 'a', 500);
  }
}
