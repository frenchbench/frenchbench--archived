require('dotenv').config();

const DB_CLIENT_PG      = 'pg';
const DB_CLIENT_MYSQL   = 'mysql';
const DB_CLIENT_SQLITE3 = 'sqlite3';

function newDbConfig(env){
  const client = env.DB_CLIENT || DB_CLIENT_SQLITE3;
  let connection = null;
  let moreOptions = {};
  const pool = {
    min: 1,
    max: 5,
  };

  switch (client) {
    case DB_CLIENT_PG:
      connection = env.PG_CONNECTION_STRING;
      moreOptions = {};
      break;
    case DB_CLIENT_SQLITE3:
      connection = env.SQLITE_FILE;
      break;
    case DB_CLIENT_MYSQL:
      connection = {
        host: env.MYSQL_HOST,
        port: env.MYSQL_PORT,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
      };
      moreOptions = {};
      break;
    default:
      console.warn('invalid db client', client);
  }

  return {
    client,
    connection,
    migrations: {
      tableName: 'knex_migrations',
    },
    pool,
    useNullAsDefault: true,
    acquireConnectionTimeout: 10000, // 10 seconds
    ...moreOptions,
  };
}

module.exports = {
  development: newDbConfig(process.env),
  staging: newDbConfig(process.env),
  production: newDbConfig(process.env),
};
