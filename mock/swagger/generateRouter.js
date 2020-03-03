/**
  根据swagger 生成文件，然后挂到express router上
**/

const fs = require('fs');
const join = require('path').join;
const chalk = require('chalk');
const Mock = require('mockjs');

function scan(path, app) {
  const files = fs.readdirSync(path);

  for (let i = 0; i < files.length; i++) {
    const fpath = join(path, files[i]);
    const stats = fs.statSync(fpath);

    if (stats.isDirectory()) {
      scan(fpath, app);
    }
    if (stats.isFile()) {
      const {url, getData} = require(fpath);
      console.log('app.use', url);
      app.use(url, (req, res) => {
        // 解决跨域问题
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
        return res.json(getData(Mock));
      });
    }
  }
}

module.exports = function(app, conf) {
  const routesPath = join(__dirname, './routes');
  let hasRoutes = false;

  try {
    const stats = fs.statSync(routesPath);
    hasRoutes = stats.isDirectory();
  } catch(e) {}

  if (hasRoutes) {
    scan(routesPath, app);
    console.log(chalk.green('swagger mock is running'))
  }
};
