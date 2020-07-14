import Command, { CommandOption } from '../utils/command';
import { Resource } from 'better-inject';

@Resource({ id: 'result', parent: 'command' })
export default class QueryPublishStatus extends Command {
  constructor({ ...rest }: Omit<CommandOption, 'desc'>) {
    super({ ...rest, desc: '查询发布结果' });
  }

  async _execute() {
    const detail = await (
      await this.page.waitForFunction(() => {
        const detailElement = document.querySelectorAll(
          '.cluster-detail-info-box td',
        );
        if (detailElement.length > 0) {
          let res = '\n';
          for (const td of detailElement) {
            if (td.textContent?.includes('完成时间')) {
              continue;
            }
            res += td.textContent?.replace(/[\s\n]/g, '') + '\n';
          }
          return res;
        }
      })
    ).jsonValue();
    this.logger.info(<string>detail);
  }
}
