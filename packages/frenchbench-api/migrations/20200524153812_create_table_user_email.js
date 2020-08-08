const tableName = 'tbl_user_email';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();

    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');

    table.string('email', 100).notNullable().unique();

    table.timestamp('created_at', { useTz: true }).notNullable();
    table.timestamp('updated_at', { useTz: true }).notNullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
