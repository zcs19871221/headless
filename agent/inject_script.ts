(function() {
  const replace = (function init(open, fetch, send) {
    const CONFIG_PATH = 'TO_REPLACE';
    const HEAD_KEY = '__config';
    const changeUrl = (url: any) => {
      url = new URL(url);
      url.protocol = 'http:';
      url.hostname = 'localhost';
      url.port = '9091';
      return url.toString();
    };
    return () => {
      window.XMLHttpRequest.prototype.open = function(...args: any[]) {
        if (args[1]) {
          args[1] = changeUrl(args[1]);
        }
        // @ts-ignore
        return open.call(this, ...args);
      };
      window.XMLHttpRequest.prototype.send = function(...args) {
        this.setRequestHeader(HEAD_KEY, CONFIG_PATH);
        return send.call(this, ...args);
      };
      if (fetch) {
        window.fetch = (...args) => {
          if (args[0]) {
            args[0] = changeUrl(args[0]);
          }
          if (!args[1]) {
            args[1] = {};
          }
          args[1] = {
            ...args[1],
            credentials: 'include',
            headers: { ...(args[1].headers || {}), [HEAD_KEY]: CONFIG_PATH },
          };
          return fetch(...args);
        };
      }
    };
  })(
    window.XMLHttpRequest.prototype.open,
    window.fetch,
    window.XMLHttpRequest.prototype.send,
  );
  const xhr = new XMLHttpRequest();
  xhr.open('get', 'http://localhost:9494/__isAlive');
  xhr.addEventListener('load', () => {
    if (xhr.response === 'agent_alive') {
      replace();
    }
  });
  xhr.addEventListener('error', () => {});
  xhr.send();
})();
