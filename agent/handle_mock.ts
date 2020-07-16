import path from 'path';
import url from 'url';
import querystring from 'querystring';
import { IncomingMessage } from 'http';
import Config from './index.d';

const handleMock = async (
  req: IncomingMessage,
  config: Config,
  base: string,
): Promise<string | null> => {
  const query = <any>querystring.parse(<any>url.parse(req.url || '').query);
  const { mockDir, mockKey } = config;
  if (query && query[mockKey]) {
    const mockFile = path.join(base, mockDir, query[mockKey]);
    delete require.cache[require.resolve(mockFile)];
    const mockFn = require(mockFile);
    let res = mockFn;
    if (typeof mockFn === 'function') {
      res = await mockFn();
    }
    console.log(
      req.method,
      req.url,
      'mock, 地址：' + require.resolve(mockFile),
    );
    return JSON.stringify(res);
  }
  return null;
};
export default handleMock;
