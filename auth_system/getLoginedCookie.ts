import Logger from 'better-loger';
import Login, { LoginOption } from './login';
import Context from 'better-inject';
import PageFactory from 'utils/page_factory';

export default async function getLoginedCookie({
  headless,
  debug,
  ...loginOpt
}: Omit<LoginOption, 'page' | 'logger'> & {
  headless?: boolean;
  debug?: boolean;
}) {
  const context = new Context({
    scanFiles: ['utils/*_factory.ts', 'auth_system/login.ts'],
    configFiles: 'auth_system/config.ts',
  });
  const { username, url, pwd, timeout, retryInterval } = loginOpt;
  const logger = <Logger>context.getBean('logger', debug);
  const pageFactory = <PageFactory>context.getBean('&page');
  await pageFactory.init();
  try {
    const login = <Login>context.getBean('login', {
      username,
      pwd,
      url,
      timeout,
      retryInterval,
    });
    await login.do();
    const client = await pageFactory
      .getPage()
      .target()
      .createCDPSession();
    const allCookies: any = await client.send('Network.getAllCookies');
    return allCookies.cookies
      .reduce((acc: string[], cur: { value: string; name: string }) => {
        acc.push(`${cur.name}=${cur.value}`);
        return acc;
      }, [])
      .join(';');
  } catch (error) {
    logger.error('获取cookie出错：', error);
  } finally {
    await pageFactory.closeBrowser();
  }
}
