const tableName = 'secret';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary();
    table.timestamp('created_at', { useTz: true, precision: 3 });
    table.string('secret', 20);
    table.string('email', 100);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
