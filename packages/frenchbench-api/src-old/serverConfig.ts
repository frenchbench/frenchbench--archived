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

  // for storage - aws s3
  AWS_S3_CLIENT_ID?: string;
  AWS_S3_CLIENT_SECRET?: string;

  // for identity provider - github
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GITHUB_REDIRECT_URI?: string;

  // for identity provider - github
  LINKEDIN_CLIENT_ID?: string;
  LINKEDIN_CLIENT_SECRET?: string;
  LINKEDIN_REDIRECT_URI?: string;

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

export interface IAuthProviderBase {
  authUrl: string; // provider's url to init authorize
  accessTokenUrl: string; // provider's url to create access token
  apiBaseUrl: string; // provider's url to make API calls
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

export interface ISecurityConfig {
  secretPattern: string;
  passwordPatterns: Array<RegExp>;
  tokens: {
    signKey: string;
    expiry: string;
  },
  authProviders: {
    github: IAuthProviderBase;
    linkedin: IAuthProviderBase;
  }
}

export function newGithubConfig(env: IProcessEnv): IAuthProviderBase {
  return {
    authUrl: 'https://github.com/login/oauth/authorize',
    accessTokenUrl: 'https://github.com/login/oauth/access_token',
    apiBaseUrl: 'https://api.github.com',
    clientId: env.GITHUB_CLIENT_ID || '', // TODO: warning
    clientSecret: env.GITHUB_CLIENT_SECRET || '', // TODO: warning
    redirectUri: env.GITHUB_REDIRECT_URI || '', // TODO: warning
    scope: 'profile',
  }
}
export function newLinkedInConfig(env: IProcessEnv): IAuthProviderBase {
  return {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    accessTokenUrl: 'https://www.linkedin.com/oauth/v2/access_token',
    apiBaseUrl: 'https://api.linkedin.com/v2',
    clientId: env.LINKEDIN_CLIENT_ID || '', // TODO: warning
    clientSecret: env.LINKEDIN_CLIENT_SECRET || '', // TODO: warning
    redirectUri: env.LINKEDIN_REDIRECT_URI || '', // TODO: warning
    scope: 'r_basicprofile',// 'r_liteprofile',
  }
}

export function newSecurityConfig(env: IProcessEnv): ISecurityConfig {
  return {
    secretPattern: 'AB12CD', // a secret to be emailed
    passwordPatterns: [
      /[A-Z]+/,
      /[a-z]+/,
      /[0-9]+/,
      /[+\-*=,.;:'"<>[\]{}()@#$£€!]+/,
      /.{10,}/,
    ],
    tokens: {
      signKey: env.SECURITY_TOKENS_SIGN_KEY || '', // TODO warning
      expiry: env.SECURITY_TOKENS_EXPIRY || '1h',
    },
    authProviders: {
      github: newGithubConfig(env),
      linkedin: newLinkedInConfig(env),
    },
  }
}

export function getAuthProviderConfig(config: IServerConfig, key: string): IAuthProviderBase {
  if (key === 'github') return config.security.authProviders.github;
  if (key === 'linkedin') return config.security.authProviders.linkedin;
  throw new Error('unknown auth provider');
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
