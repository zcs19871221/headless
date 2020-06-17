import puppeteer from 'puppeteer';
import Logger from 'better-loger';
import ConsoleAppender from 'better-loger/console_appender';
import Login from '../auth_system/login';
import getCurBranch from '../utils/get_cur_branch';
import ClickCluster from './click_cluster';
import ClickOneKeyPublish from './click_one_key_publish';
import ChoseBranch from './chose_branch';
import ClickNext from './click_next';
import ChoseStopMode, { StopMode } from './chose_stopMode';
import ClickEnsure from './click_ensure';
import QueryPublishStatus from './query_publish_status';
import QueryPublishResult from './query_publish_result';
import Command from 'src/utils/command';

const code2Str = (codes: number[]) =>
  codes.map(number => String.fromCharCode(number)).join('');

interface DeployOption {
  app: string;
  cluster: string;
  user: string;
  pwd: string;
  branch: string;
  debug?: boolean;
  show?: boolean;
  mode?: keyof typeof StopMode;
}
const main = async ({
  app,
  cluster,
  branch,
  user,
  pwd,
  debug = true,
  show = false,
  mode = '不暂停',
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
    const commands: Command[] = [
      new Login({
        url,
        page,
        username: user,
        pwd,
        logger,
      }),
      new ClickCluster({
        page,
        cluster,
        logger,
      }),
      new ClickOneKeyPublish({ page, logger }),
      new ChoseBranch({ page, logger, branch }),
      new ClickNext({
        page,
        logger,
      }),
      new ClickNext({
        page,
        logger,
      }),
      new ChoseStopMode({
        page,
        logger,
        mode,
      }),
      new ClickEnsure({
        page,
        logger,
      }),
      new QueryPublishStatus({
        page,
        logger,
      }),
      new QueryPublishResult({
        page,
        logger,
      }),
    ];
    for (const command of commands) {
      await command.do();
    }
    await page.close();
    await browser.close();
  } catch (error) {
    logger.error(error);
    await page.close();
    await browser.close();
    process.exit(1);
  }
};
export { DeployOption };
export default main;
