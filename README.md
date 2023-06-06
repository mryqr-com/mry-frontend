## 项目信息
- 本项目为码如云的前端应用，包含电脑端(console)和手机端(client)
- Github地址: https://github.com/mryqr-com/mry-frontend
- 技术栈：Vue 2, Webpack 4, Axios 0.24, Element UI 2等

## 本地环境搭建
- 安装 Node.js（可工作版本v14.18.1，其他版本未试过）
- 运行 `npm install` 安装依赖
- 将以下内容加入 `/etc/hosts` 文件，本地访问时需要使用域名访问
  ```
  127.0.0.1       console.local.mryqr.com
  127.0.0.1       m.local.mryqr.com
  127.0.0.1       api.local.mryqr.com
  0.0.0.0         console.local.mryqr.com
  0.0.0.0         m.local.mryqr.com
  0.0.0.0         api.local.mryqr.com
  ```
- 本地运行: `./local-run.sh`
- 访问电脑端：http://console.local.mryqr.com
- 访问手机端：http://m.local.mryqr.com
- 部署生产前需要保证`/opt/bin/ossutilmac64`存在且可执行，另外需要配置`~/.ossutilconfig`文件

## 构建命令
- 本地运行: `./local-run.sh`
- 本地构建: `./ci-build.sh`
- 查看代码行数: `./count-loc.sh`
- 部署到生产环境：`./prod-deploy.sh`，将同时部署电脑端和手机端

## 修改ElementUI主题
- 根据需要修改 `element-variables.scss` 文件
- 运行 `./customize-element.sh`

## 注意事项
- 本地访问时需要使用域名进行访问，因为调用API时是通过域名解算出API地址的，即比如域名为`console.local.mryqr.com`，那么API地址则为`api.local.mryqr.com`，详情请参考`common-axios.js`中的`apiBaseUrl()`方法