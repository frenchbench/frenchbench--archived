const tableName = 'tbl_user_skill';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();

    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');

    table.string('skill', 100).notNullable().index();
    table.integer('stars').notNullable().defaultTo(1).index();
    table.integer('order_idx').notNullable().defaultTo(0).index();

    table.timestamp('created_at', { useTz: true }).notNullable();
    table.timestamp('updated_at', { useTz: true }).notNullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();

    table.index(['user_id', 'order_idx']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
