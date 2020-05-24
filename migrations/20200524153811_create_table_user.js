const tableName = 'user';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.string('username', 50).unique();
    table.string('email', 100).unique();
    table.text('password_hash');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
