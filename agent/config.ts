interface Config {
  target: [string, string][];
  match: [RegExp, string][];
  current: string;
  port: number;
  mockDir: string;
  mockKey: string;
  cookie: string;
  openId: string;
  isCookieOutDate: (response: string) => boolean;
}
export default Config;
