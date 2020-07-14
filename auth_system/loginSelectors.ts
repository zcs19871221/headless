interface LoginSelector {
  urlMatcher: string | RegExp;
  accountSelector: string;
  pwdSelector: string;
  submitSelector: string;
}
const config: LoginSelector[] = [
  {
    urlMatcher: 'https://g.hz.netease.com/users/sign_in',
    accountSelector: '#username',
    pwdSelector: '#password',
    submitSelector: 'input[type=submit]',
  },
  {
    urlMatcher: 'http://jira.ws.netease.com/login.jsp',
    accountSelector: '#login-form-username',
    pwdSelector: '#login-form-password',
    submitSelector: '#login-form-submit',
  },
  {
    urlMatcher: 'https://login.netease.com/connect/',
    accountSelector: '#corp_id_for_corpid',
    pwdSelector: '#corp_id_for_corppw',
    submitSelector: '#corp .login-submit',
  },
  {
    urlMatcher: 'https://login.netease.com/accounts',
    accountSelector: '#corp_id_for_corpid',
    pwdSelector: '#corp_id_for_corppw',
    submitSelector: '#corp button[type=submit]',
  },
  {
    urlMatcher: /(https:\/\/mp\.163\.com\/login\.html)|(http:\/\/.+?\.dy\.163\.com\/login\.html)/,
    accountSelector: '#login-form #account-box input',
    pwdSelector: '#login-form input[name=password]',
    submitSelector: '#login-form #dologin',
  },
];
export default config;
