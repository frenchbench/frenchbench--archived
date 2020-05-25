require('dotenv').config();
const config = require('./src/server/serverConfig');

module.exports = {
  development: config.newDbConfig(process.env),
  staging: config.newDbConfig(process.env),
  production: config.newDbConfig(process.env),
};
