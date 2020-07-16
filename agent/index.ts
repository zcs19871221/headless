import http from 'http';
import path from 'path';
import Config from './index.d';
import handleMock from './handle_mock';
import proxy from './proxy';
import getBody from './get_body';

const server = async (port: number = 9091) => {
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
      if (req.url === '/__isAlive') {
        return response('agent_alive');
      }
      if (req.method?.toUpperCase() === 'OPTIONS') {
        return response('');
      }
      try {
        const configLocate = <string>req.headers.__config;
        delete req.headers.__config;
        delete require.cache[require.resolve(configLocate)];
        const config = <Config>require(configLocate).default;

        const mockRes = await handleMock(
          req,
          config,
          path.dirname(configLocate),
        );
        if (mockRes !== null) {
          return response(mockRes);
        }
        const targetGroup = config.target.find(
          each => each[0] === config.current,
        );
        if (!targetGroup) {
          throw new Error('current不匹配');
        }
        const target = new URL(targetGroup[1]);
        const body = <any>await getBody(req);

        await proxy({ req, res, config, target, body });
        console.log(req.method, req.url, '成功');
      } catch (error) {
        console.log(req.method, req.url, '失败', error);
      }
    })
    .listen(port, () => {
      console.log('服务启动在http://localhost:9091');
    });
};

export default server;
server();
