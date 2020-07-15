import Config from './config';
import fetchCookie from '../auth_system/getLoginedCookie';
import { read as readDefaultOpenId } from '../utils/default_openId';
import readConfigFile from '../utils/read_config_file';

export default async function getCookie(
  config: Config,
  url: string,
): Promise<string> {
  if (config.cookie) {
    return config.cookie;
  }
  const defaultOpenIdConfig = readDefaultOpenId();
  const openIdConfig = readConfigFile([config.openId]);
  const { username, pwd } = <any>{
    ...defaultOpenIdConfig,
    ...openIdConfig,
  };
  return await fetchCookie({ username, pwd, url });
}
