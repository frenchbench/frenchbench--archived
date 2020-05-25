const tableName = 'user';

exports.up = (knex) => {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').notNullable().primary()
      .references('id').inTable('entity')
      .onDelete('cascade');
    table.string('username', 50).notNullable().unique();
    table.string('email', 100).notNullable().unique();
    table.text('password_hash').notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(tableName);
};
