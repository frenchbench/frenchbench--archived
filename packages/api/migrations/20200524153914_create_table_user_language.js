const tableName = 'tbl_user_language';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();

    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');

    table.string('language', 100).notNullable();
    table.integer('stars').notNullable().index();
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
