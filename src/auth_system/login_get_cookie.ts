import puppeteer from 'puppeteer';
import login from './login';

export default async function loginGetCookie({
  url,
  show = false,
  username,
  pwd,
}: {
  url: string;
  username: string;
  pwd: string;
  show?: boolean;
}) {
  const browser = await puppeteer.launch({ headless: !show });
  const page = await browser.newPage();
  await page.goto(url);
  const res = await login({
    page,
    username,
    pwd,
  });
  console.log(res);
}
