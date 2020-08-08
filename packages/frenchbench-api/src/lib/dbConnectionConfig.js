export function dbConnectionConfig(client, pe, prefix = 'PG'){
  let connection = null;
  let defaultHost = '127.0.0.1';
  let defaultPort = 0;
  switch (client) {
    case 'mssql': defaultPort = 1433; break;
    case 'mysql': defaultPort = 3306; break;
    case 'pg':    defaultPort = 5432; break;
    default: break;
  }
  switch (client) {
    case 'mssql':
    case 'mysql':
    case 'pg':
      connection = {
        host: pe[prefix + 'DB_HOST'] || defaultHost,
        port: parseInt(pe[prefix + 'DB_PORT']) || defaultPort,
        user: pe[prefix + 'DB_USER'] || 'admin',
        password: pe[prefix + 'DB_PASS'] || '',
        database: pe[prefix + 'DB_NAME'] || 'gca_db',
      };
      break;
    case 'sqlite3':
      connection = {
        filename: pe[prefix + 'DB_FILE'],
      };
      break;
    default:
      break;
  }
  return connection;
}
