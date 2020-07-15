import http from 'http';
import getCookie from './getCookie';
import Config from './config';
import handleMock from './handleMock';
import proxy from './proxy';

const create = async (port: number) => {
  http
    .createServer(async (req, res) => {
      const response = (body: string) => {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
        });
        res.end(body);
      };
      if (req.method?.toUpperCase() === 'OPTIONS') {
        return response('');
      }
      try {
        const configLocate = <string>req.headers.__config;
        delete req.headers.__config;
        const config = <Config>require(configLocate);

        const mockRes = await handleMock(req, config);
        if (mockRes !== null) {
          return response(mockRes);
        }
        const targetGroup = config.target.find(
          each => each[0] === config.current,
        );
        if (!targetGroup) {
          throw new Error('current不匹配');
        }
        const target = targetGroup[1];
        const cookie = await getCookie(config, target);
        await proxy({ req, res, config, target, cookie, port });
        console.log(req.method, req.url, '成功');
      } catch (error) {
        console.log(req.method, req.url, '失败', error);
      }
    })
    .listen(port);
};

export default create;
