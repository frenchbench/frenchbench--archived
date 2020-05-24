import { newDb } from './db';

export function newApi(config) {

  const db = newDb(config.dbConfig);

  async function hello() {
    return db.test();
  }

  return {
    db,
    hello,
  }
}
