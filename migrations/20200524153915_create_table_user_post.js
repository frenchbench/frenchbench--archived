const tableName = 'user_post';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');
    table.text('post').notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
