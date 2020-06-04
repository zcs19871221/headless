import puppeteer, { Page } from 'puppeteer';
import { wait } from 'better-utils';
import Logger from 'better-loger';
import ConsoleAppender from 'better-loger/console_appender';
import loginAuthSystem from '../auth_system/login';
import waitForClick from '../utils/wait_for_click';
import getCurBranch from '../utils/get_cur_branch';

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

interface DeployOption {
  app: string;
  cluster: string;
  user: string;
  pwd: string;
  branch: string;
  debug?: boolean;
  show?: boolean;
}
const main = async ({
  app,
  cluster,
  branch,
  user,
  pwd,
  debug = true,
  show = false,
}: DeployOption) => {
  if (!app || !cluster || !user || !pwd || !branch) {
    throw new Error('需要app,cluster,branch,user,pwd参数');
  }
  if (branch === 'HEAD') {
    branch = await getCurBranch();
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
    await waitForClick(page, '不通过 >', '.rejected,.clickable');
    await waitForClick(page, '修改个人检查结果', 'span');
    await waitForClick(page, '无需检查', 'span');
    await waitForClick(page, '保 存', 'button');
    await waitForClick(page, '保 存', '.u-mgl10,.pass');
  } catch (error) {
    console.error(error);
    await page.close();
    await browser.close();
    process.exit(1);
  }
};
export { DeployOption };
export default main;
