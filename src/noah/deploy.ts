import puppeteer, { Page } from 'puppeteer';
import { wait } from 'better-utils';
import Logger from 'better-loger';
import ConsoleAppender from 'better-loger/console_appender';
import loginAuthSystem from '../auth_system/login';
import waitForClick from '../utils/wait_for_click';

const code2Str = (codes: number[]) =>
  codes.map(number => String.fromCharCode(number)).join('');

const queryStatus = async (page: Page, logger: Logger) => {
  return new Promise((resolve, reject) => {
    (async function() {
      const timeout = setTimeout(() => {
        reject(new Error('部署超时'));
      }, 10 * 60 * 1000);
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
};

const main = async ({
  app,
  cluster,
  branch,
  user,
  pwd,
  debug = true,
  show = false,
}: {
  app: string;
  cluster: string;
  user: string;
  pwd: string;
  branch: string;
  debug?: boolean;
  show?: boolean;
}) => {
  if (!app || !cluster || !user || !pwd || !branch) {
    throw new Error('需要app,cluster,branch,user,pwd参数');
  }
  const logger = Logger.get();
  if (debug) {
    logger.setLevel('debug');
    logger.setAppender(new ConsoleAppender({ threshold: 'debug' }));
  }
  logger.info('目标应用：%m\n目标集群:%m\n目标分支:%m', [app, cluster, branch]);
  logger.debug(`用户名:${user} 密码:${pwd}`);
  const browser = await puppeteer.launch({
    headless: show ? false : true,
  });
  const page = await browser.newPage();
  try {
    const url = `https://${code2Str([
      110,
      111,
      97,
      104,
      46,
      110,
      101,
      116,
      101,
      97,
      115,
      101,
      46,
      99,
      111,
      109,
    ])}/#/poseidon/app/appDetail?appName=${app}&appTab=cluster`;
    await page.goto(url);
    logger.debug('已跳转到：' + url);
    await loginAuthSystem({
      page,
      username: user,
      pwd,
    });
    logger.debug('已登录权限系统');
    await wait(2000);
    await (await page.waitForSelector(`input[type=radio][value=all]`)).click();
    await waitForClick(page, cluster, 'a');
    logger.debug('已经点击集群：' + cluster);
    await wait(2000);
    await waitForClick(page, '一键发布', 'span');
    logger.debug('已经点击一键发布');
    await wait(2000);
    await (
      await page.waitForSelector(
        'div[aria-label=发布] .el-form-item.is-required input',
      )
    ).click();
    try {
      await waitForClick(page, branch, 'li', 500);
    } catch (error) {
      throw new Error(`分支${branch}不存在`);
    }
    logger.debug('已设置分支：' + branch);
    await (
      await page.waitForSelector(
        'div[aria-label=发布] .el-button.el-button--primary',
      )
    ).click();
    logger.debug('进入发布模式选择');
    await waitForClick(page, '下一步', 'div[aria-label=发布] span');
    logger.debug('进入发布策略选择');
    await wait(2000);
    await waitForClick(page, '确 定', 'div[aria-label=发布] span');
    logger.debug('已点击发布');
    await wait(2000);
    logger.debug('查询发布状态');
    await queryStatus(page, logger);
    logger.debug('发布结束');
    const detail = await (
      await page.waitForFunction(() => {
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
    logger.info(<any>detail);
    await page.close();
    await browser.close();
  } catch (error) {
    console.error(error);
    await page.close();
    await browser.close();
    process.exit(1);
  }
};
export default main;
