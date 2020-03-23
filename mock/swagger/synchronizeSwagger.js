const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const mkdirp = require('mkdirp');
const swaggerMockMaker = require('swagger-mock-maker');

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(mkdirp);
const {routesPath} = require('../../config');

const synchronizeSwagger = {
  async init(swaggerOptions) {
    const { url, blacklist } = swaggerOptions;
    this.swaggerOptions = swaggerOptions;
    // 如果输入的是接口可视化地址，转换成v2/api-docs结尾的接口地址
    this.url = url.replace(/swagger-ui.html.*/, 'v2/api-docs');
    let basePath = this.url.match(/:[^\/]+\/*(.*)\/v2\/api-docs/)[1];
    if (basePath !== '') basePath = '/' + basePath;
    this.basePath = basePath;
    this.blacklist = blacklist || [];
    await this.parse();
  },

  async parse() {
    const { paths } = await swaggerMockMaker(this.url, this.swaggerOptions);
    await this.traverse(paths);
  },

  generateTemplate({ summary, example, method, path }) {
    // prettier-ignore
    // api path中的{petId}形式改为:petId
    return `/**
  ${summary}
**/
module.exports = {
  url: '${this.basePath}${path.replace(/\{([^}]*)\}/g, ":$1")}',
  getData: (Mock) => {
    return Mock.mock(${example});
  }
}`;
  },

  // 遍历api path信息
  async traverse(paths) {
    const promiseList = []
    for (let path in paths) {
      // if (this.filterReg && !this.filterReg.test(path)) {
      //   continue;
      // }

      if (this.blacklist.includes(path)) {
        continue;
      }

      for (let method in paths[path]) {
        const pathInfo = paths[path][method];

        if (!pathInfo['responses']['200']) {
          continue;
        }
        promiseList.push(this.generate(path, method, pathInfo));
      }
    }
    await Promise.all(promiseList);
  },

  async generate(path, method, pathInfo) {
    const outputPath = join(routesPath, path)
    const {
      summary,
      responses: { 200: responseOK },
    } = pathInfo;

    try {
      // 生成目录
      await mkdir(outputPath);

      const example = responseOK['example'];
      // 生成文件内容
      const template = this.generateTemplate({
        summary,
        example,
        method,
        path,
      });

      // 生成文件, 已存在的跳过，避免覆盖本地以及编辑的文件
      const fPath = join(outputPath, `${method}.js`);

      await writeFile(fPath, template, { flag: 'wx' });
      console.log(`增加Mock文件：${fPath}`);
    } catch (error) {
      console.log('err:', error.message);
      /* eslint-disable no-empty */
    }
  },
};

module.exports = synchronizeSwagger;
