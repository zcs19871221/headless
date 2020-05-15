# 部署 noah

## 命令行

1. 全局安装

   `npm install -g better-headless`  
   `deployNoah configFile1 configFile2`

2. 目录安装

   `npm install better-headless`  
   在 package.json 中增加 script 命令:`"deploy": "deployNoah configFile1 configFile2"`

会从执行根目录下的 configFile1 和 configFile2 中读取配置,后面覆盖前面,configFile 全部配置如下格式:

    app=xxxx
    cluster=xxxxx
    branch=dev
    user=bjxxxxx
    pwd=xxxxxx
    show=true
    debug=false

app-应用名 cluster-集群名 branch-分支 user-用户名 pwd-密码 show-是否显示浏览器 debug-是否显示 debug 信息

## node 程序

    // commonjs module
    const {deployNoah} = require('better-headless')
    // es6 module
    import {deployNoah} from 'better-headless'

    deployNoah({app,cluster,branch,user,pwd,show,debug}).then(xxx => xxx).catch(error => {
      console.error(error)
    })
