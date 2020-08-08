import knex from 'knex';

export function newDbAdapter({ dbConfig, logger }) {
  logger.info('new db...');
  const db = knex(dbConfig);
  logger.info('new db... ready');

  /**
   * Run a raw SQL command
   * @param {string} sql e.g. 'select * from users where id = ?',
   * @param {array} params e.g. [ 'uuid' ]
   * @returns {any}
   */
  const query      = (sql, params) => db.raw(sql, params);
  const select     = (tableName, fields = '*') => db.select(fields).from(tableName);
  const insert     = (tableName, row) => db(tableName).insert(row);
  const findOne    = (tableName, { field, value }) => db(tableName).where(field, value).first();
  const findMany   = (tableName, { field, value }) => db(tableName).where(field, value).select();
  const update     = (tableName, { field, value }, changes) => db(tableName).where(field, value).update(changes);
  const deleteMany = (tableName, { field, value }) => db(tableName).where(field, value).del();

  const table = (tableName) => ({
    select: (fields = '*') => select(tableName, fields),
    insert: (row) => insert(tableName, row),
    findOne: (field, value) => findOne(tableName, { field, value }),
    findMany: (field, value) => findMany(tableName, { field, value }),
    update: (field, value, changes) => update(tableName, { field, value }, changes),
    deleteMany: (field, value) => deleteMany(tableName, { field, value }),
  });

  return {
    db,
    query,
    table,
    select,
    insert,
    findOne,
    findMany,
    update,
    deleteMany,
  };
}
