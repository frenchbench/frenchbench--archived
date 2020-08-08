import { dbConnectionConfig } from './dbConnectionConfig';

export function newConfig(pe, cwd) {
  return {
    version: 'v1.0.0',
    http: {
      port: pe.HTTP_PORT || 12000,
    },
    log: {
      format: pe.LOG_FORMAT || '',
      file: pe.LOG_FILE || 'access.log',
      consoleOn: pe.NODE_ENV !== 'test',
    },
    db: {
      client: pe.DB_CLIENT,
      connection: dbConnectionConfig(pe.DB_CLIENT, pe, ''),
      useNullAsDefault: true,
      pool: { min: 1, max: 5 },
      acquireConnectionTimeout: 10000,
      migrations: {
        tableName: 'gca_migrations_tests',
        directory: cwd + '/migrations',
      },
      seeds: {
        directory: cwd + '/seeds',
      },
    },
    gql: {
      schemaFile: cwd + '/schema.graphql',
    },
  };
}
