require('dotenv').config();
const config = require('./src/config');

module.exports = {
  development: config.newDbConfig(process.env),
  staging: config.newDbConfig(process.env),
  production: config.newDbConfig(process.env),
};
