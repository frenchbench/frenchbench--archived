const tableName = 'secret';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();
    table.timestamp('created_at', { useTz: true, precision: 3 }).notNullable();
    table.string('secret', 20).notNullable();
    table.string('email', 100).notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
