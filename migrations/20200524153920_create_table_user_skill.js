const tableName = 'user_skill';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.uuid('user_id').index()
      .references('id').inTable('user')
      .onDelete('cascade');
    table.string('skill', 100).index();
    table.integer('stars').defaultTo(1).index();
    table.integer('order_idx').defaultTo(0).index();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
