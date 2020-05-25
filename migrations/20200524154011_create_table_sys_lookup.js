const tableName = 'sys_lookup';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.string('category', 50).notNullable().index();
    table.string('id', 100).notNullable().index();
    table.string('label', 100).notNullable();
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.primary(['category', 'id']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
