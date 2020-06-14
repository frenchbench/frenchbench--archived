const tableName = 'tbl_auth_identity';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();

    table.string('provider_id', 20).notNullable();
    table.string('external_username', 100).notNullable();
    table.jsonb('meta').notNullable().defaultTo('{}');

    table.timestamp('created_at', { useTz: true, precision: 3 }).notNullable();
    table.timestamp('updated_at', { useTz: true, precision: 3 }).notNullable();

    table.unique(['provider_id', 'external_username']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
