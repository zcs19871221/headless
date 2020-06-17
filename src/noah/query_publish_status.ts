import Command, { CommandOption } from '../utils/command';

export default class QueryPublishStatus extends Command {
  constructor({ ...rest }: Omit<CommandOption, 'desc'>) {
    super({ ...rest, desc: '查询发布状态' });
  }

  async _execute() {
    const { page, logger } = this;
    return new Promise((resolve, reject) => {
      (async function() {
        const timeout = setTimeout(() => {
          reject(new Error('部署超时'));
        }, 15 * 60 * 1000);
        try {
          let curStatus = '';
          let prevStatus = '';
          const finalStatus = ['正常运行'];
          while (true) {
            curStatus = await (<any>(
              await page.waitForFunction(
                () => {
                  const status = document.querySelectorAll(
                    '.cluster-status,.processing',
                  )[1]?.textContent;
                  return status;
                },
                {
                  timeout: 10 * 60 * 1000,
                },
              )
            ).jsonValue());
            if (curStatus !== prevStatus) {
              prevStatus = curStatus;
              logger.info(curStatus);
            }
            if (finalStatus.includes(curStatus)) {
              break;
            }
          }
          clearTimeout(timeout);
          resolve();
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      })();
    });
  }
}
