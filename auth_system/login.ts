import loginSelectors from './loginSelectors';
import Command, { CommandOption } from '../utils/command';
import { Resource } from 'better-inject';

type LoginOption = Omit<CommandOption, 'desc'> & {
  username: string;
  pwd: string;
  url: string;
};
export { LoginOption };
@Resource({ parent: 'command' })
export default class Login extends Command {
  private username: string;
  private pwd: string;
  private url: string;
  constructor({ username, pwd, url, ...rest }: LoginOption) {
    super({ ...rest, desc: '登录权限系统' });
    this.username = username;
    this.pwd = pwd;
    this.url = url;
  }

  protected async _execute() {
    const page = this.page;
    await page.goto(this.url);
    this.logger.debug('已跳转到：' + this.url);
    const loginSelector = loginSelectors.find(({ urlMatcher }) => {
      if (typeof urlMatcher === 'string') {
        return page.url().startsWith(urlMatcher);
      }
      return urlMatcher.test(page.url());
    });
    if (!loginSelector) {
      throw new Error('不匹配url:' + page.url());
    }
    await page.waitForSelector(loginSelector.accountSelector);
    await page.type(loginSelector.accountSelector, this.username);
    await page.type(loginSelector.pwdSelector, this.pwd);
    await Promise.all([
      page.waitForNavigation({ timeout: 30 * 1000 }),
      page.click(loginSelector.submitSelector),
    ]);
  }
}
