# swaggermock-server

### 简介

主要功能：
1. 域名转发功能
2. 集成了mock功能
3. 可通过设置配置，一键导入swagger接口数据并生成mock数据
4. 可使用相同域名做转发或mock

### 安装

git clone https://github.com/jmx164491960/swaggermock-server.git  
cd swaggermock-server  
npm i

### 配置说明

**必填**：
```js
port // 程序监控端口
proxyPort // 转发端口
swaggerOptions.url // swagger文档地址，如http://xxxx/swagger-ui.html
swaggerOptions.outputPath // 从swagger上自动生成的数据输出目录
```

**选填**：
```js
swaggerOptions.blacklist // 黑名单，过滤掉swagger上不需要拉取数据的接口
swaggerOptions.filterReg // 过滤规则，推荐接口量多的时候使用
swaggerOptions.arrayMockNum // 数组型数据的模拟长度
swaggerOptions.arrayMockNum.min // 数组模拟长度最小值 
swaggerOptions.arrayMockNum.max // 数组模拟长度最大值
swaggerOptions.formatter // 格式化函数，用于对数据做一些统一特殊处理
```

### 生成Mock数据

按需按成以上配置，执行npm run pull。等级几秒后数据会存放在本地outputPath目录。一般执行过一次以后不需要再执行。除非swagger上接口数据有更新，或者自己生成新的接口数据


### 启动

两种模式：

1.单一模式：

npm

2.集成模式：

```js

// 根据swagger文档地址生成最新的数据
// 如果已生成过，忽略此步
npm run pull
// 启动
npm run start
```
