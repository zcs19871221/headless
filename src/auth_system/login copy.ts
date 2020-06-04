import { Page, Cookie } from 'puppeteer';
import loginSelectors from './loginSelectors';

export default async function login({
  page,
  username,
  pwd,
}: {
  page: Page;
  username: string;
  pwd: string;
}): Promise<Cookie[]> {
  const loginSelector = await Promise.race(
    loginSelectors.map(each =>
      page.waitForSelector(each.accountSelector).then(() => each),
    ),
  );
  await page.type(loginSelector.accountSelector, username);
  await page.type(loginSelector.pwdSelector, pwd);
  await Promise.all([
    page.waitForNavigation(),
    await page.click(loginSelector.submitSelector),
  ]);
  return await page.cookies();
}
