import os from 'os';
import path from 'path';
import { writeFileSync, existsSync } from 'better-fs';
import Logger from 'better-loger';
import read_config_file from '../utils/read_config_file';

const defaultOpenIdLocate = path.join(os.homedir(), '.openid');

export function has() {
  return existsSync(defaultOpenIdLocate);
}

export function read() {
  return read_config_file([defaultOpenIdLocate]);
}

export function write(name: string, pwd: string, logger: Logger) {
  const dest = writeFileSync(defaultOpenIdLocate, `user=${name}\npwd=${pwd}`);
  logger.info(`opendId账号:${name} 密码:${pwd} 写入${dest}`);
}
