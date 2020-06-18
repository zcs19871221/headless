#!/usr/bin/env node
import { write } from './default_openId';
import Logger from 'better-loger';

(function setDefaultOpenIdFromCmd() {
  const [name, pwd] = process.argv.slice(2);
  if (!name || !pwd) {
    throw new Error('参数错误,如下:openid username password');
  }
  write(name, pwd, Logger.get());
})();
