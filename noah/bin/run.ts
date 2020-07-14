#!/usr/bin/env node
import deploy from '../deploy';
import path from 'path';
import readConfigFile from '../../utils/read_config_file';
import * as defaultOpenId from '../default_openId';

(function runAtCmd() {
  const configLocates = process.argv
    .slice(2)
    .map(file => path.join(process.cwd(), file));
  const config: any = readConfigFile(configLocates);
  let defaultOpenIdConfig: any = {};
  if (defaultOpenId.has()) {
    defaultOpenIdConfig = defaultOpenId.read();
  }
  deploy({ ...defaultOpenIdConfig, ...config }).catch(error => {
    console.error(error);
  });
  return;
})();
