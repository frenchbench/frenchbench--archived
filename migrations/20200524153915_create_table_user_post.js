const tableName = 'user_post';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.uuid('user_id').index()
      .references('id').inTable('user')
      .onDelete('cascade');
    table.text('post');
    table.uuid('asset_id').index()
      .references('id').inTable('asset')
      .onDelete('set null');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
