const tableName = 'tbl_user_post';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary();

    table.uuid('user_id').notNullable().index()
      .references('id').inTable('user')
      .onDelete('cascade');

    table.string('post_ref', 100).notNullable();
    table.text('title').notNullable();
    table.text('summary').nullable();
    table.text('tags').nullable();
    table.text('content').notNullable();

    table.timestamp('created_at', { useTz: true }).notNullable();
    table.timestamp('updated_at', { useTz: true }).notNullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();

    table.unique(['user_id', 'post_ref']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
