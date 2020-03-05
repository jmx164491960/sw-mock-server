const express = require('express');
const cors = require('./middleware/cors');
const bodyParser = require('./middleware/body-parser');
const delayRes = require('./middleware/delayRes');
const successRate = require('./middleware/successRate');
// const { port, delayRes: useDelayRes, successRate: useSuccessRates } = require('../../conf');
const generateRouter = require('./generateRouter');
// const manual = require('../manual');
const chalk = require('chalk');

module.exports = function(app, conf) {

  // app.use(cors());
  // app.use(bodyParser());

  // if (useDelayRes.trunon) {
  //   app.use(delayRes(useDelayRes.time));
  // }

  // app.use(delayRes(2000));

  // if (useSuccessRates.trunon) {
  //   app.use(successRate(useSuccessRates.rate));
  //   app.use((err, req, res) => {
  //     res.status(500).json({
  //       status: 500,
  //       errorMsg: 'Server Error',
  //       result: 'error',
  //     });
  //   });
  // }

  // 路由
  generateRouter(app, conf);
};