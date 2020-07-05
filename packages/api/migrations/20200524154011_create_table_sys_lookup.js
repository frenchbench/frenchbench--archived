const tableName = 'tbl_sys_lookup';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();
    table.string('category', 50).notNullable().index();
    table.string('value', 100).notNullable().index();
    table.string('label', 100).notNullable();
    table.jsonb('meta').notNullable().defaultTo('{}');

    table.timestamp('created_at', { useTz: true }).notNullable();
    table.timestamp('updated_at', { useTz: true }).notNullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();

    table.unique(['category', 'value']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
