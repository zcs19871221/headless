import { IncomingMessage } from 'http';

export default function getBody(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    const buf: Buffer[] = [];
    let len = 0;
    req.on('data', chunk => {
      buf.push(chunk);
      len += chunk.length;
    });
    req.on('end', () => {
      resolve(Buffer.concat(buf, len));
    });
    req.on('error', error => {
      reject(error);
    });
  });
}
