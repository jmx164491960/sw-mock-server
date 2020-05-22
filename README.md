**sw-mock-server**
[![npm version](https://img.shields.io/static/v1?label=npm&message=v2.0.0&color=blue)](https://www.npmjs.com/package/sw-mock-server)
### 简介

根据swagger文档地址生成mock数据，简化前端mock的工作量

### 安装

npm install sw-mock-server

### 快速上手

**1.基础用法:**

跟目录创建文件 "sw.js"
```js
  const sw = require('sw-mock-server');
  
  sw({
    "port": "8089", // 程序监听端口
    "swaggerOptions": {
      // swagger文档页面，比如http://xxxx/swagger-ui.html
      "url": "http://xxxx/swagger-ui.html"
    }
  });
```
node sw --clean --pull --server


等待几秒后，访问localhost:8089 + [接口路径]可访问到mock数据


**2.进阶用法**

**命令**

以下命令：
```
node sw --clean --pull --server
```
等价于
```
node sw -c -p -s // 简写版本
```
也可以等价于分别执行：
```
node sw --clean // 清除swagger生成的mock数据
node sw --pull // 从swagger文档上遍历，生成mock数据
node sw --server // 监听指定端口，开启服务
```
等价于
```
node sw -c
node sw -p
node sw -s
```
命令参数可以按需使用，clean和pull并不是每次启动都需要；比如我已经生成过mock数据，那么只需要node sw --server

**配置**

上述的简化配置，需要在代码中把使用mock的接口域名改为localhost:8089，但现实中如果可以不修改会更方便，即mock接口和正常接口**共用一个域名**。使用**fail**回调函数可以做到

另外，对整个swagger文档进行遍历，对生成出我们本不需要的mock数据，这时候我们可以加入白名单**filterReg**


sw.js:
```js
  const run = require('./index.js');
  const httpProxy = require('http-proxy');
  const proxy = httpProxy.createProxyServer({});

  run({
    "port": "8089", // 程序监听端口
    // 请求没有被mock拦截，就转发到开发服务的url，这使得mock和非mock的接口可以使用同一个域名
    "fail": (req, res) => {
      proxy.web(req, res, {
        target: `http://127.0.0.1:8088`
      });
    },
    "swaggerOptions": {
      // swagger文档页面，比如http://xxxx/swagger-ui.html
      "url": "http://xxxx/swagger-ui.html"
      "filterReg": /getOverallBroadcastingData/, // 可以是URL正则或者为空，用于匹配swagger上的接口，如果空则匹配swagger上所有。
    }
  });

```

**3.更多用法**
除此之外，还有更多配置的字段。做到适合的配置，可以最大提高mock的效率。

### 配置说明


字段 | 类型 | 用法  
-|-|-
port | string | 程序监控端口 |
fail | function | 请求没有被mock命中的回调函数 |
extendMockArr | object[] | 扩展mock数据，格式{url: string, data: object} |
swaggerOptions | Object | 从swagger上生成mock过程的相关配置 |
swaggerOptions.url | string | swagger文档地址，如http://xxxx/swagger-ui.html |
swaggerOptions.filterReg | regexp  | 白名单规则，推荐接口量多的时候使用 |
swaggerOptions.arrayMockNum | Object | 数组型数据的模拟长度，根据属性min-max，在他们之间随机 |
swaggerOptions.arrayMockNum.min | number | 数组模拟长度最小值 |
swaggerOptions.arrayMockNum.max | Object | 从swagger上生成mock过程的相关配置 |
swaggerOptions.formatter | function | 格式化函数，用于对数据做一些统一特殊处理 |
