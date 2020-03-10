#! /usr/bin/env node

const express = require('express');
const app = express();
const chalk = require('chalk');
// 转发端口号
const program = require('commander');
const mockClean = require('./mock/swagger/clean');

program
	.version(require('./package.json').version, '-v, --version')
	.description('swagger mock server')
	.option('-c --clean [type]', '清理mock数据')
	.option('-p --pull [type]', '生成mock数据')
	.option('-s --server [type]', '启动服务')
	.parse(process.argv);

const taskQueue = ['clean', 'pull', 'server'];

const taskHandler = {
  server: function(conf) {
    const fail = conf.fail;
    const PORT = conf.port;
    app.listen(PORT, () => {
      console.log(chalk.green(`server start, listening port ${PORT}`));
    
      const mockHandler = require('./mock/swagger');
      // 启用mock拦截器
      mockHandler(app, conf);
      // 如果没有命中mock拦截器，转发到指定端口
      app.use('/', function(req, res, next) {
        if (fail && typeof fail === 'function') {
          fail(...arguments);
        }
      });
    });
  },
  pull: function({swaggerOptions}) {
    const synchronizeSwagger = require('./mock/swagger/synchronizeSwagger');
    return synchronizeSwagger.init(swaggerOptions);
  },
  clean: mockClean
}

module.exports = async function run(conf) {
  for(let i = 0; i < taskQueue.length; i ++) {
    const name = taskQueue[i];
    if (program[name]) {
      await taskHandler[name](conf)
    }
  }
}