#!/usr/bin/env node
import deploy from '.';
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
            const [key, value] = each.split('=');
            config[key.trim()] = value.trim();
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
