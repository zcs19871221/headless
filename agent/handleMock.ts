import path from 'path';
import url from 'url';
import querystring from 'querystring';
import { IncomingMessage, ServerResponse } from 'http';
import Config from './config';

const handleMock = async (
  req: IncomingMessage,
  config: Config,
): Promise<string | null> => {
  const query = <any>querystring.parse(<any>url.parse(req.url || '').query);
  const { mockDir, mockKey } = config;
  if (query && query[mockKey]) {
    const mockFile = path.join(mockDir, query[mockKey]);
    delete require.cache[require.resolve(mockFile)];
    const mockFn = require(mockFile);
    const mockRes = await mockFn();
    return JSON.stringify(mockRes);
  }
  return null;
};
export default handleMock;
