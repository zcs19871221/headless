import loginSelectors from './loginSelectors';
import Command, { CommandOption } from '../utils/command';

export default class Login extends Command {
  private username: string;
  private pwd: string;
  private url: string;
  constructor({
    url,
    username,
    pwd,
    ...rest
  }: Omit<CommandOption, 'desc'> & {
    username: string;
    pwd: string;
    url: string;
  }) {
    super({ ...rest, desc: '登录权限系统' });
    this.username = username;
    this.pwd = pwd;
    this.url = url;
  }

  async _execute() {
    const page = this.page;
    await page.goto(this.url);
    this.logger.debug('已跳转到：' + this.url);
    const loginSelector = await Promise.race(
      loginSelectors.map(each =>
        page.waitForSelector(each.accountSelector).then(() => each),
      ),
    );
    await page.type(loginSelector.accountSelector, this.username);
    await page.type(loginSelector.pwdSelector, this.pwd);
    await Promise.all([
      page.waitForNavigation(),
      await page.click(loginSelector.submitSelector),
    ]);
    return await page.cookies();
  }
}
