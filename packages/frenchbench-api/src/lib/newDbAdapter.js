import knex from 'knex';

export function newDbAdapter({ expressApp, config, logger }) {
  logger.info('new db...');
  const db = knex(config.db);
  logger.info('new db... ready');

  /**
   * Run a raw SQL command
   * @param {String} sql    e.g. 'select * from users where id = ?'
   * @param {Array} params  e.g. [ 'uuid' ]
   * @returns {Promise<any>}
   */
  const query      = async (sql, params) => db.raw(sql, params);
  const select     = async (tableName, fields = '*') => db.select(fields).from(tableName);
  const insert     = async (tableName, row) => db(tableName).insert(row);
  const findOne    = async (tableName, { field, value }) => db(tableName).where(field, value).first();
  const findMany   = async (tableName, { field, value }) => db(tableName).where(field, value).select();
  const update     = async (tableName, { field, value }, changes) => db(tableName).where(field, value).update(changes);
  const deleteMany = async (tableName, { field, value }) => db(tableName).where(field, value).del();

  const table = (tableName) => ({
    select:     async (fields = '*') => select(tableName, fields),
    insert:     async (row) => insert(tableName, row),
    findOne:    async (field, value) => findOne(tableName, { field, value }),
    findMany:   async (field, value) => findMany(tableName, { field, value }),
    update:     async (field, value, changes) => update(tableName, { field, value }, changes),
    deleteMany: async (field, value) => deleteMany(tableName, { field, value }),
  });

  const dbAdapter = {
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
  expressApp.set('dbAdapter', dbAdapter);
  return dbAdapter;
}
