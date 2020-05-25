const tableName = 'entity_asset';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('parent_entity_id').notNullable().index()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.uuid('asset_id').notNullable().index()
      .references('id').inTable('asset')
      .onDelete('cascade');
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.primary(['parent_entity_id', 'asset_id']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
