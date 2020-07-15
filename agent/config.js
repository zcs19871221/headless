module.exports = {
  // 代理目标
  target: [
    // 0位置代表目标id，作用于matcher和current
    // 1位置代表目标html入口地址，会替换请求url的协议和domain忽略路径
    ['online', 'http://online.netease.com/index.html'],
    ['test', 'http://test.netease.com/index.html'],
    ['pre', 'http://pre.netease.com/index.html'],
  ],
  // url代理规则
  match: [
    // /开头的请求，自动代理到current对应的目标域名
    [/\/.*/, 'current'],
  ],
  // 当前生效目标地址
  current: 'test',
  // 代理服务端口
  port: 8848,
  // mock文件夹目录，相对于本文件地址
  mockDir: 'mock',
  // mock文件名对应键
  // /getUserList?__mock=userList
  // 会commojs默认导入mock/userList.js,应该是一个函数,执行后返回个ajax请求
  mockKey: '__mock',
  // 使用的cookie，没有的话会尝试通过headless请求
  cookie: '',
  // openid配置文件，格式参考readme
  openId: '.openid',
  // 判断ajax返回是否过期,如果过期了，会重新执行获取cookie操作
  isCookieOutDate: response => {
    const res = JSON.parse(response);
    if (res.code === 454) {
      return true;
    }
    return false;
  },
};
