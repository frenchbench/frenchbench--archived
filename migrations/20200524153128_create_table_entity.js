const tableName = 'entity';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();
    table.string('kind', 20).notNullable().index();
    table.timestamp('created_at', { useTz: true, precision: 3 }).notNullable().index();
    table.timestamp('updated_at', { useTz: true, precision: 3 }).notNullable().index();
    table.uuid('created_by').nullable().index();
    table.uuid('updated_by').nullable().index();
    table.jsonb('meta').notNullable().defaultTo('{}');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
