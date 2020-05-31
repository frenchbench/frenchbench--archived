export const DB_CLIENT_PG      = 'pg';
export const DB_CLIENT_MYSQL   = 'mysql';
export const DB_CLIENT_SQLITE3 = 'sqlite3';

export interface IProcessEnv {

  HTTP_PORT?: string; // e.g. '8080'

  DB_CLIENT?: string; // e.g. 'pg', 'sqlite3', 'mysql'

  // # PostgreSQL
  // when DB_CLIENT="pg"
  PG_CONNECTION_STRING?: string; // e.g. "postgres://aUser:aPassword@aHost:5432/aDb"

  // SQLite3
  // when DB_CLIENT="sqlite3"
  SQLITE_FILE?: string; // e.g. "./tmp/db.sqlite" or ":memory:"

  // MySQL or MariaDB
  // when DB_CLIENT="mysql"
  MYSQL_HOST?: string; // e.g. "localhost"
  MYSQL_PORT?: string; // e.g. "15432"
  MYSQL_USER?: string; // e.g. "pgadmin"
  MYSQL_PASSWORD?: string; // e.g. "ZkWuZU2IEmFj"
  MYSQL_DATABASE?: string; // e.g. "fbdb"

  // Security
  SECURITY_TOKENS_SIGN_KEY?: string; // random string
  SECURITY_TOKENS_EXPIRY?: string; // e.g. '1h'

}

export interface IHttpConfig {
  port: number;
}

function newHttpConfig(env: IProcessEnv): IHttpConfig {
  return {
    port: parseInt(env.HTTP_PORT || '8080'),
  }
}

export type IDbConfigConnectionPgSql = string;

export interface IDbConfigConnectionSqlite {
  filename: string;
}

export interface IDbConfigConnectionMySql {
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
}

export type IDbConfigConnection = IDbConfigConnectionPgSql | IDbConfigConnectionMySql | IDbConfigConnectionSqlite;

export interface IDbConfig {
  client: string; // pg, mysql, sqlite3
  connection: IDbConfigConnection;
  pool: {
    min: number;
    max: number;
  }
  migrations: {
    tableName: string;
  }
  useNullAsDefault: boolean;
  acquireConnectionTimeout: number;
}

function newDbConfig(env: IProcessEnv): IDbConfig {
  const client = env.DB_CLIENT || DB_CLIENT_SQLITE3;
  let connection: IDbConfigConnection;
  let moreOptions = {};
  const pool = { min: 1, max: 5 };

  switch (client) {
    case DB_CLIENT_PG:
      connection = env.PG_CONNECTION_STRING || '';
      moreOptions = {}; //version: '12.2',
      break;
    case DB_CLIENT_SQLITE3:
      connection = env.SQLITE_FILE || '';
      break;
    case DB_CLIENT_MYSQL:
      connection = {
        host: env.MYSQL_HOST || '',
        port: parseInt(env.MYSQL_PORT || '3306'),
        user: env.MYSQL_USER || '',
        password: env.MYSQL_PASSWORD || '',
        database: env.MYSQL_DATABASE || '',
      };
      moreOptions = {}; //version: '5.7',
      break;
    default:
      console.error('invalid db client', client);
      throw new Error('Invalid database configuration');
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

export interface ISecurityConfig {
  secretPattern: string;
  passwordPatterns: Array<RegExp>;
  tokens: {
    signKey: string;
    expiry: string;
  }
}

export function newSecurityConfig(env: IProcessEnv): ISecurityConfig {
  return {
    secretPattern: 'AB12CD', // a secret to be emailed
    passwordPatterns: [
      /[A-Z]+/,
      /[a-z]+/,
      /[0-9]+/,
      /[\+\-\*\=\,\.\;\:\'\"\<\>\[\]\{\}\(\)\@\#\$\£\€\!]+/,
      /.{10,}/,
    ],
    tokens: {
      signKey: env.SECURITY_TOKENS_SIGN_KEY || '', // TODO warning
      expiry: env.SECURITY_TOKENS_EXPIRY || '1h',
    },
  }
}

export interface IServerConfig {
  httpConfig: IHttpConfig;
  dbConfig: IDbConfig;
  security: ISecurityConfig;
}

export function newConfig(env: IProcessEnv): IServerConfig {
  return {
    httpConfig: newHttpConfig(env),
    dbConfig: newDbConfig(env),
    security: newSecurityConfig(env),
  };
}
