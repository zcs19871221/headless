import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import Request from 'better-request';
import { read as readDefaultOpenId } from '../utils/default_openId';
import readConfigFile from '../utils/read_config_file';
import cookieObj from './cookie';
import Config from './index.d';

export default async function proxy({
  req,
  res,
  config,
  target,
  body,
}: {
  req: IncomingMessage;
  res: ServerResponse;
  config: Config;
  target: URL;
  body: Buffer;
}) {
  const headers = req.headers;
  delete headers.host;
  delete headers['accept-encoding'];
  headers.origin = target.protocol + '//' + target.host;
  if (headers.referer) {
    const referUrl = new URL(headers.referer);
    referUrl.protocol = target.protocol;
    referUrl.port = target.port;
    referUrl.hostname = target.hostname;
    headers.referer = url.format(referUrl);
  }
  const { user, pwd } = <any>{
    ...readDefaultOpenId(),
    ...readConfigFile([config.openId]),
  };
  let cookie = config.cookie;
  const loginUrl = target.toString();
  if (!cookie) {
    cookie = await cookieObj.get(loginUrl, user, pwd);
  }

  headers.cookie = cookie;
  target.pathname = <string>req.url;
  const request = new Request({
    url: target,
    method: <any>req.method,
    header: <any>headers,
    responseHandlers: [
      'decode',
      async (res, controler) => {
        if (config.isCookieOutDate(res)) {
          const newCookie = await cookieObj.get(loginUrl, user, pwd);
          controler.param.setHeader('cookie', newCookie);
          throw new Error('cookie过期');
        }
        return res;
      },
    ],
  });
  const response = await request.fetch(body.length === 0 ? null : body);
  const header = request.fetcher.getResHeader();
  res.writeHead(200, {
    ...header,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
  });
  res.end(response);
}
