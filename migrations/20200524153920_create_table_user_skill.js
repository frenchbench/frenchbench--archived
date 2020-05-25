const tableName = 'user_skill';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');
    table.string('skill', 100).notNullable().index();
    table.integer('stars').notNullable().defaultTo(1).index();
    table.integer('order_idx').notNullable().defaultTo(0).index();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
