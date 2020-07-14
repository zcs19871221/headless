import Logger from 'better-loger';
import { Context } from 'better-inject';
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
import PageFactory from './page_factory';
import { commandRunner } from '../utils/command';

interface DeployOption {
  app: string;
  cluster: string;
  user: string;
  pwd: string;
  branch?: string;
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
  const context = new Context({
    configFiles: 'noah/config.ts',
    scanFiles: ['noah/*.ts', 'auth_system/login.ts'],
  });
  const logger = <Logger>context.getBean('logger', debug);
  logger.info('目标应用：%m\n目标集群:%m\n目标分支:%m', [app, cluster, branch]);
  logger.debug(`用户名:${user} 密码:${pwd}`);
  const pageFactory = <PageFactory>context.getBean('&page', show);
  await pageFactory.init();
  if (test) {
    const client = await pageFactory
      .getPage()
      .target()
      .createCDPSession();
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (750 * 1024) / 8,
      uploadThroughput: (250 * 1024) / 8,
      latency: 50,
    });
  }
  try {
    await commandRunner(
      [<Login>context.getBean('login', {
          username: user,
          pwd,
          app,
        }), <ClickAllButton>context.getBean('clickAll'), <ClickCluster>context.getBean('clickCluster', { cluster }), <ClickOneKeyPublish>context.getBean('oneKey'), <ClickBranch>context.getBean('branch'), <ChoseBranch>context.getBean('choseBranch', { branch }), <ClickNext>context.getBean('next'), <ClickNext>context.getBean('next'), <ChoseStopMode>context.getBean('stop', { stop }), <ClickEnsure>context.getBean('ensure'), <QueryPublishStatus>context.getBean('status'), <QueryPublishResult>context.getBean('result')],
      logger,
    );
    await pageFactory.closeBrowser();
  } catch (error) {
    logger.error('', error);
    await pageFactory.closeBrowser();
    process.exit(1);
  }
};
export { DeployOption };
export default main;
