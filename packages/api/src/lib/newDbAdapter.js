import knex from 'knex';

export function newDbAdapter({ dbConfig, logger }) {
  logger.info('new db...');
  const db = knex(dbConfig);
  logger.info('new db... ready');

  /**
   * Run a raw SQL command
   * @param {string} sql e.g. 'select * from users where id = ?',
   * @param {array} params e.g. [ 1 ]
   * @returns {any}
   */
  const query      = (sql, params) => db.raw(sql, params);
  const table      = (tableName, fields = '*') => db.select(fields).from(tableName);
  const insert     = (tableName, row) => db(tableName).insert(row);
  const deleteMany = (tableName, { field, value }) => db(tableName).where(field, value).del();
  const update     = (tableName, { field, value }, changes) => db(tableName).where(field, value).update(changes);

  return {
    db,
    query,
    table,
    insert,
    deleteMany,
    update,
  };
}
