const tableName = 'tbl_entity_asset';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();

    table.string('parent_entity_kind', 20).notNullable().index();
    table.uuid('parent_entity_id').notNullable().index();

    table.uuid('asset_id').notNullable().index()
      .references('id').inTable('asset')
      .onDelete('cascade');

    table.jsonb('meta').notNullable().defaultTo('{}');

    table.timestamp('created_at', { useTz: true }).notNullable();
    table.timestamp('updated_at', { useTz: true }).notNullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();

    table.unique(['parent_entity_id', 'asset_id']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
