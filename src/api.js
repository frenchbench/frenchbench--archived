const knex = require('knex');


export function dbConfig(){
  const pe = process.env;
  const client = pe.DB_CLIENT;
  let connection = null;
  if (client === 'mysql') {
    connection = {
      host: pe.DB_HOST,
      user: pe.DB_USER,
      password: pe.DB_PASSWORD,
      database: pe.DB_DATABASE,
    }
  }

  return {
    client,
    connection,
    pool: { min: 1, max: 5 },
  };
}


export async function hello() {
  const db = knex(dbConfig());
  return db.raw('SELECT now() AS ts');
  //return Promise.resolve([
  //  { name: 'hello from db' },
  //]);
}

