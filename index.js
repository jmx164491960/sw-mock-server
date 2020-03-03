#! /usr/bin/env node

const express = require('express');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const app = express();
const chalk = require('chalk');
// 转发端口号
const conf = require('./conf');


module.exports = {
  start: function(conf, callback) {
    const PORT = conf.port;
    app.listen(PORT, () => {
      console.log(chalk.green(`server start, listening port ${PORT}`));
    
      const mockHandler = require('./mock/swagger');
      // 启用mock拦截器
      mockHandler(app, conf);
    
      // 如果没有命中mock拦截器，转发到指定端口
      app.use('/', (req, res, next) => {
        const host = req.hostname;
        callback(...arguments);
        switch (host) {
          // 根据自己的项目配置
          // case 'scmfe.banggood.cn':
          //   proxy.web(req, res, {
          //     target: 'http://127.0.0.1:8088'
          //   });
          //   return;
    
          // case 'ewdtest.banggood.cn':
          //   proxy.web(req, res, {
          //     target: 'http://127.0.0.1:4321/'
          //   });
          //   return;
    
          // case 'erptest.banggood.cn':
          //   proxy.web(req, res, {
          //     target: 'http://127.0.0.1:8081'
          //   });
          //   return;
    
          // case 'erpdev.banggood.cn':
          //   proxy.web(req, res, {
          //     target: 'http://127.0.0.1:8081'
          //   })
          //   return;
    
          default:
            proxy.web(req, res, {
              target: `http://127.0.0.1:${conf.proxyPort}`
            });
            return;
        }
      });
    });
  },
  pull: function(swaggerOptions) {
    const synchronizeSwagger = require('./mock/swagger/synchronizeSwagger');
    synchronizeSwagger.init(swaggerOptions);
  }
}