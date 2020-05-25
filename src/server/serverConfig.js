// used by knexfile.js and /pages/api/*

const DB_CLIENT_PG      = 'pg';
const DB_CLIENT_MYSQL   = 'mysql';
const DB_CLIENT_SQLITE3 = 'sqlite3';

function newHttpConfig(env){
  return {
    port: env.HTTP_PORT || 80,
  }
}

function newDbConfig(env){
  const client = env.DB_CLIENT || DB_CLIENT_SQLITE3;
  let connection = null;
  let moreOptions = {};
  const pool = {
    min: 1,
    max: 5,
    // afterCreate: (conn, done) => {
    //   // in this example we use db driver's connection API
    //   conn.query('SET timezone="UTC";', err => {
    //     if (err) {
    //       // first query failed, return error and don't try to make next query
    //       done(err, conn);
    //     } else {
    //       // do the second query...
    //       conn.query('SELECT set_limit(0.01);', err => {
    //         // if err is not falsy, connection is discarded from pool
    //         // if connection acquire was triggered by a query the error is passed to query promise
    //         done(err, conn);
    //       });
    //     }
    //   });
    // },
  };

  switch (client) {
    case DB_CLIENT_PG:
      connection = env.PG_CONNECTION_STRING;
      moreOptions = {
        //version: '12.2',
      };
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
      moreOptions = {
        //version: '5.7',
      };
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

function newConfig(env) {

  const httpConfig = newHttpConfig(env);
  const dbConfig = newDbConfig(env);

  return {
    httpConfig,
    dbConfig,
    security: {
      secretPattern: 'AB12CD', // a secret to be emailed
      passwordPatterns: [
        /[A-Z]+/,
        /[a-z]+/,
        /[0-9]+/,
        /[\+\-\*\=\,\.\;\:\'\"\<\>\[\]\{\}\(\)\@\#\$\£\€\!]+/,
        /.{10,}/,
      ],
      tokens: {
        signKey: env.SECURITY_TOKENS_SIGN_KEY,
        expiry: env.SECURITY_TOKEN_EXPIRY || '1h',
      },
    },
  };
}

module.exports = {
  newHttpConfig,
  newDbConfig,
  newConfig,
};
