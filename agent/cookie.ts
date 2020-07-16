import fetchCookie from '../auth_system/getLoginedCookie';

class Cookie {
  private fetchingThead: Map<string, null | Promise<string>> = new Map();
  private cookieMap: Map<string, string> = new Map();

  async get(url: string, username: string, pwd: string): Promise<string> {
    if (this.fetchingThead.has(url) && this.fetchingThead.get(url) !== null) {
      return <any>this.fetchingThead.get(url);
    }
    if (this.cookieMap.has(url)) {
      return <string>this.cookieMap.get(url);
    }
    return new Promise((resolve, reject) => {
      const thread = fetchCookie({ username, pwd, url });
      this.fetchingThead.set(url, thread);
      thread
        .then(cookie => {
          this.cookieMap.set(url, cookie);
          resolve(cookie);
        })
        .catch(error => {
          reject(error);
        })
        .finally(() => {
          this.fetchingThead.set(url, null);
        });
    });
  }
}
export default new Cookie();
