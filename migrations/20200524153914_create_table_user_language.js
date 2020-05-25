const tableName = 'user_language';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');
    table.string('language', 100).notNullable();
    table.integer('stars').notNullable().index();
    table.integer('order_idx').notNullable().defaultTo(0).index();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
