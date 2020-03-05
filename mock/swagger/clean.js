const rm = require('rimraf');
const path = require('path');

module.exports = function() {
  rm.sync(path.join(__dirname, './routes'));
  return Promise.resolve();
}