const rm = require('rimraf');
const path = require('path');
const {routesPath} = require('../../config');

module.exports = function() {
  rm.sync(routesPath);
  return Promise.resolve();
}