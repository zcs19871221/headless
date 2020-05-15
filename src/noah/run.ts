#!/usr/bin/env node
import deploy from './deploy';
import * as fs from 'better-fs';
import path from 'path';

const readOpenIdConfig = () => {
  const configLocates = process.argv
    .slice(2)
    .map(file => path.join(process.cwd(), file));
  const config: any = {};
  // const envNames = ['app', 'cluster', 'user', 'pwd', 'branch', 'debug', 'show'];
  configLocates.forEach(configLocate => {
    if (fs.existsSync(configLocate)) {
      fs.readFileSync(configLocate, 'utf-8')
        .split('\n')
        .filter(each => each.trim())
        .forEach(each => {
          if (each.split('=').length === 2) {
            const key = each.split('=')[0];
            let value: any = each.split('=')[1];
            if (value === 'false') {
              value = false;
            }
            if (value === 'true') {
              value = true;
            }
            config[key.trim()] = value;
          }
        });
    }
  });
  deploy(config).catch(error => {
    console.error(error);
  });
  return;
};
readOpenIdConfig();
