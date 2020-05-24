const knex = require('knex');

export function newDb(dbConfig) {
  const _db = knex(dbConfig);

  async function test() {
    const result = await _db.select().table('test');
    return {
      data: result.rows,
      meta: { count: result.rowCount },
    }
  }

  return {
    _db,
    test,
  };
}
