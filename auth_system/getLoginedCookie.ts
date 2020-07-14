import puppeteer from 'puppeteer';
import Logger from 'better-loger';
import ConsoleAppender from 'better-loger/console_appender';
import Login, { LoginOption } from './login';

export default async function getLoginedCookie({
  headless,
  debug,
  ...loginOpt
}: Omit<LoginOption, 'page' | 'logger'> & {
  headless: boolean;
  debug: boolean;
}) {
  const browser = await puppeteer.launch({
    headless,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  const logger = Logger.get();
  try {
    if (debug) {
      logger.setLevel('debug');
      logger.setAppender(new ConsoleAppender({ threshold: 'debug' }));
    }
    const login = new Login({ ...loginOpt, page, logger });
    await login.do();
    const client = await page.target().createCDPSession();
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
    await page.close();
    await browser.close();
  }
}
