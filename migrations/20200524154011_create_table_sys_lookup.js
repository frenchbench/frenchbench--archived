const tableName = 'sys_lookup';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.string('category', 50).index();
    table.string('id', 100).index();
    table.string('label', 100);
    table.jsonb('meta').defaultTo('{}');
    table.primary(['category', 'id']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
