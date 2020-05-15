# 部署 noah

## 命令行

1.  全局安装

    `npm install -g better-headless`  
    `deployNoah file1 [file2] [file3]`

2.  目录安装

    `npm install better-headless`  
     在 package.json 中增加 script 命令:`"deploy": "deployNoah file1 [file2] [file3]"`

3.  配置文件

    从参数中获取文件名 file1,file2,去运行根目录查找文件读取配置,后面覆盖前面

    文件内容如下格式:

         app=xxxx
         cluster=xxxxx
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
     debug-是否显示  
     debug 信息

4.  最佳实践

    用户密码写在.pwd 中 每人维护自己的 gitignore

    不同环境写在不同文件中,比如 test1 test2 pre1 pre2 online 统一维护

    package.json 中对应不同环境有不同的调用,比如:

        "t1": "deployNoah test1"
        "t2": "deployNoah test2"

## node 程序

    // commonjs module
    const { deployNoah } = require('better-headless')
    // es6 module
    import { deployNoah } from 'better-headless'

    deployNoah({app,cluster,branch,user,pwd,show,debug}).then(xxx => xxx).catch(error => {
      console.error(error)
    })
