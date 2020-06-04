import { ensureDo } from 'better-utils';
import loginSelectors from './loginSelectors';
import Command, { CommandOption } from '../utils/command';

export default class Login extends Command {
  private username: string;
  private pwd: string;
  constructor({
    username,
    pwd,
    ...rest
  }: CommandOption & { username: string; pwd: string }) {
    super(rest);
    this.username = username;
    this.pwd = pwd;
  }

  async _execute() {
    const page = this.page;
    const loginSelector = await Promise.race(
      loginSelectors.map(each =>
        page.waitForSelector(each.accountSelector).then(() => each),
      ),
    );
    const ensureType = ensureDo(page.type);
    await ensureType(loginSelector.accountSelector, this.username);
    await ensureType(loginSelector.pwdSelector, this.pwd);
    await Promise.all([
      page.waitForNavigation(),
      await page.click(loginSelector.submitSelector),
    ]);
    return await page.cookies();
  }
}
