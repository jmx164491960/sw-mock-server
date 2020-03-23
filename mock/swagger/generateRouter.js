/**
  根据swagger 生成文件，然后挂到express router上
**/

const fs = require('fs');
const join = require('path').join;
const chalk = require('chalk');
const Mock = require('mockjs');
const {routesPath} = require('../../config');

function scan(path, app) {
  let swMockDatas = [];
  const files = fs.readdirSync(path);

  for (let i = 0; i < files.length; i++) {
    const fpath = join(path, files[i]);
    const stats = fs.statSync(fpath);

    if (stats.isDirectory()) {
      swMockDatas = [...swMockDatas, ...scan(fpath, app)];
    }
    if (stats.isFile()) {
      const mockData = require(fpath);
      const {url, getData} = mockData;
      swMockDatas.push(mockData);
    }
  }

  return swMockDatas;
}

module.exports = function(app, conf) {
  let hasRoutes = false;

  try {
    const stats = fs.statSync(routesPath);
    hasRoutes = stats.isDirectory();
  } catch(e) {}

  let mockDatas = [];
  if (hasRoutes) {
    const swMockDatas = scan(routesPath, app);
    mockDatas = swMockDatas;
  }

  // swagger外扩展的接口
  if (conf.extendMockArr && conf.extendMockArr.length > 0) {
    conf.extendMockArr.forEach(item => {
      item.getData = () => {
        return item.data;
      }
    });
    mockDatas = [...mockDatas, ...conf.extendMockArr];
  }
  // 拦截
  if (mockDatas && mockDatas.length > 0) {
    try {
      mockDatas.forEach(config => {
        const {url, getData} = config;
        app.use(url, (req, res) => {
          // 解决跨域问题
          res.header('Access-Control-Allow-Origin', req.headers.origin);
          res.header('Access-Control-Allow-Credentials', true);
          res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
          return res.json(getData(Mock));
        });
      });
    } catch (e) {
      console.error('app.use:', e);
    }
  }

  console.log(chalk.green('Mock is running'));
  mockDatas.forEach(data => {
    console.log('Mock Interface:', data.url);
  })
};
