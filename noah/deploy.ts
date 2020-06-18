import puppeteer from 'puppeteer';
import Logger from 'better-loger';
import ConsoleAppender from 'better-loger/console_appender';
import Login from '../auth_system/login';
import getCurBranch from '../utils/get_cur_branch';
import ClickAllButton from './click_cluster_all_button';
import ClickCluster from './click_cluster';
import ClickOneKeyPublish from './click_one_key_publish';
import ClickBranch from './click_branch';
import ChoseBranch from './chose_branch';
import ClickNext from './click_next';
import ChoseStopMode, { StopMode } from './chose_stopMode';
import ClickEnsure from './click_ensure';
import QueryPublishStatus from './query_publish_status';
import QueryPublishResult from './query_publish_result';
import { commandRunner } from '../utils/command';

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
  test?: boolean;
  stop?: keyof typeof StopMode;
}
const main = async ({
  app,
  cluster,
  branch = 'HEAD',
  user,
  pwd,
  debug = true,
  show = false,
  stop = 'no',
  test = false,
}: DeployOption) => {
  if (!app || !cluster || !user || !pwd) {
    throw new Error('需要app,cluster,user,pwd参数');
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
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  if (test) {
    const client = await page.target().createCDPSession();
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (750 * 1024) / 8,
      uploadThroughput: (250 * 1024) / 8,
      latency: 50,
    });
  }
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
    await commandRunner(
      [
        new Login({
          url,
          page,
          username: user,
          pwd,
          logger,
          timeout: 60 * 1000,
        }),
        new ClickAllButton({
          page,
          logger,
        }),
        new ClickCluster({
          page,
          cluster,
          logger,
        }),
        new ClickOneKeyPublish({ page, logger }),
        new ClickBranch({ page, logger }),
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
          stop,
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
      ],
      logger,
    );
    await browser.close();
  } catch (error) {
    logger.error(error);
    await browser.close();
    process.exit(1);
  }
};
export { DeployOption };
export default main;
