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

app-应用名  
cluster-集群名  
branch-分支  
user-用户名  
pwd-密码  
show-是否显示浏览器  
debug-是否显示 debug 消息

branch 输入`HEAD`表示使用当前 git 分支

### openid

`openid username passwd`

设置全局默认的账号密码.

### 最佳实践

    用户密码写在`.pwd` 中或通过openid命令进行全局设置

    不同环境配置写在不同文件中,比如 `.test .pre .online` 统一维护

    package.json 中不同环境调用不同的配置文件,比如:

        "test": "deployNoah .pwd .test"
        "pre": "deployNoah .pwd .pre"

## node 调用

    // commonjs module
    const { deployNoah } = require('better-headless')
    // es6 module
    import { deployNoah } from 'better-headless'

    deployNoah({app,cluster,branch,user,pwd,show,debug}).then(xxx => xxx).catch(error => {
      console.error(error)
    })
