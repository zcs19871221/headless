# 部署 noah

## 安装

全局: `npm install -g better-headless`  
当前目录: `npm install better-headless`

## 命令行

### deployNoah

`deployNoah file1 [file2] [file3]`

`程序运行目录`作为根目录,依次去找 file1,file2,file3 的配置文件.读取文件中的配置.后面覆盖前面.配置文件格式如下

    app=cmshz-xxxx-xxxx
    cluster=cmshz-article-xxxx-xx_test
    branch=dev
    user=bjxxxxx
    pwd=xxxxxx
    show=false
    debug=true
    stop=no

| 名称    | 必须 | 描述                                            | 默认  |
| ------- | ---- | ----------------------------------------------- | ----- |
| app     | 是   | 应用                                            |       |
| cluster | 是   | 集群                                            |       |
| user    | 是   | 用户名                                          |       |
| pwd     | 是   | 密码                                            |       |
| branch  | 否   | 分支 HEAD 表示当前 git 分支                     | HEAD  |
| show    | 否   | 是否显示浏览器操作过程                          | false |
| debug   | 否   | 是否显示 debug 信息                             | true  |
| stop    | 否   | 暂停模式三选一 first-第一批 each-每批 no-不暂停 | stop  |

### openid

`openid username passwd`

设置全局默认的账号密码.

### 最佳实践

    用户密码写在`.pwd` 中或通过openid命令进行全局设置

    不同环境配置写在不同文件中,比如 .test .pre .online 统一维护

    package.json 中不同环境调用不同的配置文件,比如:

        "test": "deployNoah .pwd .test"
        "pre": "deployNoah .pwd .pre"

## node 调用

    // commonjs module
    const { deployNoah } = require('better-headless')
    // es6 module
    import { deployNoah } from 'better-headless'

    deployNoah({app,cluster,branch,user,pwd,show,debug,stop}).then(xxx => xxx).catch(error => {
      console.error(error)
    })
