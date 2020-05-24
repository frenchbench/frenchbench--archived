const tableName = 'asset';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.string('asset_type', 50);
    table.string('media_type', 50);
    table.string('label', 50);
    table.string('url', 255);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
