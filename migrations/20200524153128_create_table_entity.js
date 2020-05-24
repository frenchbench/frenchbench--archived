const tableName = 'entity';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary();
    table.string('kind', 20).index();
    table.timestamp('created_at', { useTz: true, precision: 3 }).index();
    table.timestamp('updated_at', { useTz: true, precision: 3 }).index();
    table.uuid('created_by').nullable().index();
    table.uuid('updated_by').nullable().index();
    table.jsonb('meta').defaultTo('{}');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
