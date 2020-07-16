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
  port,
  body,
}: {
  req: IncomingMessage;
  res: ServerResponse;
  config: Config;
  target: string;
  port: number;
  body: Buffer;
}) {
  const headers = req.headers;
  delete headers.host;
  headers.origin = target;
  if (headers.referer) {
    const referUrl = url.parse(headers.referer);
    const { protocol, port, hostname } = url.parse(target);
    referUrl.protocol = protocol;
    referUrl.port = port;
    referUrl.hostname = hostname;
    headers.referer = url.format(referUrl);
  }
  const { username, pwd } = <any>{
    ...readDefaultOpenId(),
    ...readConfigFile([config.openId]),
  };
  let cookie = config.cookie;
  if (!cookie) {
    cookie = await cookieObj.get(target, username, pwd);
  }

  headers.cookie = cookie;

  const request = new Request({
    url: <any>req.url?.replace(`http://localhost:${port}`, target),
    method: <any>req.method,
    header: <any>headers,
    responseHandlers: async (res, controler) => {
      if (config.isCookieOutDate(res)) {
        const newCookie = await cookieObj.get(target, username, pwd);
        controler.param.setHeader('cookie', newCookie);
        throw new Error('cookie过期');
      }
    },
  });
  const response = await request.fetch(body);
  const header = request.fetcher.getResHeader();
  res.writeHead(200, {
    ...header,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
  });
  res.end(response);
}
