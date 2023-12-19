## 项目信息
- **码如云**是一个基于二维码的一物一码管理平台，可以为每一件“物品”生成一个二维码，手机扫码即可查看物品信息并发起相关业务操作，操作内容可由你自己定义，典型的应用场景包括固定资产管理、设备巡检以及物品标签等
- 在技术上，码如云是一个无代码平台，全程采用DDD、整洁架构和事件驱动架构思想完成开发，更多详情可参考笔者的[DDD落地文章系列](https://docs.mryqr.com/ddd-introduction/)
- 技术栈：Vue 2, Webpack 4, Axios 0.24, Element UI 2等
- 本代码库为码如云前端代码，与之匹配的后端代码可访问[码如云后端代码库](https://github.com/mryqr-com/mry-backend)


## 如何访问
- 访问地址：[https://www.mryqr.com](https://www.mryqr.com)


## 为什么开发码如云
- 为了开发出一款能让自己满意的软件
- 为了证明DDD能够真实落地
- 为了实践[整洁架构](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- 为了学习Web前端开发技术
- 更多信息请参考笔者的文章[构建自己的软件大厦](https://docs.mryqr.com/build-your-own-software-skyscraper/)


## 本地环境搭建
- 本地安装：Node.js v14.18.1及以上版本，Java 17及以上版本，Docker
- 将以下内容加入 `/etc/hosts` 文件，本地访问时需要使用域名访问
  ```
  127.0.0.1       console.local.mryqr.com
  127.0.0.1       m.local.mryqr.com
  127.0.0.1       api.local.mryqr.com
  0.0.0.0         console.local.mryqr.com
  0.0.0.0         m.local.mryqr.com
  0.0.0.0         api.local.mryqr.com
  ```
- 命令行切换到代码跟目录
- 运行 `npm install` 安装依赖
- 运行`./local-run.sh`，此命令用于启动前端
- 下载[码如云后端代码](https://github.com/mryqr-com/mry-backend)到本地，命令行切换到后端代码根目录，执行`./local-run.sh`，此命令用于启动后端
- 访问电脑端：[http://console.local.mryqr.com](http://console.local.mryqr.com)，默认用户名`15111111111`，密码`11111111`
- 访问手机端：[http://m.local.mryqr.com](http://m.local.mryqr.com)，默认用户名`15111111111`，密码`11111111`

## 修改ElementUI主题
- 根据需要修改 `element-variables.scss` 文件
- 运行 `./customize-element.sh`


## 寻求微信服务号合作方

我们正在寻找能够提供微信公众号（需要是**服务号**类型）的合作方，以让码如云能够入驻在该公众号中，从而为用户提供更多更完善的功能，有意者可联系作者


## 关于软件协议
本代码库旨在促进软件从业者之间的技术学习和交流，处于此目的您可以自由复制、修改和分享该代码库。需要指出的是，本代码库在遵循GPL-3.0协议的基础上，禁止将源代码以任何形式（包括但不限于直接使用或者在原代码基础上修改）进行商业化操作。
