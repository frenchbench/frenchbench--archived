const tableName = 'tbl_user_achievement';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();

    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');

    table.string('achievement', 100).notNullable();
    table.string('organisation', 100).nullable();
    table.date('date_from').nullable();
    table.date('date_to').nullable();
    table.text('info').nullable();
    table.integer('order_idx').defaultTo(0).index();

    table.timestamp('created_at', { useTz: true }).notNullable();
    table.timestamp('updated_at', { useTz: true }).notNullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
