const tableName = 'asset';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.string('asset_type', 50).notNullable();
    table.string('media_type', 50).notNullable();
    table.string('label', 50).nullable();
    table.string('url', 255).notNullable();
    table.jsonb('meta').notNullable().defaultTo('{}');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
