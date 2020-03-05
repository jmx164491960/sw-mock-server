const run = require('./index.js');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

run({
  "port": "8089", // 程序监听端口
  // 请求没有被mock数据命中的回调数据
  "fail": (req, res) => {
    proxy.web(req, res, {
      target: `http://127.0.0.1:8088`
    });
  },
  // 扩展的mock接口
  "extendMockArr": [
    // 例子
    {
      url: '/xx/demo',
      data: {
        code: 200,
        result: '定义自己需要调试用的数据'
      }
    }
  ],
  "swaggerOptions": {
    // swagger文档页面，比如http://xxxx/swagger-ui.html
    "url": "http://xxxx/swagger-ui.html",
    "blacklist": [], // 黑名单，类型是字符串数组
    "filterReg": /getOverallBroadcastingData/, // 可以是URL正则或者为空，用于匹配swagger上的接口，如果空则匹配swagger上所有。
    // 数组类型数据的模拟个数  从min-max区间内随机模拟
    "arrayMockNum" : {
      "min": 1,
      "max": 20
    },
    // 格式化函数，用于做一些特殊处理
    "formatter": (jsonData) => {
      // 根据自己实际场景的接口做处理。比如我把我部门的接口字段is_success都设置true
      if (jsonData && jsonData.is_success !== undefined) {
        jsonData.is_success = true;
      }
      return jsonData;
    }
  }
});