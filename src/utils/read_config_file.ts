import * as fs from 'better-fs';

export default function readConfigFile(configLocates: string[]) {
  const config: any = {};
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
  return config;
}
