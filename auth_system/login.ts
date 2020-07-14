import loginSelectors from './loginSelectors';
import Command, { CommandOption } from '../utils/command';
import { Resource } from 'better-inject';

type LoginOption = Omit<CommandOption, 'desc'> & {
  username: string;
  pwd: string;
  app: string;
};
export { LoginOption };
@Resource({ parent: 'command' })
export default class Login extends Command {
  private username: string;
  private pwd: string;
  private url: string;
  constructor({ username, pwd, app, ...rest }: LoginOption) {
    super({ ...rest, desc: '登录权限系统' });
    this.username = username;
    this.pwd = pwd;
    this.url = `https://${Login.code2Str([
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
  }

  private static code2Str(codes: number[]) {
    return codes.map(number => String.fromCharCode(number)).join('');
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
