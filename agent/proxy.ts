import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import Request from 'better-request';
import getCookie from './getCookie';
import Config from './config';

export default async function proxy({
  req,
  res,
  config,
  target,
  cookie,
  port,
}: {
  req: IncomingMessage;
  res: ServerResponse;
  config: Config;
  target: string;
  cookie: string;
  port: number;
}) {
  const headers = req.headers;
  delete headers.host;
  headers.origin = target;
  if (headers.referer) {
    const referUrl = url.parse(headers.referer);
    referUrl.protocol = url.parse(target).protocol;
    referUrl.port = url.parse(target).port;
    referUrl.hostname = url.parse(target).hostname;
    headers.referer = url.format(referUrl);
  }
  headers.cookie = cookie;

  await Request.fetchThenPipe(
    {
      url: <any>req.url?.replace(`http://localhost:${port}`, target),
      method: <any>req.method,
      header: <any>headers,
      responseHandlers: async (res, controler) => {
        if (config.isCookieOutDate(res)) {
          const newCookie = await getCookie(config, target);
          controler.fetcher.param.setHeader({
            ...controler.fetcher.param.getHeader(),
            cookie: newCookie,
          });
        }
      },
    },
    req,
    res,
    // fetchResponse => {
    //   res.writeHead(200, {
    //     ...fetchResponse.headers,
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Headers': '*',
    //     'Access-Control-Allow-Methods': '*',
    //   });
    // },
  );
}
